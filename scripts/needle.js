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
  return arr[Math.floor(Math.random() * arr.length)];
}

function getNeedleEnglishWords() {
  window.NEEDLE_ANSWER_TAG = "chinese";
  var content = $("#content table");
  $("#content table tr").remove();
  var k1, k2, s1, s2;

  if (isMobileLayout()) {
    for (var i = 0; i < 10; i++) {
      k1 = pickWordIndexNeedle();
      var s1 =
        "<tr><td>" +
        words[k1 * 2] +
        "</td><td><chinese style='display:none'>" +
        words[k1 * 2 + 1] +
        "</chinese></td></tr>";
      content.append(s1);
    }
    resetAnswerUI("chinese");
    return;
  }

  for (var j = 0; j < 5; j++) {
    k1 = pickWordIndexNeedle();
    s1 =
      "<tr><td>" +
      words[k1 * 2] +
      "</td><td><chinese style='display:none'>" +
      words[k1 * 2 + 1] +
      "</chinese></td>";
    k2 = pickWordIndexNeedle();
    s2 =
      "<td>" +
      words[k2 * 2] +
      "</td><td><chinese style='display:none'>" +
      words[k2 * 2 + 1] +
      "</chinese></td></tr>";
    content.append(s1 + s2);
  }
  resetAnswerUI("chinese");
}

function getNeedleChineseWords() {
  window.NEEDLE_ANSWER_TAG = "english";
  var content = $("#content table");
  $("#content table tr").remove();
  var k1, k2, s1, s2;

  if (isMobileLayout()) {
    for (var i = 0; i < 10; i++) {
      k1 = pickWordIndexNeedle();
      s1 =
        "<tr><td>" +
        words[k1 * 2 + 1] +
        "</td><td><english style='display:none'>" +
        words[k1 * 2] +
        "</english></td></tr>";
      content.append(s1);
    }
    resetAnswerUI("english");
    return;
  }

  for (var j2 = 0; j2 < 5; j2++) {
    k1 = pickWordIndexNeedle();
    s1 =
      "<tr><td>" +
      words[k1 * 2 + 1] +
      "</td><td><english style='display:none'>" +
      words[k1 * 2] +
      "</english></td>";
    k2 = pickWordIndexNeedle();
    s2 =
      "<td>" +
      words[k2 * 2 + 1] +
      "</td><td><english style='display:none'>" +
      words[k2 * 2] +
      "</english></td></tr>";
    content.append(s1 + s2);
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
});
