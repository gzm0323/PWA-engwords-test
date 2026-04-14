/**
 * 勤学不辍：从难词库中抽取 5 组中英词条，进行点击配对练习。
 */
(function () {
  var ROUND_SIZE = 5;
  var state = {
    pairs: [],
    matched: {},
    selectedEnId: null,
    selectedZhId: null
  };

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function trimText(text) {
    return String(text == null ? "" : text).replace(/\s+/g, " ").trim();
  }

  function shuffle(arr) {
    var out = arr.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function getNeedlePool() {
    var fromHard =
      typeof HARD_WORD_INDICES !== "undefined" && HARD_WORD_INDICES.length
        ? HARD_WORD_INDICES.slice()
        : [];
    if (fromHard.length > 0) return fromHard;

    var pairCount = typeof words !== "undefined" ? words.length / 2 : 0;
    var all = [];
    for (var i = 0; i < pairCount; i++) {
      all.push(i);
    }
    return all;
  }

  function pickRoundPairs() {
    if (typeof words === "undefined" || !words.length) return [];
    var pool = shuffle(getNeedlePool());
    var picked = [];
    var seen = {};
    var max = Math.min(ROUND_SIZE, pool.length);

    for (var i = 0; i < pool.length && picked.length < max; i++) {
      var idx = pool[i];
      if (seen[idx]) continue;

      var en = trimText(words[idx * 2]);
      var zh = trimText(words[idx * 2 + 1]);
      if (!en || !zh) continue;

      seen[idx] = true;
      picked.push({
        id: "pair-" + idx,
        idx: idx,
        en: en,
        zh: zh
      });
    }

    return picked;
  }

  function updateProgress() {
    var done = Object.keys(state.matched).length;
    var total = state.pairs.length;
    $("#sentence-progress").text("进度：" + done + " / " + total);
  }

  function clearSelection() {
    state.selectedEnId = null;
    state.selectedZhId = null;
    $(".pairing-item").removeClass("is-selected");
  }

  function renderRound() {
    var enList = $("#pairing-en-list");
    var zhList = $("#pairing-zh-list");
    enList.empty();
    zhList.empty();

    if (!state.pairs.length) {
      $("#sentence-progress").text("进度：0 / 0");
      return;
    }

    var enItems = shuffle(state.pairs.map(function (p) {
      return {
        id: p.id,
        text: p.en
      };
    }));
    var zhItems = shuffle(state.pairs.map(function (p) {
      return {
        id: p.id,
        text: p.zh
      };
    }));

    for (var i = 0; i < enItems.length; i++) {
      enList.append(
        '<button type="button" class="pairing-item pairing-en" data-id="' +
          enItems[i].id +
          '">' +
          escapeHtml(enItems[i].text) +
          "</button>"
      );
    }

    for (var j = 0; j < zhItems.length; j++) {
      zhList.append(
        '<button type="button" class="pairing-item pairing-zh" data-id="' +
          zhItems[j].id +
          '">' +
          escapeHtml(zhItems[j].text) +
          "</button>"
      );
    }

    updateProgress();
  }

  function markPairResult(isMatch, enId, zhId) {
    var enBtn = $('.pairing-en[data-id="' + enId + '"]');
    var zhBtn = $('.pairing-zh[data-id="' + zhId + '"]');
    if (isMatch) {
      enBtn.removeClass("is-selected").addClass("is-matched").prop("disabled", true);
      zhBtn.removeClass("is-selected").addClass("is-matched").prop("disabled", true);
      state.matched[enId] = true;
      updateProgress();
      return;
    }
    enBtn.removeClass("is-selected").addClass("is-wrong");
    zhBtn.removeClass("is-selected").addClass("is-wrong");
    setTimeout(function () {
      enBtn.removeClass("is-wrong");
      zhBtn.removeClass("is-wrong");
    }, 320);
  }

  function tryMatch() {
    if (!state.selectedEnId || !state.selectedZhId) return;
    var ok = state.selectedEnId === state.selectedZhId;
    markPairResult(ok, state.selectedEnId, state.selectedZhId);
    clearSelection();
  }

  function startNewRound() {
    state.pairs = pickRoundPairs();
    state.matched = {};
    state.selectedEnId = null;
    state.selectedZhId = null;
    renderRound();
  }

  function resetCurrentRound() {
    state.matched = {};
    state.selectedEnId = null;
    state.selectedZhId = null;
    renderRound();
  }

  $(function () {
    $("#pairing-en-list").on("click", ".pairing-en", function () {
      var id = $(this).attr("data-id");
      if (state.matched[id]) return;
      $(".pairing-en").removeClass("is-selected");
      $(this).addClass("is-selected");
      state.selectedEnId = id;
      tryMatch();
    });

    $("#pairing-zh-list").on("click", ".pairing-zh", function () {
      var id = $(this).attr("data-id");
      if (state.matched[id]) return;
      $(".pairing-zh").removeClass("is-selected");
      $(this).addClass("is-selected");
      state.selectedZhId = id;
      tryMatch();
    });

    $("#btn-new-round").on("click", function () {
      startNewRound();
    });

    $("#btn-reset-round").on("click", function () {
      resetCurrentRound();
    });

    startNewRound();
  });
})();
