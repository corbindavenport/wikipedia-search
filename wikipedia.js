/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

function save_options() {
	var select1 = document.getElementById("language");
	var language = select1.children[select1.selectedIndex].value;
	localStorage["language"] = language;

	var select2 = document.getElementById("protocol");
	var protocol = select2.children[select2.selectedIndex].value;
	localStorage["protocol"] = protocol;
}

function restore_options() {
	var select1 = document.getElementById("language");
	for (var i = 0; i < select1.children.length; i++) {
		var child1 = select1.children[i];
		if (child1.value == localStorage["language"]) {
			child1.selected = "true";
		break;
		}
	}

	var select2 = document.getElementById("protocol");
	for (var i = 0; i < select2.children.length; i++) {
		var child2 = select2.children[i];
		if (child2.value == localStorage["protocol"]) {
			child2.selected = "true";
		break;
		}
	}
}

function doDonation(){
	chrome.tabs.create({ url: "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4SZVSMJKDS35J&lc=US&item_name=Corbin%20Davenport&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted" });
}

window.addEventListener('load',function(){
	var select1 = document.getElementById("language");
	for (var i = 0; i < select1.children.length; i++) {
		var child1 = select1.children[i];
		if (child1.value == localStorage["language"]) {
			child1.selected = "true";
		break;
		}
	}

	var select2 = document.getElementById("protocol");
	for (var i = 0; i < select2.children.length; i++) {
		var child2 = select2.children[i];
		if (child2.value == localStorage["protocol"]) {
			child2.selected = "true";
		break;
		}
	}
});

function startSearch(event) {document.getElementById("searchform").submit();     }

window.onload = function(){
	document.querySelector('input[value="Save"]').onclick=save_options;
	document.querySelector('input[value="Donate via PayPal"]').onclick=doDonation;
}