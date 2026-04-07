  
function prepareForms() {
    for (var i=0; i<document.forms.length; i++) {
      var thisform = document.forms[i];
      thisform.onsubmit = function() {
        if (!validateForm(this)) return false;
        if (submitFormWithAjax(this)) return false;
        return true;
      }
    }
  }
  
  
  
  function submitFormWithAjax( whichform ) {
    
    var request = getHTTPObject();
    if (!request) { return false; }
  
    // Display a loading message.
    //displayAjaxLoading(thetarget);
  
    // Collect the data.
    var dataParts = [];
    var element;
    for (var i=0; i<whichform.elements.length; i++) {
      element = whichform.elements[i];
      if(element.name!="")
        dataParts[i] = element.name + '=' + encodeURIComponent(element.value);
    }
    var data = dataParts.join('&');
  
    request.open('POST', whichform.getAttribute("action"), true);
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
  };
  
  
  // Load events
  addLoadEvent(highlightPage);
  addLoadEvent(prepareForms);
  
  