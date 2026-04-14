/**
 * 单用户学习状态（localStorage）：
 * - 难词池（铁杵成针手动加入）
 * - 已掌握池（主练可排除）
 */
(function (global) {
  var KEY_NEEDLE = "engwords_needle_indices";
  var KEY_MASTERED = "engwords_mastered_indices";

  function readArray(key) {
    try {
      var s = localStorage.getItem(key);
      if (!s) return [];
      var arr = JSON.parse(s);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function writeArray(key, arr) {
    try {
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {}
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
