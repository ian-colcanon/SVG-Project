$(document).ready(function(){

  $("#download").click(function(){
    var svg = document.getElementById("draw");
    var data = new XMLSerializer().serializeToString(svg);
    var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var url = URL.createObjectURL(svgBlob);

    downloadBlob("graphic", svgBlob);
  });

});

function downloadBlob(name, blob) {
  var link = document.createElement('a');
  link.download = name;
  link.href = URL.createObjectURL(blob);
  // Firefox needs the element to be live for some reason.
  document.body.appendChild(link);
  link.click();
  setTimeout(function() {
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  });
}
