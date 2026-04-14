/**
 * 按用户保存练习状态（本地 localStorage）：
 * - 难词池（铁杵成针手动加入）
 * - 已掌握池（主练可排除）
 * - 当前登录用户
 */
(function (global) {
  var KEY_ACTIVE_USER = "engwords_active_user";
  var KEY_USERS = "engwords_users";
  var KEY_NEEDLE = "engwords_needle_indices";
  var KEY_MASTERED = "engwords_mastered_indices";

  function normalizeUserName(name) {
    var s = String(name == null ? "" : name).replace(/\s+/g, " ").trim();
    if (!s) return "guest";
    if (s.length > 32) s = s.slice(0, 32);
    return s;
  }

  function getActiveUser() {
    try {
      var s = localStorage.getItem(KEY_ACTIVE_USER);
      return normalizeUserName(s || "guest");
    } catch (e) {
      return "guest";
    }
  }

  function getScopedKey(base) {
    return base + "::" + getActiveUser();
  }

  function readArray(base) {
    try {
      var scoped = localStorage.getItem(getScopedKey(base));
      if (!scoped) {
        // 兼容历史单用户数据：仅在 guest 下兜底读取。
        if (getActiveUser() === "guest") {
          var legacy = localStorage.getItem(base);
          if (legacy) {
            var oldArr = JSON.parse(legacy);
            if (Array.isArray(oldArr)) return oldArr;
          }
        }
        return [];
      }
      var arr = JSON.parse(scoped);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function writeArray(base, arr) {
    try {
      localStorage.setItem(getScopedKey(base), JSON.stringify(arr));
    } catch (e) {}
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

  function ensureUserExists(name) {
    var u = normalizeUserName(name);
    var users = getUsers();
    var seen = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i] === u) {
        seen = true;
        break;
      }
    }
    if (!seen) {
      users.push(u);
      try {
        localStorage.setItem(KEY_USERS, JSON.stringify(users));
      } catch (e) {}
    }
  }

  function setActiveUser(name) {
    var u = normalizeUserName(name);
    ensureUserExists(u);
    try {
      localStorage.setItem(KEY_ACTIVE_USER, u);
    } catch (e) {}
    return u;
  }

  function getNeedleIndices() {
    return readArray(KEY_NEEDLE);
  }

  function getWrongIndices() {
    // 兼容旧接口名。
    return getNeedleIndices();
  }

  function getMasteredIndices() {
    return readArray(KEY_MASTERED);
  }

  function addNeedleIndex(ix) {
    if (typeof ix !== "number" || ix < 0) return;
    var cur = getNeedleIndices();
    var seen = {};
    var i;
    for (i = 0; i < cur.length; i++) {
      seen[cur[i]] = true;
    }
    if (seen[ix]) return;
    cur.push(ix);
    writeArray(KEY_NEEDLE, cur);
  }

  function removeNeedleIndex(ix) {
    if (typeof ix !== "number" || ix < 0) return;
    var cur = getNeedleIndices().filter(function (i) {
      return i !== ix;
    });
    writeArray(KEY_NEEDLE, cur);
  }

  function addWrongIndices(indices) {
    // 兼容旧接口：改为加入难词池。
    if (!indices || !indices.length) return;
    for (var i = 0; i < indices.length; i++) {
      addNeedleIndex(indices[i]);
    }
  }

  function addMasteredIndex(ix) {
    if (typeof ix !== "number" || ix < 0) return;
    removeNeedleIndex(ix);
    var cur = getMasteredIndices();
    var seen = {};
    var i;
    for (i = 0; i < cur.length; i++) {
      seen[cur[i]] = true;
    }
    if (seen[ix]) return;
    cur.push(ix);
    writeArray(KEY_MASTERED, cur);
  }

  function removeMasteredIndex(ix) {
    if (typeof ix !== "number" || ix < 0) return;
    var cur = getMasteredIndices().filter(function (i) {
      return i !== ix;
    });
    writeArray(KEY_MASTERED, cur);
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
    getActiveUser: getActiveUser,
    setActiveUser: setActiveUser,
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
