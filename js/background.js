// Global variables
const isChrome = Boolean(navigator.userAgent.includes('Chrome'))
const isFirefox = Boolean(navigator.userAgent.includes('Firefox'))
var wikiLangArray = []
var wikiPrefixArray = []
var userLanguage = ''
var multiLang = ''
var activeLanguage = ''
var currentRequest = null

// Load data and settings when Omnibox search is activated
chrome.omnibox.onInputStarted.addListener(function () {
	updateDefaultSuggestion('', activeLanguage)
	chrome.storage.local.get(function (data) {
		userLanguage = data.userLanguage
		multiLang = data.multiLang
		wikiLangArray = data.wikiLangArray
		wikiPrefixArray = data.wikiPrefixArray
	})
})

chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
	// If the first word in the query matches a known Wikipedia language, and multi-language is enabled, change the active search to that language
	var firstWord = text.split(' ')[0]
	if ((multiLang === true) && text.startsWith(firstWord + ' ') && (wikiPrefixArray.includes(firstWord))) {
		activeLanguage = firstWord
		text = text.replace(firstWord + ' ', '')
	} else {
		activeLanguage = userLanguage
	}
	// Continue with search
	if (currentRequest != null) {
		currentRequest.onreadystatechange = null
		currentRequest.abort()
		currentRequest = null
	}
	updateDefaultSuggestion(text, activeLanguage)
	if (text.length > 0) {
		currentRequest = suggests(text, function (data) {
			// Set the maximum number of suggestion slots, and leave one for the settings option
			var results = []
			// Chrome and Firefox support 4 suggestions
			num = 4
			for (var i = 0; i < num; i++) {
				results.push({
					content: data[1][i],
					description: data[1][i]
				})
			}
			// Add settings suggestion
			if (isFirefox) {
				// Firefox doesn't support <dim>
				results.push({
					content: "settings",
					description: "Change default search language (currently set to " + wikiLangArray[wikiPrefixArray.indexOf(userLanguage)] + ")"
				})
			} else {
				results.push({
					content: "settings",
					description: "<dim>Change default search language (currently set to " + wikiLangArray[wikiPrefixArray.indexOf(userLanguage)] + ")</dim>"
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
			description: text + ' — ' + wikiLangArray[wikiPrefixArray.indexOf(activeLanguage)]
		})
	} else {
		chrome.omnibox.setDefaultSuggestion({
			description: text + ' <dim>- ' + wikiLangArray[wikiPrefixArray.indexOf(activeLanguage)] + '</dim>'
		})
	}
}

chrome.omnibox.onInputCancelled.addListener(function () {
	resetDefaultSuggestion()
})

function suggests(query, callback) {
	var req = new XMLHttpRequest()

	req.open("GET", "https://" + activeLanguage + ".wikipedia.org/w/api.php?action=opensearch&namespace=0&suggest=&search=" + encodeURIComponent(query), true)
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
		// If a search prefix is being used, exclude it from the text string
		if (text.startsWith(activeLanguage + ' ')) {
			text = text.replace(activeLanguage + ' ', '')
		}
		chrome.tabs.update(null, { url: "https://" + activeLanguage + ".wikipedia.org/w/index.php?search=" + encodeURIComponent(text) })
	}
})

// Load settings and languages from storage when the extension is initialized
chrome.storage.local.get(async function (data) {
	// Add languages to storage if they are not there
	if (!data.wikiPrefixArray || !data.wikiLangArray) {
		await getWikis()
	}
	if (typeof data.multiLang == 'undefined') {
		chrome.storage.local.set({
			multiLang: true
		})
	}
	if (data.userLanguage) {
		console.log("Language already set to '" + data.userLanguage + "' (" + defaultLangArray[defaultPrefixArray.indexOf(data.userLanguage)] + ")")
		resolve()
	} else {
		// Detect system language and set it as the default
		resetToSystemLanguage()
		resolve()
	}
})

chrome.runtime.onInstalled.addListener(function (details) {
	// Show welcome page after an update
	chrome.storage.local.get({
		version: '0'
	}, function (data) {
		// Show welcome page after an update
		if (data.version != chrome.runtime.getManifest().version) {
			// Open welcome page
			chrome.tabs.create({ 'url': chrome.extension.getURL('welcome.html') })
			// Set version number
			chrome.storage.local.set({
				version: chrome.runtime.getManifest().version
			})
		}
	})
})

// Initialize Context Menu Search
chrome.contextMenus.create({
	title: 'Search Wikipedia for \"%s\"',
	contexts: ['selection'],
	onclick: function searchText(info) {
		chrome.storage.local.get(function (data) {
			var url = 'https://' + data.userLanguage + '.wikipedia.org/w/index.php?title=Special:Search&search=' + encodeURIComponent(info.selectionText)
			chrome.tabs.create({ url: url })
		})
	}
})