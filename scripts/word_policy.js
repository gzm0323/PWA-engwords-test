/**
 * 出题策略：屏蔽过短/虚词；对通用高频词表前 100 词降权抽样。
 * 词频表来源：EnglishClub / Oxford English Corpus 常见 100 词（写作）。
 */
(function (global) {
  var TOP100_LIST = (
    "the be to of and a in that have i it for not on with he as you do at " +
    "this but his by from they we say her she or an will my one all would " +
    "there their what so up out if about who get which go me when make can " +
    "like time no just him know take person into year your good some could " +
    "them see other than then now look only come its over think also back " +
    "after use two how our work first well way even new want because any " +
    "these give day most us"
  )
    .trim()
    .split(/\s+/);

  var TOP100 = {};
  for (var ti = 0; ti < TOP100_LIST.length; ti++) {
    TOP100[TOP100_LIST[ti]] = true;
  }

  /**
   * 长度 >2 仍屏蔽的核心虚词/功能词（小写）。
   * 介词短语类实词（如 about, after）不在这里屏蔽，交给词频降权。
   */
  var BLOCK_EXACT = {
    the: true,
    and: true,
    but: true,
    nor: true,
    not: true,
    for: true,
    are: true,
    was: true,
    were: true,
    been: true,
    being: true,
    can: true,
    could: true,
    shall: true,
    should: true,
    will: true,
    would: true,
    may: true,
    must: true,
    might: true,
    has: true,
    had: true,
    have: true,
    does: true,
    did: true,
    its: true,
    with: true,
    from: true,
    this: true,
    that: true,
    these: true,
    those: true,
    who: true,
    whom: true,
    whose: true,
    which: true,
    what: true,
    when: true,
    where: true,
    why: true,
    how: true,
    than: true,
    then: true,
    such: true,
    each: true,
    every: true,
    both: true,
    either: true,
    neither: true,
  };

  var TOP100_WEIGHT = 0.2;
  var NORMAL_WEIGHT = 1;

  function normalizeEnglish(en) {
    return String(en == null ? "" : en)
      .trim()
      .toLowerCase();
  }

  function isBlocked(english) {
    var n = normalizeEnglish(english);
    if (!n) return true;
    if (n.length <= 2) return true;
    if (BLOCK_EXACT[n]) return true;
    return false;
  }

  function getWeight(english) {
    if (isBlocked(english)) return 0;
    var n = normalizeEnglish(english);
    return TOP100[n] ? TOP100_WEIGHT : NORMAL_WEIGHT;
  }

  /**
   * 按权重随机选一个词条下标（可重复抽样用）。exclude 为已选下标集合时跳过。
   */
  function pickIndex(words, exclude) {
    var pairCount = words.length / 2;
    var total = 0;
    var items = [];
    var i;
    for (i = 0; i < pairCount; i++) {
      if (exclude && exclude[i]) continue;
      var w = getWeight(words[i * 2]);
      if (w <= 0) continue;
      items.push({ i: i, w: w });
      total += w;
    }

    if (total <= 0 || items.length === 0) {
      for (i = 0; i < pairCount; i++) {
        if (exclude && exclude[i]) continue;
        if (!isBlocked(words[i * 2])) {
          items.push({ i: i, w: 1 });
          total += 1;
        }
      }
    }

    if (total <= 0 || items.length === 0) {
      var avail = [];
      for (i = 0; i < pairCount; i++) {
        if (exclude && exclude[i]) continue;
        avail.push(i);
      }
      if (avail.length === 0) return 0;
      return avail[Math.floor(Math.random() * avail.length)];
    }

    var r = Math.random() * total;
    for (var j = 0; j < items.length; j++) {
      r -= items[j].w;
      if (r <= 0) return items[j].i;
    }
    return items[items.length - 1].i;
  }

  global.WordPolicy = {
    normalizeEnglish: normalizeEnglish,
    isBlocked: isBlocked,
    getWeight: getWeight,
    pickIndex: pickIndex,
  };
})(typeof window !== "undefined" ? window : this);
