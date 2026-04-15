
function isMobileLayout() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 520px)").matches
  );
}

function escQuiz(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function resetAnswerUI(tagName) {
  $("#btn2 info").attr("text", "no");
  $("#btn2 info").text("显示答案");
  $("#words-table " + tagName).attr("style", "display:none");
  $("#words-table td.quiz-answer-cell").removeClass(
    "quiz-cell-correct quiz-cell-wrong"
  );
}

function showQuizHint() {
  $("#content .quiz-hint, #content .quiz-light-legend").stop(true, true).slideDown(120);
}

/** 未掌握词条不足时不再按「已掌握」过滤，避免题库被抽空。 */
var QUIZ_MIN_UNMASTERED = 12;

function isMasteredIndex(ix) {
  if (typeof QuizStorage === "undefined" || !QuizStorage.getMasteredIndices) {
    return false;
  }
  var m = QuizStorage.getMasteredIndices();
  var i;
  for (i = 0; i < m.length; i++) {
    if (m[i] === ix) return true;
  }
  return false;
}

function isNeedleIndex(ix) {
  if (typeof QuizStorage === "undefined" || !QuizStorage.getNeedleIndices) {
    return false;
  }
  var m = QuizStorage.getNeedleIndices();
  for (var i = 0; i < m.length; i++) {
    if (m[i] === ix) return true;
  }
  return false;
}

function buildMasterButton(k) {
  if (isMasteredIndex(k)) {
    return (
      '<button type="button" class="quiz-master-btn quiz-light-btn quiz-master-btn-cancel" data-word-index="' +
      k +
      '" title="已掌握（再次点击取消）" aria-label="已掌握（再次点击取消）"></button>'
    );
  }
  return (
    '<button type="button" class="quiz-master-btn quiz-light-btn" data-word-index="' +
    k +
    '" title="标记已掌握（绿灯）" aria-label="标记已掌握（绿灯）"></button>'
  );
}

function buildNeedleButton(k) {
  if (isNeedleIndex(k)) {
    return (
      '<button type="button" class="quiz-needle-btn quiz-light-btn quiz-needle-btn-cancel" data-word-index="' +
      k +
      '" title="已加入难词库（再次点击移出）" aria-label="已加入难词库（再次点击移出）"></button>'
    );
  }
  return (
    '<button type="button" class="quiz-needle-btn quiz-light-btn" data-word-index="' +
    k +
    '" title="加入难词库（红灯）" aria-label="加入难词库（红灯）"></button>'
  );
}

function buildPromptActions(k) {
  var isNeedle = $("#content").hasClass("needle-page");
  if (isNeedle) {
    return (
      '<span class="quiz-prompt-actions">' +
      buildMasterButton(k) +
      "</span>"
    );
  }
  return (
    '<span class="quiz-prompt-actions">' +
    buildNeedleButton(k) +
    buildMasterButton(k) +
    "</span>"
  );
}

function buildMasteredBaseExclude(pairCount) {
  var ex = {};
  if (typeof QuizStorage === "undefined" || !QuizStorage.getMasteredIndices) {
    return ex;
  }
  var m = QuizStorage.getMasteredIndices();
  var unmastered = pairCount - m.length;
  if (unmastered < QUIZ_MIN_UNMASTERED) {
    return ex;
  }
  var i;
  for (i = 0; i < m.length; i++) {
    ex[m[i]] = true;
  }
  return ex;
}

function pickWordIndexForRound(exclude) {
  var pairCount = words.length / 2;
  
  if (typeof QuizStorage !== "undefined" && QuizStorage.getNeedleIndices) {
    var needleIndices = QuizStorage.getNeedleIndices();
    // 增加出题频率：从 40% 提升至 60% 概率优先从难词库抽词
    if (needleIndices.length > 0 && Math.random() < 0.6) {
      var kNeedle = needleIndices[Math.floor(Math.random() * needleIndices.length)];
      if (kNeedle >= 0 && kNeedle < pairCount && !exclude[kNeedle]) {
        exclude[kNeedle] = true;
        return kNeedle;
      }
    }
  }

  if (typeof WordPolicy !== "undefined" && WordPolicy.pickIndex) {
    var idx = WordPolicy.pickIndex(words, exclude);
    exclude[idx] = true;
    return idx;
  }
  var k;
  var tries = 0;
  while (tries < pairCount * 8) {
    k = Math.floor(pairCount * Math.random());
    if (!exclude[k]) {
      exclude[k] = true;
      return k;
    }
    tries++;
  }
  k = Math.floor(pairCount * Math.random());
  exclude[k] = true;
  return k;
}

function buildEtoCAnswerCell(k) {
  var en = words[k * 2];
  var zh = words[k * 2 + 1];
  return (
    '<td class="quiz-prompt"><span class="quiz-prompt-text">' +
    escQuiz(en) +
    "</span>" +
    buildPromptActions(k) +
    '</td><td class="quiz-answer-cell" data-word-index="' +
    k +
    '"><input type="text" class="quiz-input" autocomplete="off" spellcheck="false" /><chinese style="display:none">' +
    escQuiz(zh) +
    "</chinese></td>"
  );
}

function buildCtoEAnswerCell(k) {
  var en = words[k * 2];
  var rawZh = words[k * 2 + 1];

  var zhMatches = String(rawZh == null ? "" : rawZh).match(/[\u4e00-\u9fa5]+/g);
  var displayZh = rawZh;
  if (zhMatches && zhMatches.length > 0) {
    var validZh = [];
    for (var i = 0; i < zhMatches.length; i++) {
      var m = zhMatches[i];
      var ignores = /^(美|英|名|动|形|副|代|介|连|叹|数|冠|及|物|词|复数|过去式|过去分词|现在分词|单数|比较级|最高级|名词|动词|形容词|副词|代词|介词|连词|叹词|数词|冠词)$/;
      if (!ignores.test(m)) {
        validZh.push(m);
      }
    }
    if (validZh.length > 0) {
      displayZh = validZh[Math.floor(Math.random() * validZh.length)];
    } else {
      displayZh = zhMatches[Math.floor(Math.random() * zhMatches.length)];
    }
  }

  return (
    '<td class="quiz-prompt"><span class="quiz-prompt-text">' +
    escQuiz(displayZh) +
    "</span>" +
    buildPromptActions(k) +
    '</td><td class="quiz-answer-cell" data-word-index="' +
    k +
    '"><input type="text" class="quiz-input" autocomplete="off" spellcheck="false" /><english style="display:none">' +
    escQuiz(en) +
    "</english></td>"
  );
}

function getEnglishWords() {
  showQuizHint();
  var content = $("#content table");
  $("#content table tr").remove();
  var pairCount = words.length / 2;
  var exclude = buildMasteredBaseExclude(pairCount);
  var i;
  var k1;
  var k2;

  if (isMobileLayout()) {
    for (i = 0; i < 10; i++) {
      k1 = pickWordIndexForRound(exclude);
      content.append("<tr>" + buildEtoCAnswerCell(k1) + "</tr>");
    }
    resetAnswerUI("chinese");
    return;
  }

  for (i = 0; i < 5; i++) {
    k1 = pickWordIndexForRound(exclude);
    k2 = pickWordIndexForRound(exclude);
    content.append(
      "<tr>" + buildEtoCAnswerCell(k1) + buildEtoCAnswerCell(k2) + "</tr>"
    );
  }
  resetAnswerUI("chinese");
}

function getChineseWords() {
  showQuizHint();
  var content = $("#content table");
  $("#content table tr").remove();
  var pairCount = words.length / 2;
  var exclude = buildMasteredBaseExclude(pairCount);
  var i;
  var k1;
  var k2;

  if (isMobileLayout()) {
    for (i = 0; i < 10; i++) {
      k1 = pickWordIndexForRound(exclude);
      content.append("<tr>" + buildCtoEAnswerCell(k1) + "</tr>");
    }
    resetAnswerUI("english");
    return;
  }

  for (i = 0; i < 5; i++) {
    k1 = pickWordIndexForRound(exclude);
    k2 = pickWordIndexForRound(exclude);
    content.append(
      "<tr>" + buildCtoEAnswerCell(k1) + buildCtoEAnswerCell(k2) + "</tr>"
    );
  }
  resetAnswerUI("english");
}

function showAnswer(Str) {
  var info = $("#btn2 info").attr("text");
  if (info === "no") {
    $("#btn2 info").attr("text", "yes");
    $("#words-table " + Str).attr("style", "display:inline");
    $("#btn2 info").text("关闭答案");
  } else {
    $("#btn2 info").attr("text", "no");
    $("#words-table " + Str).attr("style", "display:none");
    $("#btn2 info").text("显示答案");
  }
}

function exportMasteredListDownload() {
  if (typeof words === "undefined" || typeof QuizStorage === "undefined") {
    return;
  }
  if (!QuizStorage.getMasteredExportCsv) {
    return;
  }
  var csv = QuizStorage.getMasteredExportCsv(words);
  var blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "engwords-mastered.csv";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportNeedleListDownload() {
  if (typeof words === "undefined" || typeof QuizStorage === "undefined") {
    return;
  }
  if (!QuizStorage.getNeedleExportCsv) {
    return;
  }
  var csv = QuizStorage.getNeedleExportCsv(words);
  var blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "engwords-needle.csv";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

var TOAST_TIMER = null;
function showToast(msg, kind) {
  var $t = $("#app-toast");
  if ($t.length === 0) {
    $("body").append('<div id="app-toast" class="app-toast" aria-live="polite"></div>');
    $t = $("#app-toast");
  }
  $t.removeClass("toast-success toast-error toast-info toast-show");
  $t.addClass("toast-show");
  $t.addClass(kind ? "toast-" + kind : "toast-info");
  $t.text(msg);
  if (TOAST_TIMER) {
    clearTimeout(TOAST_TIMER);
  }
  TOAST_TIMER = setTimeout(function () {
    $t.removeClass("toast-show");
  }, 1700);
}

$(function () {
  $(document).on("click", ".quiz-needle-btn", function () {
    var $btn = $(this);
    var ix = parseInt($btn.attr("data-word-index"), 10);
    if (isNaN(ix)) return;
    if (typeof QuizStorage === "undefined") return;
    if ($btn.hasClass("quiz-needle-btn-cancel")) {
      if (!QuizStorage.removeNeedleIndex) return;
      QuizStorage.removeNeedleIndex(ix);
      $btn
        .removeClass("quiz-needle-btn-cancel")
        .attr("aria-label", "加入难词库（红灯）")
        .attr("title", "加入难词库（红灯）");
      showToast("已移出难词库。", "info");
    } else {
      if (!QuizStorage.addNeedleIndex) return;
      QuizStorage.addNeedleIndex(ix);
      $btn
        .addClass("quiz-needle-btn-cancel")
        .attr("aria-label", "已加入难词库（再次点击移出）")
        .attr("title", "已加入难词库（再次点击移出）");
      showToast("已加入难词库。", "success");
    }
  });

  $(document).on("click", ".quiz-master-btn", function () {
    var $btn = $(this);
    var ix = parseInt($btn.attr("data-word-index"), 10);
    if (isNaN(ix)) return;
    if (typeof QuizStorage === "undefined") return;

    if ($btn.hasClass("quiz-master-btn-cancel")) {
      if (!QuizStorage.removeMasteredIndex) return;
      QuizStorage.removeMasteredIndex(ix);
      $btn
        .removeClass("quiz-master-btn-cancel")
        .attr("aria-label", "标记已掌握（绿灯）")
        .attr("title", "标记已掌握（绿灯）");
      showToast("已取消掌握标记。", "info");
    } else {
      if (!QuizStorage.addMasteredIndex) return;
      QuizStorage.addMasteredIndex(ix);
      $btn
        .addClass("quiz-master-btn-cancel")
        .attr("aria-label", "已掌握（再次点击取消）")
        .attr("title", "已掌握（再次点击取消）");
      showToast("单词已掌握。", "success");
    }
  });

  $(document).on("click", "#btn-export-mastered", function () {
    exportMasteredListDownload();
  });

  $(document).on("click", "#btn-export-needle", function () {
    exportNeedleListDownload();
  });
});
