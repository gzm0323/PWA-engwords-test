function RestoreConf() {
    var request = getHTTPObject();
    if (!request) { return false; }
    
    // Collect the data.
    var dataParts = [];
    var element;
    var tables = document.getElementById("ip_conf").getElementsByTagName("input");
    for (var i=0; i<tables.length; i++) {
      if(tables[i].name!="")
        dataParts[i] = tables[i].name + '=' + encodeURIComponent(tables[i].value);
    }
    var data = dataParts.join('&');
  
    request.open('POST', "/erl/helloworld/restoreConf", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onreadystatechange = function () {
     if (request.readyState == 4) {
          if (request.status == 200 || request.status == 0) {
            var Result= document.getElementsByTagName("result");
            Result[0].textContent=request.responseText;
            Result[0].style.color="green";
          } 
          else {
            alert('<p>' + request.statusText + '</p>');
          }
      }
    };
  
    request.send(data);
     
    return true;
  
}

function selectFile() {
    
}