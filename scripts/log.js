function logQueryFun() {   
    // reader = new FileReader();
    // reader.readAsText(f);
    // reader.onload = function() {
    //     var Articles = document.getElementsByTagName("article");
    //     Articles[0].innerHTML = reader.result;
    // }

    var request = getHTTPObject();
    if (!request) { return false; }
    
    request.open('POST', "/erl/helloworld/logQuery", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200 || request.status == 0) {
            //var S = JSON.parse(request.responseText);
            //document.getElementById("run_status").innerText = S.run_status;
                var Articles = document.getElementsByTagName("article");
                Articles[0].innerHTML = request.responseText;
            } 
            else {
                alert('<p>' + request.statusText + '</p>');
            }
        }
    };
    var Data = document.getElementById("keyword");
    request.send(Data.value);
        
    return true;
    };   

function logDerivedFun() {   
        var Articles = document.getElementsByTagName("article");
        var tempLink = document.createElement("a");
        var textBlob = new Blob([ Articles[0].innerHTML], {type: 'text/plain'});
 
        tempLink.setAttribute('href', URL.createObjectURL(textBlob));
        tempLink.setAttribute('download', "log.txt");
        tempLink.click();
         
        URL.revokeObjectURL(tempLink.href);
    
}

