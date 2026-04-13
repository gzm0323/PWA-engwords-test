/**
 * 错题词条索引（localStorage），供「铁杵成针」词池合并使用。
 */
(function (global) {
  var KEY = "engwords_wrong_indices";

  function getWrongIndices() {
    try {
      var s = localStorage.getItem(KEY);
      if (!s) return [];
      var a = JSON.parse(s);
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  function addWrongIndices(indices) {
    if (!indices || !indices.length) return;
    var cur = getWrongIndices();
    var seen = {};
    var i;
    for (i = 0; i < cur.length; i++) {
      seen[cur[i]] = true;
    }
    for (i = 0; i < indices.length; i++) {
      var ix = indices[i];
      if (typeof ix !== "number" || ix < 0) continue;
      if (!seen[ix]) {
        seen[ix] = true;
        cur.push(ix);
      }
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(cur));
    } catch (e) {}
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
    getWrongIndices: getWrongIndices,
    addWrongIndices: addWrongIndices,
    answerMatchesChinese: answerMatchesChinese,
    answerMatchesEnglish: answerMatchesEnglish
  };
})(typeof window !== "undefined" ? window : this);
