importScripts('/js/shared.js');

// TODO: Migrate userLanguage, multiLang, and other options to chrome.storage.sync

// Global variables
const isFirefox = chrome.runtime.getURL('').startsWith('moz-extension://');
let wikiList = {};
var userLanguage = ''
var multiLang = ''
var activeLanguage = ''
var currentRequest = null

// Load data and settings when Omnibox search is activated
chrome.omnibox.onInputStarted.addListener(function () {
	updateDefaultSuggestion('', activeLanguage)
	getWikis().then(function (data) {
		wikiList = data;
	})
	chrome.storage.local.get(function (data) {
		userLanguage = data.userLanguage
		multiLang = data.multiLang
	})
})

chrome.omnibox.onInputChanged.addListener(async function (text, suggest) {
	// If the first word in the query matches a known Wikipedia language, and multi-language is enabled, change the active search to that language
	var firstWord = text.split(' ')[0]
	if ((multiLang === true) && text.startsWith(firstWord + ' ') && wikiList.hasOwnProperty(firstWord)) {
		activeLanguage = firstWord
		text = text.replace(firstWord + ' ', '')
	} else {
		activeLanguage = userLanguage
	}
	updateDefaultSuggestion(text, activeLanguage)
	if (text.length > 0) {
		var localCurrentRequest = suggests(text)
		currentRequest = localCurrentRequest
		localCurrentRequest.then(function (data) {
			if (localCurrentRequest !== currentRequest) {
				return
			}
			// Set the maximum number of suggestion slots, and leave one for the settings option
			var results = []
			if (isFirefox) {
				// Firefox supports 4 suggestions
				num = 4
			} else {
				// Chrome can do 8 suggestions
				num = 8
			}
			for (var i = 0; i < num; i++) {
				var content = data[1][i]
				if (content) {
					results.push({
						content: content,
						description: content
					})
				}
			}
			// Add settings suggestion
			if (isFirefox) {
				// Firefox doesn't support <dim>
				results.push({
					content: "settings",
					description: "Change default search language (currently set to " + wikiList[activeLanguage] + ")"
				})
			} else {
				results.push({
					content: "settings",
					description: "<dim>Change default search language (currently set to " + wikiList[activeLanguage] + ")</dim>"
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

function updateDefaultSuggestion(text, activeLanguage) {
	// Remove language prefix from live results
	if (text.startsWith(activeLanguage + ' ')) {
		text = text.replace(activeLanguage + ' ', '')
	}
	// Add default suggestion
	if (isFirefox) {
		// Firefox doesn't support <dim>
		chrome.omnibox.setDefaultSuggestion({
			description: text + ' — ' + wikiList[activeLanguage]
		})
	} else {
		chrome.omnibox.setDefaultSuggestion({
			description: text + ' <dim>- ' + wikiList[activeLanguage] + '</dim>'
		})
	}
}

chrome.omnibox.onInputCancelled.addListener(function () {
	resetDefaultSuggestion()
})

async function suggests(query) {
	// OpenSearch documentation: https://www.mediawiki.org/wiki/API:Opensearch
	return new Promise(async function (resolve, reject) {
		const url = "https://" + activeLanguage + ".wikipedia.org/w/api.php?action=opensearch&namespace=0&suggest=&search=" + encodeURIComponent(query)
		const response = await fetch(url)
		if (!response.ok) {
			console.log('Could not obtain data from Wikipedia API.')
			resolve(null)
		}
		const json = await response.json()
		resolve(json)
	})
}

chrome.omnibox.onInputEntered.addListener(function (text) {
	if (text == "settings") {
		chrome.runtime.openOptionsPage()
	} else {
		// If a search prefix is being used, exclude it from the text string
		if (text.startsWith(activeLanguage + ' ')) {
			text = text.replace(activeLanguage + ' ', '')
		}
		chrome.tabs.update(null, { url: getWikiUrl(text, activeLanguage) });
	}
})

// Initialize welcome message and context menu entry on extension load

chrome.runtime.onInstalled.addListener(function (details) {
	// Initialize context menu
	chrome.contextMenus.create({
		id: "search-wikipedia",
		title: 'Search Wikipedia for \"%s\"',
		contexts: ['selection']
	})
	// Load settings and languages from storage when the extension is initialized
	chrome.storage.local.get(async function (data) {
		if (typeof data.multiLang == 'undefined') {
			chrome.storage.local.set({
				multiLang: false
			})
		}
		if (data.userLanguage) {
			console.log(`Language set to ${data.userLanguage}`);
		} else {
			// Detect system language and set it as the default
			await resetToSystemLanguage()
		}
	})
	// Show welcome message
	if (details.reason === 'install' || details.reason === 'update') {
		chrome.tabs.create({ 'url': chrome.runtime.getURL('welcome.html') });
	};
})

// Function for context menu search

chrome.contextMenus.onClicked.addListener(function (info, tab) {
	if (info.menuItemId == "search-wikipedia") {
		chrome.storage.local.get(function (data) {
			chrome.tabs.create({ url: getWikiUrl(info.selectionText, data.userLanguage) })
		})
	}
})