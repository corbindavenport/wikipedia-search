/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

// Check for settings & version

chrome.runtime.onInstalled.addListener(function(details){
	if(details.reason == "update" || "install"){
		if (localStorage.getItem("language") === null) {
			localStorage["language"] = "en";
		}
		if (localStorage.getItem("protocol") === null) {
			localStorage["protocol"] = "https://";
		}
		if (localStorage.getItem("donation") === null) {
			localStorage["donation"] = "yes";
		}
		if (localStorage.getItem("shortcut") === null) {
			if ((window.navigator.userAgent.indexOf("OPR") > -1) === false) {
				localStorage["shortcut"] = "on";
			} else {
				// Shortcut to options is not functional on Opera, possibly a bug
				localStorage["shortcut"] = "off";
			}
		}
		if (localStorage.getItem("contentscripts") === null) {
			localStorage["contentscripts"] = "on";
		}
		if (localStorage.getItem("hidesearch") === null) {
			localStorage["hidesearch"] = "off";
		}
	}
	if(localStorage.getItem("version") != chrome.runtime.getManifest().version){
		chrome.tabs.create({'url': chrome.extension.getURL('welcome.html')});
		localStorage["version"] = chrome.runtime.getManifest().version;
	}
});

// Awesome New Tab Page Widget

var info = {
	poke: 3,
	width: 1,
	height: 1,
	path: "widget.html",
	"v2": {
		"resize": false,
		"min_height": 1,
		"max_height": 1,
		"min_width": 1,
		"max_width": 1
	},
	"v3": {
		"multi_placement": false
	}
};

chrome.extension.onMessageExternal.addListener(function (request, sender, sendResponse) {
	if ( request === "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-poke" ) {
		chrome.extension.sendMessage(
		sender.id, {
			head: "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-pokeback",
			body: info,
		});
	}
});

// Context Menu Search

chrome.contextMenus.create({
	title: "Search \"%s\" on Wikipedia",
	contexts: ["selection"],
	onclick: function searchText(info){
		var url = encodeURI(localStorage["protocol"] + localStorage["language"] + ".wikipedia.org/w/index.php?title=Special:Search&search=" +info.selectionText);
		chrome.tabs.create({url: url});
	}
});

// Omnibox Search
// Derived from OmniWiki (github.com/hamczu/OmniWiki)

var currentRequest = null;

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {

	if (currentRequest != null) {
		currentRequest.onreadystatechange = null;
		currentRequest.abort();
		currentRequest = null;
	}

	updateDefaultSuggestion(text);

	if (text.length > 0) {
		currentRequest = suggests(text, function(data) {
			var results = [];
			if (localStorage.getItem("shortcut") === "on") {
				num = 4;
			} else {
				num = 5;
			}
			for(var i = 0; i < num; i++){
				results.push({
					content: data[1][i],
					description: data[1][i]
				});
			}
			if (localStorage.getItem("shortcut") === "on") {
				results.push({
					content: "settings",
					description: "Open Wikipedia Search options"
				});
			}
			suggest(results);
		});
	}

});

function resetDefaultSuggestion() {      
	chrome.omnibox.setDefaultSuggestion({
		description: ' '
	});
};

resetDefaultSuggestion();
var searchLabel = chrome.i18n.getMessage('search_label');
function updateDefaultSuggestion(text) {      
	chrome.omnibox.setDefaultSuggestion({
		description: searchLabel + 'Search on Wikipedia: %s'
	});

};

chrome.omnibox.onInputStarted.addListener(function() {
	updateDefaultSuggestion('');
});

chrome.omnibox.onInputCancelled.addListener(function() {
	resetDefaultSuggestion();
});


function suggests(query, callback) {
	var language = localStorage["language"];
	var protocol = localStorage["protocol"];
	var req = new XMLHttpRequest();
	
	req.open("GET", protocol + language + ".wikipedia.org/w/api.php?action=opensearch&namespace=0&suggest=&search=" + query, true);
	req.onload = function(){
		if(this.status == 200){
			try{                  
				callback(JSON.parse(this.responseText));
			}catch(e){
				this.onerror();
			}
		}else{
			this.onerror();
		}
	};
	req.onerror = function(){

	};
	req.send();
};

chrome.omnibox.onInputEntered.addListener(function(text) {
	if (text == "settings") {
		chrome.tabs.update(null, {url: chrome.extension.getURL('settings.html')});
	} else {
		chrome.tabs.update(null, {url: localStorage["protocol"] + localStorage["language"] + ".wikipedia.org/w/index.php?search=" + text});
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage")
      sendResponse({data: localStorage[request.key]});
    else
      sendResponse({}); // snub them.
});