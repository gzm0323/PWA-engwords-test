
function isMobileLayout() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 520px)").matches
  );
}

function resetAnswerUI(tagName) {
  $('button info').attr("text", "no");
  $(tagName).attr("style", "display:none");
  B = $("#btn2 info");
  B.text("显示答案");
}

function getEnglishWords() {
  content = $("#content table");
  $("#content table tr").remove();
  len = words.length / 2;

  if (isMobileLayout()) {
    for (i = 0; i < 10; i++) {
      k1 = Math.floor(len * Math.random());
      s1 =
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

  for (i = 0; i < 5; i++) {
    k1 = Math.floor(len * Math.random());
    s1 =
      "<tr><td>" +
      words[k1 * 2] +
      "</td><td><chinese style='display:none'>" +
      words[k1 * 2 + 1] +
      "</chinese></td>";
    k2 = Math.floor(len * Math.random());
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

function getChineseWords() {
  content = $("#content table");
  $("#content table tr").remove();
  len = words.length / 2;

  if (isMobileLayout()) {
    for (i = 0; i < 10; i++) {
      k1 = Math.floor(len * Math.random());
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

  for (i = 0; i < 5; i++) {
    k1 = Math.floor(len * Math.random());
    s1 =
      "<tr><td>" +
      words[k1 * 2 + 1] +
      "</td><td><english style='display:none'>" +
      words[k1 * 2] +
      "</english></td>";
    k2 = Math.floor(len * Math.random());
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


function showAnswer(Str) {
  
  info = $('button info').attr("text");
  if(info=="no") {
    $('button info').attr("text","yes");
    $(Str).attr("style",'display:inline');
    B=$('#btn2 info');
    B.text("关闭答案");
  }
  else {
    $('button info').attr("text","no");
    $(Str).attr("style",'display:none');
    B=$('#btn2 info');
    B.text("显示答案");
  }
}

