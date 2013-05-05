function save_options() {
  var select = document.getElementById("language");
  var language = select.children[select.selectedIndex].value;
  localStorage["favorite_color"] = language;
  var status = document.getElementById("status");
  status.innerHTML = "Saved!";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}
function restore_options() {
  var favorite = localStorage["favorite_color"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("language");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}
window.onload = function(){
    document.querySelector('input[value="Save"]').onclick=save_options;
}
window.addEventListener('load',function(){
 var favorite = localStorage["favorite_color"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("language");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
});
function startSearch(event) {       
	document.getElementById("searchform").submit();     
}