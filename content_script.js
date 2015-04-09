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
			document.getElementById("p-navigation").innerHTML = document.getElementById("p-navigation").innerHTML + '<h3 style="display: block; padding-top: 5px; background-position: top left; background-repeat: no-repeat; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAAABCAAAAAAphRnkAAAAJ0lEQVQIW7XFsQEAIAyAMPD/b7uLWz8wS5youFW1UREfiIpH1Q2VBz7fGPS1dOGeAAAAAElFTkSuQmCC); background-image: url(//bits.wikimedia.org/static-1.25wmf24/skins/Vector/images/portal-break.png?2015-04-01T19:10:00Z)!ie;">Wikipedia Search ' + chrome.runtime.getManifest().version + '</h3><div class="body"><ul><li><a href="' + chrome.extension.getURL('settings.html') + '" title="Open Wikipedia Search extension settings in new tab" target="_blank">Extension Settings</a></li><li><a href="http://github.com/corbindavenport/wikipedia-search" title="Open Wikipedia Search extenion project on GitHub in a new tab" target="_blank">GitHub Project</a></li><li><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4SZVSMJKDS35J&lc=US&item_name=Wikipedia%20Search%20Donation&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted" title="Donate to the Wikipedia Search extension developer via PayPal in a new tab" target="_blank">Donate via PayPal</a></li><li><a title="Donate to the Wikipedia Search extension developer via Bitcoin" target="_blank">Donate via Bitcoin</a></li><li><a href="http://github.com/corbindavenport/wikipedia-search/issues/new" title="Submit bug report through GitHub" target="_blank">Report bug</a></li></ul></div>';

			// Add information about wikipedia search to top header
			header = document.getElementById("p-personal").children[1];
			header.innerHTML = header.innerHTML + '<li>Wikipedia Search ' + chrome.runtime.getManifest().version + '</li>';

			// Add Wikipedia Search info to footer
			document.getElementById("footer-info-copyright").innerHTML = document.getElementById("footer-info-copyright").innerHTML + '<br /><br />Wikipedia Search ' + chrome.runtime.getManifest().version + ' is developed by ' + chrome.runtime.getManifest().author + ' and licensed under the GPLv3 license. The source code for Wikipedia Search is freely available on its <a href="' + chrome.runtime.getManifest().homepage_url + '" target="blank_">GitHub repository</a>.';

			// Bitcoin Donation
			document.body.innerHTML = '<div id="bitcoin" style="display: none; background-color: #FFF; color: #333; font: 14px arial, sans-serif; border-bottom: 1px solid #A9A8A6; padding: 5px; width: 100%; position: fixed; z-index:500;"><b>Please send bitcoin to the following address:</b> <span style="font-family:Monaco,Menlo,Consolas,monospace;">1GSbhaUp8JSRepqQceHzrGhV1bPk9hcPuS</span></div>' + document.body.innerHTML;
			document.querySelector('a[title="Donate to the Wikipedia Search extension developer via Bitcoin"]').onclick=function(){document.getElementById("bitcoin").style.display = "block"};
		}
	} else {
		if (window.location.href.indexOf("/wiki/") > -1) {
			var header = document.getElementById("p-personal").children[1];
			header.innerHTML = header.innerHTML + '<li>Wikipedia Search ' + chrome.runtime.getManifest().version + '</li>';
		}
	}
});

// Hide search on Wikipedia home page and article pages

chrome.runtime.sendMessage({method: "getLocalStorage", key: "hidesearch"}, function(response) {
	if (response.data === "on" && window.location.href.indexOf("/wiki/") > -1) {
			document.getElementById("searchInput").setAttribute("disabled","disabled");
			document.getElementById("searchInput").setAttribute("placeholder","Address Bar search enabled");
	} else if (response.data === "on" && document.body.querySelector(".search-form")) {
			document.body.querySelector(".search-form").innerHTML = '<div style="background-color: #f9f9f9; border: 1px solid #aaa; margin-top: 0.5em; padding: 0.7em; width: auto;">Inline search disabled, use your browser address bar.</div>';
		}
});

// The easter egg can be enabled by running this command in the JavaScript console, with the Wikipedia Search settings open:
// localStorage['easteregg'] = "on";
// and turned off with:
// localStorage['easteregg'] = "off";

chrome.runtime.sendMessage({method: "getLocalStorage", key: "easteregg"}, function(response) {
	if (response.data === "on" && window.location.href.indexOf("/wiki/") > -1) {
			document.querySelector(".mw-wiki-logo").style.backgroundImage = "url('http://upload.wikimedia.org/wikipedia/commons/5/5f/Wiki_logo_The_Cunctator.png')";
	}
});