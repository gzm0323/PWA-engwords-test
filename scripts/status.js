
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
  var unlocked = false;
  if (typeof QuizStorage !== "undefined" && QuizStorage.getActiveUser) {
    name = QuizStorage.getActiveUser();
  }
  if (typeof QuizStorage !== "undefined" && QuizStorage.isUnlocked) {
    unlocked = QuizStorage.isUnlocked();
  }
  $("#current-user-name").text(name + (unlocked ? "（已解锁）" : "（未解锁）"));
  $("#login-user-input").attr("placeholder", "用户名（当前：" + name + "）");
  $("#login-pin-input").attr("placeholder", unlocked ? "已解锁，可重新输入PIN切换" : "请输入PIN");
  $("#btn-reset-user").attr("title", "忘记PIN时可重置该用户（会清空该用户记录）");
}

function ensureUnlockedOrWarn() {
  if (
    typeof QuizStorage === "undefined" ||
    !QuizStorage.isUnlocked ||
    !QuizStorage.isUnlocked()
  ) {
    alert("请先输入用户名和PIN登录后，再保存学习记录。");
    return false;
  }
  return true;
}

$(function () {
  refreshActiveUserLabel();

  $(document).on("click", "#btn-account-toggle", function () {
    var $btn = $(this);
    var $panel = $("#account-panel-body");
    if ($panel.length === 0) return;
    var opening = $panel.prop("hidden");
    $panel.prop("hidden", !opening);
    $btn.attr("aria-expanded", opening ? "true" : "false");
    $btn.text(opening ? "收起设置" : "账户设置");
  });

  $(document).on("click", "#btn-login-user", function () {
    if (typeof QuizStorage === "undefined" || !QuizStorage.loginUser) return;
    var raw = $("#login-user-input").val();
    var pin = $("#login-pin-input").val();
    QuizStorage.loginUser(raw, pin)
      .then(function (name) {
        $("#login-user-input").val("");
        $("#login-pin-input").val("");
        refreshActiveUserLabel();
        $("#account-panel-body").prop("hidden", true);
        $("#btn-account-toggle").attr("aria-expanded", "false").text("账户设置");
        alert("登录成功：" + name);
      })
      .catch(function (err) {
        if (err && err.message === "PIN_TOO_SHORT") {
          alert("PIN至少需要4位。");
          return;
        }
        if (err && err.message === "PIN_INVALID") {
          alert("PIN错误，无法解锁该用户数据。");
          return;
        }
        alert("登录失败，请重试。");
      });
  });

  $(document).on("keydown", "#login-user-input, #login-pin-input", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      $("#btn-login-user").trigger("click");
    }
  });

  $(document).on("click", "#btn-logout-user", function () {
    if (typeof QuizStorage === "undefined" || !QuizStorage.logoutUser) return;
    QuizStorage.logoutUser();
    refreshActiveUserLabel();
  });

  $(document).on("click", "#btn-reset-user", function () {
    if (typeof QuizStorage === "undefined" || !QuizStorage.resetUserData) return;
    var raw = $("#login-user-input").val();
    var user = String(raw == null ? "" : raw).replace(/\s+/g, " ").trim();
    if (!user) {
      user = QuizStorage.getActiveUser ? QuizStorage.getActiveUser() : "";
    }
    if (!user) {
      alert("请先输入要重置的用户名。");
      return;
    }
    var yes = confirm(
      "将重置用户“" +
        user +
        "”的PIN与学习数据（已掌握/难词库）。此操作不可恢复，是否继续？"
    );
    if (!yes) return;
    var ok = QuizStorage.resetUserData(user);
    if (!ok) {
      alert("未找到该用户名的加密记录。");
      return;
    }
    $("#login-user-input").val(user);
    $("#login-pin-input").val("");
    refreshActiveUserLabel();
    alert("已重置用户“" + user + "”。请使用新PIN重新登录。");
  });

  $(document).on("click", ".quiz-needle-btn", function () {
    if (!ensureUnlockedOrWarn()) return;
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
    } else {
      if (!QuizStorage.addNeedleIndex) return;
      QuizStorage.addNeedleIndex(ix);
      $btn
        .addClass("quiz-needle-btn-cancel")
        .attr("aria-label", "已加入难词库（再次点击移出）")
        .attr("title", "已加入难词库（再次点击移出）");
    }
  });

  $(document).on("click", ".quiz-master-btn", function () {
    if (!ensureUnlockedOrWarn()) return;
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
    } else {
      if (!QuizStorage.addMasteredIndex) return;
      QuizStorage.addMasteredIndex(ix);
      $btn
        .addClass("quiz-master-btn-cancel")
        .attr("aria-label", "已掌握（再次点击取消）")
        .attr("title", "已掌握（再次点击取消）");
    }
  });

  $(document).on("click", "#btn-export-mastered", function () {
    if (!ensureUnlockedOrWarn()) return;
    exportMasteredListDownload();
  });

  $(document).on("click", "#btn-export-needle", function () {
    if (!ensureUnlockedOrWarn()) return;
    exportNeedleListDownload();
  });
});
