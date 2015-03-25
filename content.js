$(document).ready(function() {
  document.getElementById("resp").innerText = "started";
  alert('test');

});

var button = document.getElementById("sendform");
button.addEventListener("click", function() {
  alert('test2');
}, false);

$("#sendform").click(function() {
	alert('test2');
	getResult();
});

function getResult () {
	document.getElementById("resp").innerText = "Getting info";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://www.studse.rfh-koeln.de", true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
		// innerText does not let the attacker inject HTML elements.
		document.getElementById("resp").innerText = xhr.responseText;
	  }
	}
	xhr.send();
}