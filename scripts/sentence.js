/**
 * 用单词库中的英文词条随机拼成一句（供朗读/记忆），并可查看各词中文释义。
 */
function trimEnglishLemma(en) {
  return String(en == null ? "" : en).replace(/\s+/g, " ").trim();
}

function collectValidIndices() {
  var pairCount = words.length / 2;
  var valid = [];
  var i;
  for (i = 0; i < pairCount; i++) {
    var raw = words[i * 2];
    if (typeof WordPolicy !== "undefined" && WordPolicy.isBlocked) {
      if (WordPolicy.isBlocked(raw)) continue;
    }
    if (!trimEnglishLemma(raw)) continue;
    valid.push(i);
  }
  if (valid.length === 0) {
    for (i = 0; i < pairCount; i++) {
      if (trimEnglishLemma(words[i * 2])) valid.push(i);
    }
  }
  return valid;
}

function shuffleInPlace(arr) {
  var i, j, t;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    t = arr[j];
    arr[j] = arr[i];
    arr[i] = t;
  }
  return arr;
}

/**
 * @returns {{ en: string, gloss: string }}
 */
function buildRandomSentence() {
  var valid = collectValidIndices();
  shuffleInPlace(valid);
  var nWant = 6 + Math.floor(Math.random() * 5);
  if (nWant < 6) nWant = 6;
  if (nWant > 12) nWant = 12;
  var n = Math.min(nWant, valid.length);
  var picked = valid.slice(0, n);

  var enParts = [];
  var glossParts = [];
  var p;
  for (p = 0; p < picked.length; p++) {
    var idx = picked[p];
    var en = trimEnglishLemma(words[idx * 2]);
    var zh = String(words[idx * 2 + 1] == null ? "" : words[idx * 2 + 1]).trim();
    enParts.push(en);
    glossParts.push(en + " → " + zh);
  }

  var body = enParts.join(" ");
  var sentence = body.charAt(0).toUpperCase() + body.slice(1) + ".";
  return {
    en: sentence,
    gloss: glossParts.join("；"),
  };
}

function renderSentence() {
  var data = buildRandomSentence();
  $("#sentence-en").text(data.en);
  $("#sentence-gloss").text(data.gloss);
  $("#sentence-gloss").hide();
  $("#btn-toggle-gloss info").attr("text", "no");
  $("#btn-toggle-gloss info").text("显示词义");
}

function toggleGloss() {
  var info = $("#btn-toggle-gloss info").attr("text");
  if (info === "no") {
    $("#sentence-gloss").slideDown(150);
    $("#btn-toggle-gloss info").attr("text", "yes");
    $("#btn-toggle-gloss info").text("隐藏词义");
  } else {
    $("#sentence-gloss").slideUp(150);
    $("#btn-toggle-gloss info").attr("text", "no");
    $("#btn-toggle-gloss info").text("显示词义");
  }
}

$(function () {
  renderSentence();
  $("#btn-new-sentence").on("click", function () {
    renderSentence();
  });
  $("#btn-toggle-gloss").on("click", function () {
    toggleGloss();
  });
});
