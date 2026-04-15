/**
 * 铁杵成针：从全库词条中筛选「较难」实词，取难度分最高的约 300 个。
 * 难度依据：字母数、拉丁/希腊词缀（-tion、-ology、dis- 等）、长词加权；排除短语与非字母杂项。
 */
(function (global) {
  var TARGET_COUNT = 300;

  function trimEnglishLemma(en) {
    return String(en == null ? "" : en).replace(/\s+/g, " ").trim();
  }

  function difficultyScore(en) {
    var raw = trimEnglishLemma(en);
    if (!raw) return -999;
    var s = raw.toLowerCase();
    if (s.indexOf(" ") !== -1) return -1;
    if (!/^[a-zA-Z\-]+$/.test(s)) return -1;

    var len = s.length;
    var score = len * 3;
    if (len <= 3) score -= 50;
    if (len <= 4) score -= 28;

    if (
      /(tion|sion|cious|tious|ology|ography|graphy|pathy|ment|ness|able|ible|eous|ious|ance|ence|ular|ival|ize|ise|ify|ward|hood|ship|less|fully|ally|ously|eous|ous|ive|ity|ical|able)$/.test(
        s
      )
    ) {
      score += 40;
    }
    if (
      /^(dis|un|re|pre|inter|over|under|anti|sub|non|ex|de|mis|fore|counter|pro|trans|super|auto|tele|cir|con|com|col|cor|out|per|with|after|para|pseudo|poly|mono|semi|bi|tri)/.test(
        s
      )
    ) {
      score += 22;
    }
    if (len >= 13) score += 28;
    else if (len >= 11) score += 20;
    else if (len >= 9) score += 14;
    else if (len >= 7) score += 8;

    if (
      typeof WordPolicy !== "undefined" &&
      WordPolicy.isBlocked &&
      WordPolicy.isBlocked(raw)
    ) {
      score -= 45;
    } else if (
      typeof WordPolicy !== "undefined" &&
      WordPolicy.getWeight &&
      WordPolicy.getWeight(raw) < 1
    ) {
      score -= 15;
    }

    return score;
  }

  function collectAllScored() {
    if (typeof words === "undefined" || !words.length) return [];

    var pairCount = words.length / 2;
    var bestByKey = {};

    for (var i = 0; i < pairCount; i++) {
      var raw = words[i * 2];
      if (
        typeof WordPolicy !== "undefined" &&
        WordPolicy.isBlocked &&
        WordPolicy.isBlocked(raw)
      ) {
        continue;
      }

      var t = trimEnglishLemma(raw);
      if (!t || t.indexOf(" ") !== -1) continue;

      var sc = difficultyScore(t);
      if (sc < -80) continue;

      var key =
        typeof WordPolicy !== "undefined" && WordPolicy.normalizeEnglish
          ? WordPolicy.normalizeEnglish(t)
          : t.toLowerCase();

      if (!bestByKey[key] || sc > bestByKey[key].score) {
        bestByKey[key] = { score: sc, idx: i, w: t };
      }
    }

    var arr = [];
    for (var k in bestByKey) {
      if (bestByKey.hasOwnProperty(k)) {
        arr.push(bestByKey[k]);
      }
    }

    arr.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.w.localeCompare(b.w, "en");
    });

    return arr;
  }

  function buildHardWordIndices() {
    var arr = collectAllScored();
    var out = [];
    var n = Math.min(TARGET_COUNT, arr.length);
    for (var i = 0; i < n; i++) {
      out.push(arr[i].idx);
    }
    return out;
  }

  /** 合并用户手动标注的难词索引（localStorage），不重复加入 */
  function mergeUserNeedlePool(base) {
    var extra =
      typeof global.QuizStorage !== "undefined" &&
      global.QuizStorage.getNeedleIndices
        ? global.QuizStorage.getNeedleIndices()
        : [];
    var seen = {};
    var out = [];
    var i;
    var max = typeof words !== "undefined" ? words.length / 2 : 0;
    for (i = 0; i < base.length; i++) {
      seen[base[i]] = true;
      out.push(base[i]);
    }
    for (i = 0; i < extra.length; i++) {
      var ix = extra[i];
      if (typeof ix !== "number" || ix < 0 || ix >= max) continue;
      if (!seen[ix]) {
        seen[ix] = true;
        out.push(ix);
      }
    }
    return out;
  }

  global.HARD_WORD_INDICES = [];
  global.HARD_WORD_BASE_COUNT = 0;
  global.HARD_WORD_POOL_SIZE = 0;

  function initHardPool() {
    var base = buildHardWordIndices();
    global.HARD_WORD_BASE_COUNT = base.length;
    global.HARD_WORD_INDICES = mergeUserNeedlePool(base);
    global.HARD_WORD_POOL_SIZE = global.HARD_WORD_INDICES.length;
  }

  if (typeof words !== "undefined") {
    initHardPool();
  }
})(typeof window !== "undefined" ? window : this);
