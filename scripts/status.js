
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

function pickWordIndex() {
  if (typeof WordPolicy !== "undefined" && WordPolicy.pickIndex) {
    return WordPolicy.pickIndex(words, null);
  }
  return Math.floor((words.length / 2) * Math.random());
}

function buildEtoCAnswerCell(k) {
  var en = words[k * 2];
  var zh = words[k * 2 + 1];
  return (
    '<td class="quiz-prompt">' +
    escQuiz(en) +
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
    '<td class="quiz-prompt">' +
    escQuiz(zh) +
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
  var i;
  var k1;
  var k2;

  if (isMobileLayout()) {
    for (i = 0; i < 10; i++) {
      k1 = pickWordIndex();
      content.append("<tr>" + buildEtoCAnswerCell(k1) + "</tr>");
    }
    resetAnswerUI("chinese");
    return;
  }

  for (i = 0; i < 5; i++) {
    k1 = pickWordIndex();
    k2 = pickWordIndex();
    content.append(
      "<tr>" + buildEtoCAnswerCell(k1) + buildEtoCAnswerCell(k2) + "</tr>"
    );
  }
  resetAnswerUI("chinese");
}

function getChineseWords() {
  var content = $("#content table");
  $("#content table tr").remove();
  var i;
  var k1;
  var k2;

  if (isMobileLayout()) {
    for (i = 0; i < 10; i++) {
      k1 = pickWordIndex();
      content.append("<tr>" + buildCtoEAnswerCell(k1) + "</tr>");
    }
    resetAnswerUI("english");
    return;
  }

  for (i = 0; i < 5; i++) {
    k1 = pickWordIndex();
    k2 = pickWordIndex();
    content.append(
      "<tr>" + buildCtoEAnswerCell(k1) + buildCtoEAnswerCell(k2) + "</tr>"
    );
  }
  resetAnswerUI("english");
}

function showAnswerGrading(tagName) {
  var info = $("#btn2 info").attr("text");
  var wrong = [];
  if (info === "no") {
    $("#words-table td.quiz-answer-cell").each(function () {
      var $cell = $(this);
      var idx = parseInt($cell.attr("data-word-index"), 10);
      var user = $cell.find(".quiz-input").val();
      var correct = $cell.find(tagName).text();
      var ok =
        tagName === "chinese"
          ? QuizStorage.answerMatchesChinese(user, correct)
          : QuizStorage.answerMatchesEnglish(user, correct);
      $cell.removeClass("quiz-cell-correct quiz-cell-wrong");
      if (ok) {
        $cell.addClass("quiz-cell-correct");
      } else {
        $cell.addClass("quiz-cell-wrong");
        if (!isNaN(idx)) wrong.push(idx);
      }
      $cell.find(tagName).attr("style", "display:inline");
    });
    if (wrong.length && typeof QuizStorage !== "undefined") {
      QuizStorage.addWrongIndices(wrong);
    }
    $("#btn2 info").attr("text", "yes");
    $("#btn2 info").text("关闭答案");
  } else {
    $("#words-table " + tagName).attr("style", "display:none");
    $("#words-table td.quiz-answer-cell").removeClass(
      "quiz-cell-correct quiz-cell-wrong"
    );
    $("#btn2 info").attr("text", "no");
    $("#btn2 info").text("显示答案");
  }
}

function showAnswer(Str) {
  if ($("#words-table .quiz-input").length > 0) {
    showAnswerGrading(Str);
    return;
  }

  var info = $("button info").attr("text");
  if (info === "no") {
    $("button info").attr("text", "yes");
    $(Str).attr("style", "display:inline");
    B = $("#btn2 info");
    B.text("关闭答案");
  } else {
    $("button info").attr("text", "no");
    $(Str).attr("style", "display:none");
    B = $("#btn2 info");
    B.text("显示答案");
  }
}
