/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

// List of Wikipedia's supported language in an array, for the auto-detect functionality
var langArray= ["ar","az","bg","nan","be","ca","cs","da","de","et","el","en","es","eo","eu","fa","fr","gl","ko","hy","hi","hr","id","it","he","ka","la","lt","hu","ms","min","nl","ja","no","nn","ce","uz","pl","pt","kk","ro","ru","ceb","sk","sl","sr","sh","fi","sv","ta","th","tr","uk","ur","vi","vo","war","zh"];
var detailArray = ["العربية","Azərbaycanca","Български","Bân-lâm-gú / Hō-ló-oē","Беларуская (Акадэмічная)","Català","Čeština","Dansk","Deutsch","Eesti","Ελληνικά","English","Español","Esperanto","Euskara","فارسی","Français","Galego","한국어","Հայերեն","हिन्दी","Hrvatski","Bahasa Indonesia","Italiano","עברית","ქართული","Latina","Lietuvių","Magyar","Bahasa Melayu","Bahaso Minangkabau","Nederlands","日本語","Norsk (Bokmål)","Norsk (Nynorsk)","Нохчийн","Oʻzbekcha / Ўзбекча","Polski","Português","Қазақша / Qazaqşa / قازاقشا","Română","Русский","Sinugboanong Binisaya","Slovenčina","Slovenščina","Српски / Srpski","Srpskohrvatski / Српскохрватски","Suomi","Svenska","தமிழ்","ภาษาไทย","Türkçe","Українська","اردو","Tiếng Việt","Volapük","Winaray","中文"];

// Check for settings & version
chrome.runtime.onInstalled.addListener(function(details){
	if(details.reason == "update" || "install"){
		// Transfer data from Wikipedia Search 7.0.2 or below
		// Wikipedia Search 7.1+ use booleans for localStorage
		if ((localStorage.getItem("shortcut") === "on") || (localStorage.getItem("shortcut") === null)) {
			localStorage["shortcut"] = "true";
		} else if (localStorage.getItem("shortcut") === "off") {
			localStorage["shortcut"] = "false";
		}
		if (localStorage.getItem("language") === null) {
			// Detect the user's system language
			var lang = navigator.languages[0];
			// Cut off the localization part if it exists (e.g. en-US becomes en), to match with Wikipedia's format
			var n = lang.indexOf('-');
			lang = lang.substring(0, n != -1 ? n : lang.length);
			// Check if the language has a Wikipedia
			if (langArray.includes(lang)) {
				console.log("Language auto-detected as '" + lang + "' (" + detailArray[langArray.indexOf(lang)] + ")");
				localStorage["language"] = lang;
				localStorage["full-language"] = detailArray[langArray.indexOf(lang)];
			} else {
				// Set it to English as default
				console.log("Could not auto-detect language, defaulting to 'en' (English)")
				localStorage["language"] = "en";
				localStorage["full-language"] = detailArray[langArray.indexOf("en")];
			}
		}
		if (localStorage.getItem("full-language") === null) {
			localStorage["full-language"] = detailArray[langArray.indexOf(localStorage["language"])];
		}
		if (localStorage.getItem("protocol") === null) {
			localStorage["protocol"] = "https://";
		}
		if (localStorage.getItem("settings-modified") === null) {
			localStorage["settings-modified"] = "false";
		}
	}
	if(localStorage.getItem("version") != chrome.runtime.getManifest().version){
		chrome.tabs.create({'url': chrome.extension.getURL('welcome.html')});
		localStorage["version"] = chrome.runtime.getManifest().version;
	}
});

chrome.browserAction.onClicked.addListener(function() {
	 window.open(chrome.extension.getURL("settings.html"));
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
	title: "Search Wikipedia for \"%s\"",
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
			// When the settings shortcut is enabled, it takes up one of the search results slots
			// If shortcut is disabled = Show five search results
			// If shortcut is enabled = Show four search results + shortcut
			if (localStorage.getItem("shortcut") === "true") {
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
			if (localStorage.getItem("shortcut") === "true") {
				results.push({
					content: "settings",
					description: "<dim>Change search language (currently set to " + localStorage["full-language"] + ")</dim>"
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
