/**
 * 铁杵成针：仅在 HARD_WORD_INDICES 中随机出题（英→中 / 中→英）。
 */
function pickWordIndexNeedle() {
  var arr =
    typeof HARD_WORD_INDICES !== "undefined" ? HARD_WORD_INDICES : null;
  if (!arr || arr.length === 0) {
    if (typeof WordPolicy !== "undefined" && WordPolicy.pickIndex) {
      return WordPolicy.pickIndex(words, null);
    }
    return Math.floor((words.length / 2) * Math.random());
  }
  var pool = arr;
  if (typeof QuizStorage !== "undefined" && QuizStorage.getMasteredIndices) {
    var mastered = {};
    var m = QuizStorage.getMasteredIndices();
    var mi;
    for (mi = 0; mi < m.length; mi++) {
      mastered[m[mi]] = true;
    }
    var filtered = [];
    var ai;
    for (ai = 0; ai < arr.length; ai++) {
      var ix = arr[ai];
      if (!mastered[ix]) filtered.push(ix);
    }
    if (filtered.length > 0) {
      pool = filtered;
    }
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickWordIndexNeedleForRound(exclude) {
  var tries = 0;
  var maxTry = Math.max(40, (words.length / 2) * 3);
  var k;
  while (tries < maxTry) {
    k = pickWordIndexNeedle();
    if (!exclude[k]) {
      exclude[k] = true;
      return k;
    }
    tries++;
  }
  return pickWordIndexNeedle();
}

function getNeedleEnglishWords() {
  window.NEEDLE_ANSWER_TAG = "chinese";
  var content = $("#content table");
  $("#content table tr").remove();
  var k1, k2;
  var exclude = {};

  if (isMobileLayout()) {
    for (var i = 0; i < 10; i++) {
      k1 = pickWordIndexNeedleForRound(exclude);
      content.append("<tr>" + buildEtoCAnswerCell(k1) + "</tr>");
    }
    resetAnswerUI("chinese");
    return;
  }

  for (var j = 0; j < 5; j++) {
    k1 = pickWordIndexNeedleForRound(exclude);
    k2 = pickWordIndexNeedleForRound(exclude);
    content.append(
      "<tr>" + buildEtoCAnswerCell(k1) + buildEtoCAnswerCell(k2) + "</tr>"
    );
  }
  resetAnswerUI("chinese");
}

function getNeedleChineseWords() {
  window.NEEDLE_ANSWER_TAG = "english";
  var content = $("#content table");
  $("#content table tr").remove();
  var k1, k2;
  var exclude = {};

  if (isMobileLayout()) {
    for (var i = 0; i < 10; i++) {
      k1 = pickWordIndexNeedleForRound(exclude);
      content.append("<tr>" + buildCtoEAnswerCell(k1) + "</tr>");
    }
    resetAnswerUI("english");
    return;
  }

  for (var j2 = 0; j2 < 5; j2++) {
    k1 = pickWordIndexNeedleForRound(exclude);
    k2 = pickWordIndexNeedleForRound(exclude);
    content.append(
      "<tr>" + buildCtoEAnswerCell(k1) + buildCtoEAnswerCell(k2) + "</tr>"
    );
  }
  resetAnswerUI("english");
}

function showAnswerNeedle() {
  var tag = window.NEEDLE_ANSWER_TAG || "chinese";
  if (tag === "english") {
    showAnswer("english");
  } else {
    showAnswer("chinese");
  }
}

$(function () {
  var n =
    typeof HARD_WORD_POOL_SIZE !== "undefined" ? HARD_WORD_POOL_SIZE : 0;
  $("#needle-pool-size").text(String(n));
  var nw =
    typeof QuizStorage !== "undefined" && QuizStorage.getNeedleIndices
      ? QuizStorage.getNeedleIndices().length
      : 0;
  if (nw > 0) {
    $("#needle-wrong-note").text("（当前含用户标注难词 " + nw + " 个）");
  } else {
    $("#needle-wrong-note").text("");
  }
});
