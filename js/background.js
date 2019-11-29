chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.local.get(async function (data) {
		// Show welcome page after update
		if (data.version) {
			if (!(data.version === chrome.runtime.getManifest().version)) {
				chrome.tabs.create({ 'url': chrome.extension.getURL('welcome.html') })
				chrome.storage.local.set({
					version: chrome.runtime.getManifest().version
				})
			}
		} else {
			chrome.tabs.create({ 'url': chrome.extension.getURL('welcome.html') })
			chrome.storage.local.set({
				version: chrome.runtime.getManifest().version
			})
		}
		// Initialize list of Wikis
		if (!data.wikiList) {
			console.log('Initializing Wiki list...')
			chrome.storage.local.set({
				wikiList: defaultWikiArray
			})
		}
	})
	/*
	// Transfer data from Wikipedia Search 7.0.2 or below
	// Wikipedia Search 7.1+ use booleans for localStorage
	if ((localStorage.getItem("shortcut") === "on") || (localStorage.getItem("shortcut") === null)) {
		localStorage["shortcut"] = "true"
	} else if (localStorage.getItem("shortcut") === "off") {
		localStorage["shortcut"] = "false"
	}
	if (localStorage.getItem("language") === null) {
		// Detect the user's system language
		var lang = navigator.languages[0]
		// Cut off the localization part if it exists (e.g. en-US becomes en), to match with Wikipedia's format
		var n = lang.indexOf('-')
		lang = lang.substring(0, n != -1 ? n : lang.length)
		// Check if the language has a Wikipedia
		if (langArray.includes(lang)) {
			console.log("Language auto-detected as '" + lang + "' (" + detailArray[langArray.indexOf(lang)] + ")")
			localStorage["language"] = lang
			localStorage["full-language"] = detailArray[langArray.indexOf(lang)]
		} else {
			// Set it to English as default
			console.log("Could not auto-detect language, defaulting to 'en' (English)")
			localStorage["language"] = "en"
			localStorage["full-language"] = detailArray[langArray.indexOf("en")]
		}
	}
	if (localStorage.getItem("full-language") === null) {
		localStorage["full-language"] = detailArray[langArray.indexOf(localStorage["language"])]
	}
	localStorage["protocol"] = "https://" // We'll remove this option later
	if (localStorage.getItem("settings-modified") === null) {
		localStorage["settings-modified"] = "false"
	}*/
	
	// Create Context Menu Search
	chrome.contextMenus.create({
		title: "Search Wikipedia for \"%s\"",
		contexts: ["selection"],
		onclick: function searchText(info) {
			var url = encodeURI(localStorage["protocol"] + localStorage["language"] + ".wikipedia.org/w/index.php?title=Special:Search&search=" + info.selectionText)
			chrome.tabs.create({ url: url })
		}
	})
})

// Omnibox Search
// Derived from OmniWiki (github.com/hamczu/OmniWiki)
var currentRequest = null
chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
	if (currentRequest != null) {
		currentRequest.onreadystatechange = null
		currentRequest.abort()
		currentRequest = null
	}
	updateDefaultSuggestion(text)
	if (text.length > 0) {
		currentRequest = suggests(text, function (data) {
			var results = []
			// When the settings shortcut is enabled, it takes up one of the search results slots
			// If shortcut is disabled = Show five search results
			// If shortcut is enabled = Show four search results + shortcut
			if (localStorage.getItem("shortcut") === "true") {
				num = 4
			} else {
				num = 5
			}
			for (var i = 0; i < num; i++) {
				results.push({
					content: data[1][i],
					description: data[1][i]
				})
			}
			if (localStorage.getItem("shortcut") === "true") {
				results.push({
					content: "settings",
					description: "<dim>Change search language (currently set to " + localStorage["full-language"] + ")</dim>"
				})
			}
			suggest(results)
		})
	}
})

function resetDefaultSuggestion() {
	chrome.omnibox.setDefaultSuggestion({
		description: ' '
	})
}

resetDefaultSuggestion()
var searchLabel = chrome.i18n.getMessage('search_label')
function updateDefaultSuggestion(text) {
	chrome.omnibox.setDefaultSuggestion({
		description: searchLabel + 'Search on Wikipedia: %s'
	})
}

chrome.omnibox.onInputStarted.addListener(function () {
	updateDefaultSuggestion('')
})

chrome.omnibox.onInputCancelled.addListener(function () {
	resetDefaultSuggestion()
})

function suggests(query, callback) {
	var language = localStorage["language"]
	var protocol = localStorage["protocol"]
	var req = new XMLHttpRequest()

	req.open("GET", protocol + language + ".wikipedia.org/w/api.php?action=opensearch&namespace=0&suggest=&search=" + query, true)
	req.onload = function () {
		if (this.status == 200) {
			try {
				callback(JSON.parse(this.responseText))
			} catch (e) {
				this.onerror()
			}
		} else {
			this.onerror()
		}
	}
	req.onerror = function () {

	}
	req.send()
}

chrome.omnibox.onInputEntered.addListener(function (text) {
	if (text == "settings") {
		chrome.tabs.update(null, { url: chrome.extension.getURL('settings.html') })
	} else {
		chrome.tabs.update(null, { url: localStorage["protocol"] + localStorage["language"] + ".wikipedia.org/w/index.php?search=" + text })
	}
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.method == "getLocalStorage")
		sendResponse({ data: localStorage[request.key] })
	else
		sendResponse({}) // snub them.
})
