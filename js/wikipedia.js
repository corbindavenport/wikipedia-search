/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

function save_options() {
	if (document.getElementById("language")) {
		localStorage["language"] = document.getElementById("language").value;
		localStorage["protocol"] = document.getElementById("protocol").value;
		if (document.getElementById("shortcut").checked === true) {
			localStorage["shortcut"] = "on";
		} else {
			localStorage["shortcut"] = "off";
		}
		if (document.getElementById("contentscripts").checked === true) {
			localStorage["contentscripts"] = "on";
		} else {
			localStorage["contentscripts"] = "off";
		}
		if (document.getElementById("hidesearch").checked === true) {
			localStorage["hidesearch"] = "on";
		} else {
			localStorage["hidesearch"] = "off";
		}
		document.getElementById("save").value = "Saved!"
		document.getElementById("save").style.background = "#009900";
		setTimeout(function(){
			document.getElementById("save").value = "Save";
			document.getElementById("save").style.background = "#4d90fe";
		}, 2000);
	}
}

function reset_options() {
	document.getElementById("language").value = "en";
	localStorage["language"] = "en";
	document.getElementById("protocol").value = "https://";
	localStorage["protocol"] = "https://";
	if ((window.navigator.userAgent.indexOf("OPR") > -1) === true) {
		document.getElementById("shortcut").checked = false;
		localStorage["shortcut"] = "off";
	} else {
		document.getElementById("shortcut").checked = true;
		localStorage["shortcut"] = "on";
	}
	document.getElementById("contentscripts").checked = true;
	localStorage["contentscripts"] = "on";
	document.getElementById("hidesearch").checked = false;
	localStorage["hidesearch"] = "off";
	document.getElementById("reset").value = "Reset!"
	document.getElementById("reset").style.background = "#009900";
	localStorage["language"] = document.getElementById("language").value;
	localStorage["protocol"] = document.getElementById("protocol").value;
	setTimeout(function(){
		document.getElementById("reset").value = "Reset";
		document.getElementById("reset").style.background = "#4d90fe";
	}, 2000);
}

window.addEventListener('load',function() {
	if (document.getElementById("language")) {
		document.getElementById("language").value = localStorage["language"];
		document.getElementById("protocol").value = localStorage["protocol"];
		if (localStorage.getItem("shortcut") === "on") {
			document.getElementById("shortcut").checked = true;
		} else {
			document.getElementById("shortcut").checked = false;
		}
		if (localStorage.getItem("contentscripts") === "on") {
			document.getElementById("contentscripts").checked = true;
		} else {
			document.getElementById("contentscripts").checked = false;
		}
		if (localStorage.getItem("hidesearch") === "on") {
			document.getElementById("hidesearch").checked = true;
		} else {
			document.getElementById("hidesearch").checked = false;
		}
		document.getElementById("shortcut").value = localStorage["shortcut"];
		document.getElementById("contentscripts").value = localStorage["contentscripts"];
		if ((window.navigator.userAgent.indexOf("OPR") > -1) === true) {
			document.getElementById("shortcut-label").innerHTML = "Enable settings shortcut in search results (not supported on Opera)";
			document.getElementById("shortcut").disabled = true;
		}
	}
});

function startSearch(event) {document.getElementById("searchform").submit();}

window.onload = function() {
	var list = document.getElementsByClassName("version");
	for (var i = 0; i < list.length; i++) {
	    list[i].innerHTML = chrome.runtime.getManifest().version;
	}

	if (document.getElementById("searchInput")) {
		window.addEventListener('keydown', function() {
			if (event.keyCode == 13) {
				var text = document.getElementById("searchInput").value;
				window.parent.location = localStorage["protocol"] + localStorage["language"] + ".wikipedia.org/w/index.php?search=" + text;
				return false;
			}
		}, false);
	}

	if (document.getElementById("language")) {
		document.querySelector('input[value="Save"]').onclick=save_options;
		document.querySelector('input[value="Reset"]').onclick=reset_options;
	}

	if (document.getElementById("settings-buttons")) {
		document.querySelector('input[value="Donate via PayPal"]').onclick=function(){chrome.tabs.create({ url: "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4SZVSMJKDS35J&lc=US&item_name=Wikipedia%20Search%20Donation&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted" });};
		document.querySelector('input[value="Donate via Bitcoin"]').onclick=function(){document.getElementById("bitcoin").style.display = "block";};
	}
}
