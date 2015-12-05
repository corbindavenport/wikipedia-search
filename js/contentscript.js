/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

// Wikipedia integration

chrome.runtime.sendMessage({method: "getLocalStorage", key: "contentscripts"}, function(response) {
	if (response.data === "on") {
		if (window.location.href.indexOf("/wiki/") > -1) {
			// Add extra button for Wikipedia Search on left panel
			var wikipanel = document.createElement("div");
			wikipanel.setAttribute("class", "portal");
			wikipanel.setAttribute("id", "wikipediasearchpanel");
			wikipanel.innerHTML = '<h3>Wikipedia Search ' + chrome.runtime.getManifest().version + '</h3><div class="body"><ul><li><a href="' + chrome.extension.getURL('settings.html') + '" title="Open Wikipedia Search extension settings in new tab" target="_blank">Extension Settings</a></li><li><a href="http://github.com/corbindavenport/wikipedia-search" title="Open Wikipedia Search extenion project on GitHub in a new tab" target="_blank">GitHub Project</a></li><li><a href="http://github.com/corbindavenport/wikipedia-search/issues/new" title="Submit bug report through GitHub" target="_blank">Report bug</a></li></ul></div>';
			var panelparent = document.getElementById("mw-panel");
			panelparent.insertBefore(wikipanel, document.getElementById("mw-panel").getElementsByTagName("div")[3]);
		}
	} else {
		if (window.location.href.indexOf("/wiki/") > -1) {
			var info = document.createElement("li");
			info.setAttribute("id", "wikipediasearchinfo");
			info.innerHTML = '<span style="color: gray;">Wikipedia Search ' + chrome.runtime.getManifest().version + '</span>';
			var headerparent = document.getElementById("p-personal").getElementsByTagName("ul")[0];
			console.log(headerparent);
			headerparent.insertBefore(info, document.getElementById("pt-userpage"));
		}
	}
});

// Hide search on Wikipedia article pages

chrome.runtime.sendMessage({method: "getLocalStorage", key: "hidesearch"}, function(response) {
	if (response.data === "on" && window.location.href.indexOf("/wiki/") > -1) {
			document.getElementById("searchform").style.display = "none";
			document.getElementById("p-search").style.marginRight = "0";
	}
});

// Remind users of Wikipedia Search on Wikipedia home page

if ((window.location.href.indexOf("www.wikipedia.org")) > -1 && (document.body.querySelector(".search-form"))) {
		var searchcontainer = document.body.querySelector(".search-form").getElementsByTagName("fieldset")[0];
		searchcontainer.innerHTML = searchcontainer.innerHTML + "<br /><br />Since you have the Wikipedia Search extension installed, you can search Wikipedia from your browser's search bar. Just type 'wiki' in the search bar, then a space, then the name of the article you want.";
	}

// The easter egg can be enabled by running this command in the JavaScript console, with the Wikipedia Search settings open:
// localStorage['easteregg'] = "on";
// and turned off with:
// localStorage['easteregg'] = "off";

chrome.runtime.sendMessage({method: "getLocalStorage", key: "easteregg"}, function(response) {
	if (response.data === "on" && window.location.href.indexOf("/wiki/") > -1) {
			document.querySelector(".mw-wiki-logo").style.backgroundImage = "url('http://upload.wikimedia.org/wikipedia/commons/5/5f/Wiki_logo_The_Cunctator.png')";
	}
});
