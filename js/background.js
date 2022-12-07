importScripts('/js/shared.js');

// Global variables
const isChrome = Boolean(navigator.userAgent.includes('Chrome'))
const isFirefox = Boolean(navigator.userAgent.includes('Firefox'))
var wikiLangArray = []
var wikiPrefixArray = []
var userLanguage = ''
var multiLang = ''
var siteVersion = ''
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
		siteVersion = data.siteVersion
	})
})

chrome.omnibox.onInputChanged.addListener(async function (text, suggest) {
	// If the first word in the query matches a known Wikipedia language, and multi-language is enabled, change the active search to that language
	var firstWord = text.split(' ')[0]
	if ((multiLang === true) && text.startsWith(firstWord + ' ') && (wikiPrefixArray.includes(firstWord))) {
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
			} else if (isChrome) {
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

async function suggests(query) {
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
		chrome.tabs.update(null, { url: chrome.runtime.getURL('settings.html') })
	} else {
		// If a search prefix is being used, exclude it from the text string
		if (text.startsWith(activeLanguage + ' ')) {
			text = text.replace(activeLanguage + ' ', '')
		}
		if (siteVersion === 'desktop') {
			chrome.tabs.update(null, { url: "https://" + activeLanguage + ".wikipedia.org/w/index.php?search=" + encodeURIComponent(text) })
		} else {
			chrome.tabs.update(null, { url: "https://" + activeLanguage + ".m.wikipedia.org/w/index.php?search=" + encodeURIComponent(text) })
		}
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
	if (typeof data.siteVersion == 'undefined') {
		chrome.storage.local.set({
			siteVersion: 'desktop'
		})
	}
	if (data.userLanguage) {
		console.log("Language already set to '" + data.userLanguage + "' (" + defaultLangArray[defaultPrefixArray.indexOf(data.userLanguage)] + ")")
	} else {
		// Detect system language and set it as the default
		resetToSystemLanguage()
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
			chrome.tabs.create({ 'url': chrome.runtime.getURL('welcome.html') })
			// Set version number
			chrome.storage.local.set({
				version: chrome.runtime.getManifest().version
			})
		}
	})
})

// Context menu search

chrome.runtime.onStartup.addListener(function () {
	chrome.contextMenus.create({
		id: "search-wikipedia",
		title: 'Search Wikipedia for \"%s\"',
		contexts: ['selection']
	})
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
	if (info.menuItemId == "search-wikipedia") {
		chrome.storage.local.get(function (data) {
			if (data.siteVersion === 'desktop') {
				var url = 'https://' + data.userLanguage + '.wikipedia.org/w/index.php?title=Special:Search&search=' + encodeURIComponent(info.selectionText)
			} else {
				var url = 'https://' + data.userLanguage + '.m.wikipedia.org/w/index.php?title=Special:Search&search=' + encodeURIComponent(info.selectionText)
			}
			chrome.tabs.create({ url: url })
		})
	}
})