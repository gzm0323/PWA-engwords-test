/**
 * 本地加密的多用户学习状态（用户名 + PIN）：
 * - 难词池（铁杵成针手动加入）
 * - 已掌握池（主练可排除）
 * - 数据加密存储在 localStorage
 */
(function (global) {
  var KEY_ACTIVE_USER = "engwords_active_user";
  var KEY_USERS = "engwords_users";
  var KEY_USER_AUTH = "engwords_user_auth";
  var KEY_NEEDLE = "engwords_needle_indices";
  var KEY_MASTERED = "engwords_mastered_indices";
  var VERIFIER_TEXT = "engwords-pin-ok";
  var PBKDF2_ITERS = 120000;

  var state = {
    activeUser: "guest",
    unlocked: false,
    key: null,
    needle: [],
    mastered: [],
  };

  function normalizeUserName(name) {
    var s = String(name == null ? "" : name).replace(/\s+/g, " ").trim();
    if (!s) return "guest";
    if (s.length > 32) s = s.slice(0, 32);
    return s;
  }

  function normalizePin(pin) {
    return String(pin == null ? "").trim();
  }

  function toB64(bytes) {
    var bin = "";
    for (var i = 0; i < bytes.length; i++) {
      bin += String.fromCharCode(bytes[i]);
    }
    return btoa(bin);
  }

  function fromB64(str) {
    if (!str) return new Uint8Array(0);
    var bin = atob(str);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
      out[i] = bin.charCodeAt(i);
    }
    return out;
  }

  function getUsers() {
    try {
      var s = localStorage.getItem(KEY_USERS);
      var arr = s ? JSON.parse(s) : [];
      if (!Array.isArray(arr) || arr.length === 0) {
        return ["guest"];
      }
      return arr;
    } catch (e) {
      return ["guest"];
    }
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(KEY_USERS, JSON.stringify(users));
    } catch (e) {}
  }

  function ensureUserExists(name) {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i] === name) return;
    }
    users.push(name);
    saveUsers(users);
  }

  function removeUserFromList(name) {
    var users = getUsers().filter(function (u) {
      return u !== name;
    });
    if (users.length === 0) {
      users = ["guest"];
    }
    saveUsers(users);
  }

  function getUserAuthMap() {
    try {
      var s = localStorage.getItem(KEY_USER_AUTH);
      var obj = s ? JSON.parse(s) : {};
      return obj && typeof obj === "object" ? obj : {};
    } catch (e) {
      return {};
    }
  }

  function saveUserAuthMap(map) {
    try {
      localStorage.setItem(KEY_USER_AUTH, JSON.stringify(map));
    } catch (e) {}
  }

  function getScopedKey(base, user) {
    return base + "::" + user;
  }

  function getActiveUser() {
    try {
      var s = localStorage.getItem(KEY_ACTIVE_USER);
      return normalizeUserName(s || state.activeUser || "guest");
    } catch (e) {
      return state.activeUser || "guest";
    }
  }

  function setActiveUserLocal(name) {
    state.activeUser = name;
    try {
      localStorage.setItem(KEY_ACTIVE_USER, name);
    } catch (e) {}
  }

  async function deriveAesKey(pin, saltB64) {
    var enc = new TextEncoder();
    var keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(pin),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: fromB64(saltB64),
        iterations: PBKDF2_ITERS,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptJson(key, obj) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var plain = new TextEncoder().encode(JSON.stringify(obj));
    var cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, plain);
    return {
      iv: toB64(iv),
      data: toB64(new Uint8Array(cipher)),
    };
  }

  async function decryptJson(key, payload, fallback) {
    if (!payload || !payload.iv || !payload.data) return fallback;
    var dec = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromB64(payload.iv) },
      key,
      fromB64(payload.data)
    );
    var txt = new TextDecoder().decode(dec);
    return JSON.parse(txt);
  }

  function readEncryptedPayload(base, user) {
    try {
      var s = localStorage.getItem(getScopedKey(base, user));
      if (!s) return null;
      var p = JSON.parse(s);
      return p && typeof p === "object" ? p : null;
    } catch (e) {
      return null;
    }
  }

  function writeEncryptedPayload(base, user, payload) {
    try {
      localStorage.setItem(getScopedKey(base, user), JSON.stringify(payload));
    } catch (e) {}
  }

  async function saveStateArrays() {
    if (!state.unlocked || !state.key) return;
    try {
      var needlePayload = await encryptJson(state.key, state.needle);
      writeEncryptedPayload(KEY_NEEDLE, state.activeUser, needlePayload);
      var masteredPayload = await encryptJson(state.key, state.mastered);
      writeEncryptedPayload(KEY_MASTERED, state.activeUser, masteredPayload);
    } catch (e) {}
  }

  async function initNewUser(user, pin) {
    var salt = toB64(crypto.getRandomValues(new Uint8Array(16)));
    var key = await deriveAesKey(pin, salt);
    var verifierPayload = await encryptJson(key, { v: VERIFIER_TEXT });

    var auth = getUserAuthMap();
    auth[user] = { salt: salt, verifier: verifierPayload };
    saveUserAuthMap(auth);

    state.activeUser = user;
    state.key = key;
    state.unlocked = true;
    state.needle = [];
    state.mastered = [];

    await saveStateArrays();
    setActiveUserLocal(user);
    ensureUserExists(user);
  }

  async function loadExistingUser(user, pin, authInfo) {
    var key = await deriveAesKey(pin, authInfo.salt);
    var verifier = await decryptJson(key, authInfo.verifier, null);
    if (!verifier || verifier.v !== VERIFIER_TEXT) {
      throw new Error("PIN_INVALID");
    }

    var needlePayload = readEncryptedPayload(KEY_NEEDLE, user);
    var masteredPayload = readEncryptedPayload(KEY_MASTERED, user);
    var needle = await decryptJson(key, needlePayload, []);
    var mastered = await decryptJson(key, masteredPayload, []);

    state.activeUser = user;
    state.key = key;
    state.unlocked = true;
    state.needle = Array.isArray(needle) ? needle : [];
    state.mastered = Array.isArray(mastered) ? mastered : [];
    setActiveUserLocal(user);
    ensureUserExists(user);
  }

  async function loginUser(name, pin) {
    var user = normalizeUserName(name);
    var userPin = normalizePin(pin);
    if (!userPin || userPin.length < 4) {
      throw new Error("PIN_TOO_SHORT");
    }
    var auth = getUserAuthMap();
    var info = auth[user];
    if (!info) {
      await initNewUser(user, userPin);
    } else {
      await loadExistingUser(user, userPin, info);
    }
    return user;
  }

  function logoutUser() {
    state.unlocked = false;
    state.key = null;
    state.needle = [];
    state.mastered = [];
  }

  function resetUserData(name) {
    var user = normalizeUserName(name);
    var auth = getUserAuthMap();
    var existed = !!auth[user];
    if (!existed) {
      return false;
    }
    delete auth[user];
    saveUserAuthMap(auth);
    try {
      localStorage.removeItem(getScopedKey(KEY_NEEDLE, user));
      localStorage.removeItem(getScopedKey(KEY_MASTERED, user));
    } catch (e) {}
    removeUserFromList(user);
    if (state.activeUser === user) {
      logoutUser();
      setActiveUserLocal("guest");
    }
    return true;
  }

  function isUnlocked() {
    return state.unlocked;
  }

  function getNeedleIndices() {
    return state.unlocked ? state.needle.slice() : [];
  }

  function getWrongIndices() {
    // 兼容旧接口名。
    return getNeedleIndices();
  }

  function getMasteredIndices() {
    return state.unlocked ? state.mastered.slice() : [];
  }

  function addNeedleIndex(ix) {
    if (!state.unlocked || typeof ix !== "number" || ix < 0) return;
    var cur = state.needle.slice();
    var seen = {};
    var i;
    for (i = 0; i < cur.length; i++) {
      seen[cur[i]] = true;
    }
    if (seen[ix]) return;
    cur.push(ix);
    state.needle = cur;
    saveStateArrays();
  }

  function removeNeedleIndex(ix) {
    if (!state.unlocked || typeof ix !== "number" || ix < 0) return;
    state.needle = state.needle.filter(function (i) {
      return i !== ix;
    });
    saveStateArrays();
  }

  function addWrongIndices(indices) {
    // 兼容旧接口：改为加入难词池。
    if (!indices || !indices.length) return;
    for (var i = 0; i < indices.length; i++) {
      addNeedleIndex(indices[i]);
    }
  }

  function addMasteredIndex(ix) {
    if (!state.unlocked || typeof ix !== "number" || ix < 0) return;
    removeNeedleIndex(ix);
    var cur = state.mastered.slice();
    var seen = {};
    var i;
    for (i = 0; i < cur.length; i++) {
      seen[cur[i]] = true;
    }
    if (seen[ix]) return;
    cur.push(ix);
    state.mastered = cur;
    saveStateArrays();
  }

  function removeMasteredIndex(ix) {
    if (!state.unlocked || typeof ix !== "number" || ix < 0) return;
    state.mastered = state.mastered.filter(function (i) {
      return i !== ix;
    });
    saveStateArrays();
  }

  function escapeCsvField(s) {
    var t = String(s == null ? "" : s);
    if (/[",\r\n]/.test(t)) {
      return '"' + t.replace(/"/g, '""') + '"';
    }
    return t;
  }

  /** 供导出：表头 index,english,chinese，行为 UTF-8 友好 CSV（字段已转义） */
  function getMasteredExportCsv(words) {
    var header = "index,english,chinese";
    if (!words || !words.length) {
      return header;
    }
    var indices = getMasteredIndices().slice();
    indices.sort(function (a, b) {
      return a - b;
    });
    var rows = [header];
    var i;
    var k;
    var en;
    var zh;
    for (i = 0; i < indices.length; i++) {
      k = indices[i];
      en = words[k * 2] || "";
      zh = words[k * 2 + 1] || "";
      rows.push(
        String(k) + "," + escapeCsvField(en) + "," + escapeCsvField(zh)
      );
    }
    return rows.join("\r\n");
  }

  function getNeedleExportCsv(words) {
    var header = "index,english,chinese";
    if (!words || !words.length) {
      return header;
    }
    var indices = getNeedleIndices().slice();
    indices.sort(function (a, b) {
      return a - b;
    });
    var rows = [header];
    for (var i = 0; i < indices.length; i++) {
      var k = indices[i];
      var en = words[k * 2] || "";
      var zh = words[k * 2 + 1] || "";
      rows.push(
        String(k) + "," + escapeCsvField(en) + "," + escapeCsvField(zh)
      );
    }
    return rows.join("\r\n");
  }

  function normalizeZh(s) {
    return String(s == null ? "" : s)
      .replace(/\s+/g, "")
      .replace(/[，,．.]/g, "");
  }

  function normalizeEn(s) {
    return String(s == null ? "" : s)
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  /** 中文释义可能含多个义项，用分号分隔；英文忽略大小写与首尾空格 */
  function answerMatchesChinese(user, correct) {
    var u = String(user == null ? "" : user).trim();
    var c = String(correct == null ? "" : correct).trim();
    if (!u) return false;
    if (normalizeZh(u) === normalizeZh(c)) return true;
    var parts = c.split(/[；;]/);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim();
      if (!p) continue;
      if (normalizeZh(u) === normalizeZh(p)) return true;
    }
    return false;
  }

  function answerMatchesEnglish(user, correct) {
    var u = normalizeEn(user);
    var c = normalizeEn(correct);
    if (!u) return false;
    return u === c;
  }

  global.QuizStorage = {
    isUnlocked: isUnlocked,
    getActiveUser: getActiveUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
    resetUserData: resetUserData,
    getUsers: getUsers,
    getNeedleIndices: getNeedleIndices,
    addNeedleIndex: addNeedleIndex,
    removeNeedleIndex: removeNeedleIndex,
    getWrongIndices: getWrongIndices,
    getMasteredIndices: getMasteredIndices,
    addWrongIndices: addWrongIndices,
    addMasteredIndex: addMasteredIndex,
    removeMasteredIndex: removeMasteredIndex,
    getMasteredExportCsv: getMasteredExportCsv,
    getNeedleExportCsv: getNeedleExportCsv,
    answerMatchesChinese: answerMatchesChinese,
    answerMatchesEnglish: answerMatchesEnglish
  };
})(typeof window !== "undefined" ? window : this);
