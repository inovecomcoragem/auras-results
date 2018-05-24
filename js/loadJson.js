function loadJSON(file, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', file, true);
  xobj.onreadystatechange = function() {
    if (xobj.readyState == XMLHttpRequest.DONE && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send();
}
