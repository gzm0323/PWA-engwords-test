
function getEnglishWords() {
  content=$('#content table');
  $('#content table tr').remove();
  len = words.length/2;

  for(i=0;i<5;i++){
    k1=Math.floor((len)*Math.random());
    s1="<tr><td>"+words[k1*2]+"</td><td><chinese style='display:none'>"+words[k1*2+1]+"</chinese></td>";
    k2=Math.floor((len)*Math.random());
    s2="<td>"+words[k2*2]+"</td><td><chinese style='display:none'>"+words[k2*2+1]+"</chinese></td></tr>";
    content.append(s1+s2);
  }
  $('button info').attr("text","no");
  $('chinese').attr("style",'display:none');
  B=$('#btn2 info');
  B.text("显示答案");
//  alert( words[2]);
};

function getChineseWords() {
  content=$('#content table');
  $('#content table tr').remove();
  len = words.length/2;

  for(i=0;i<5;i++){
    k1=Math.floor((len)*Math.random());
    s1="<tr><td>"+words[k1*2+1]+"</td><td><english style='display:none'>"+words[k1*2]+"</english></td>";
    k2=Math.floor((len)*Math.random());
    s2="<td>"+words[k2*2+1]+"</td><td><english style='display:none'>"+words[k2*2]+"</english></td></tr>";
    content.append(s1+s2);
  }
  $('button info').attr("text","no");
  $('english').attr("style",'display:none');
  B=$('#btn2 info');
  B.text("显示答案");
//  alert( words[2]);
};


function showAnswer(Str) {
  
  info = $('button info').attr("text");
  if(info=="no") {
    $('button info').attr("text","yes");
    $(Str).attr("style",'display:yes');
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

