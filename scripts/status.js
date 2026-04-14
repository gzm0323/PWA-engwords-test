
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
      '<button type="button" class="quiz-master-btn quiz-master-btn-cancel" data-word-index="' +
      k +
      '" aria-label="取消已掌握，该词将重新参与随机出题">取消已掌握</button>'
    );
  }
  return (
    '<button type="button" class="quiz-master-btn" data-word-index="' +
    k +
    '" aria-label="标记为已掌握，主练与铁杵成针中不再随机出现">已掌握</button>'
  );
}

function buildNeedleButton(k) {
  if (isNeedleIndex(k)) {
    return (
      '<button type="button" class="quiz-needle-btn quiz-needle-btn-cancel" data-word-index="' +
      k +
      '" aria-label="从铁杵成针难词库移出">移出难词库</button>'
    );
  }
  return (
    '<button type="button" class="quiz-needle-btn" data-word-index="' +
    k +
    '" aria-label="加入铁杵成针难词库">加入难词库</button>'
  );
}

function buildPromptActions(k) {
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
  var zh = words[k * 2 + 1];
  return (
    '<td class="quiz-prompt"><span class="quiz-prompt-text">' +
    escQuiz(zh) +
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
  var user =
    typeof QuizStorage !== "undefined" && QuizStorage.getActiveUser
      ? QuizStorage.getActiveUser()
      : "guest";
  a.download = "engwords-mastered-" + user + ".csv";
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
  var user =
    typeof QuizStorage !== "undefined" && QuizStorage.getActiveUser
      ? QuizStorage.getActiveUser()
      : "guest";
  a.download = "engwords-needle-" + user + ".csv";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function refreshActiveUserLabel() {
  var name = "guest";
  if (typeof QuizStorage !== "undefined" && QuizStorage.getActiveUser) {
    name = QuizStorage.getActiveUser();
  }
  $("#current-user-name").text(name);
  $("#login-user-input").attr("placeholder", "当前用户：" + name);
}

$(function () {
  refreshActiveUserLabel();

  $(document).on("click", "#btn-login-user", function () {
    if (typeof QuizStorage === "undefined" || !QuizStorage.setActiveUser) return;
    var raw = $("#login-user-input").val();
    var name = QuizStorage.setActiveUser(raw);
    $("#login-user-input").val("");
    $("#current-user-name").text(name);
    // 切换用户后刷新，确保题池和标记同步到当前用户。
    window.location.reload();
  });

  $(document).on("keydown", "#login-user-input", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      $("#btn-login-user").trigger("click");
    }
  });

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
        .text("加入难词库")
        .attr("aria-label", "加入铁杵成针难词库");
    } else {
      if (!QuizStorage.addNeedleIndex) return;
      QuizStorage.addNeedleIndex(ix);
      $btn
        .addClass("quiz-needle-btn-cancel")
        .text("移出难词库")
        .attr("aria-label", "从铁杵成针难词库移出");
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
        .text("已掌握")
        .attr(
          "aria-label",
          "标记为已掌握，主练与铁杵成针中不再随机出现"
        );
    } else {
      if (!QuizStorage.addMasteredIndex) return;
      QuizStorage.addMasteredIndex(ix);
      $btn
        .addClass("quiz-master-btn-cancel")
        .text("取消已掌握")
        .attr(
          "aria-label",
          "取消已掌握，该词将重新参与随机出题"
        );
    }
  });

  $(document).on("click", "#btn-export-mastered", function () {
    exportMasteredListDownload();
  });

  $(document).on("click", "#btn-export-needle", function () {
    exportNeedleListDownload();
  });
});
