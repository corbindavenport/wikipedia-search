importScripts('/js/shared.js');

// TODO: Migrate userLanguage, multiLang, and other options to chrome.storage.sync

// Global variables
const isFirefox = chrome.runtime.getURL('').startsWith('moz-extension://');
const isMicrosoftEdge = navigator.userAgent.includes('Edg');
let wikiList = {};
let userLanguage, multiLang, activeLanguage;

/**
 * Returns the Wikipedia search URL for a given string and selected language.
 * @param {String} searchText Text to search
 * @param {String} language Language code to use for search (e.g. "en" or "de")
 * @returns 
 */
function getSearchUrl(searchText, language) {
	return "https://" + language + ".wikipedia.org/w/index.php?search=" + encodeURIComponent(searchText);
}

// Load data and settings when Omnibox search is activated
chrome.omnibox.onInputStarted.addListener(async function () {
	// Get settings from storage
	const storageData = await chrome.storage.sync.get(['userLanguage', 'multiLang', 'wikiList']);
	userLanguage = storageData.userLanguage;
	multiLang = storageData.multiLang;
	// Reset default suggestion
	updateDefaultSuggestion('', activeLanguage)
	// Get list of Wikipedia sites
	wikiList = (storageData.wikiList || defaultWikiList);
})

// Function to generate omnibox search dropdown results
chrome.omnibox.onInputChanged.addListener(async function (text, suggest) {
	let results = [];
	if (userLanguage && (text.length > 0)) {
		// If the first word in the query matches a known Wikipedia language, and multi-language is enabled, change the active search to that language
		var firstWord = text.split(' ')[0]
		if ((multiLang === true) && text.startsWith(firstWord + ' ') && wikiList.hasOwnProperty(firstWord)) {
			activeLanguage = firstWord;
			text = text.replace(firstWord + ' ', '');
		} else {
			activeLanguage = userLanguage;
		}
		updateDefaultSuggestion(text, activeLanguage);
		const request = await getSuggestions(text);
		// Set the maximum number of suggestion slots, leaving one for the settings page link
		if (isFirefox) {
			num = 4;
		} else if (isMicrosoftEdge) {
			num = 7;
		} else {
			num = 8;
		}
		// Create list of suggestions from API results
		for (var i = 0; i < num; i++) {
			const articleTitle = request[1][i];
			const articleUrl = request[3][i];
			if (articleTitle) {
				results.push({
					content: articleUrl,
					description: articleTitle
				})
			}
		}
	} else if (activeLanguage || userLanguage) {
		updateDefaultSuggestion('', (activeLanguage || userLanguage));
	}
	// Add settings suggestion
	if (isFirefox) {
		// Firefox doesn't support <dim>
		results.push({
			content: chrome.runtime.getURL('settings.html'),
			description: "Change default search language (currently set to " + wikiList[activeLanguage] + ")"
		})
	} else {
		results.push({
			content: chrome.runtime.getURL('settings.html'),
			description: "<dim>Change default search language (currently set to " + wikiList[activeLanguage] + ")</dim>"
		})
	}
	// Return list of suggestions to the browser
	suggest(results);
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

/**
 * Gets list of autocomplete suggestions using official Wikimedia API.
 * 
 * More information: https://www.mediawiki.org/wiki/API:Opensearch
 * @param {String} query Text string to use for search 
 * @returns {Promise} Promise that resolves with a JSON object
 */
async function getSuggestions(query) {
	return new Promise(async function (resolve) {
		const url = "https://" + activeLanguage + ".wikipedia.org/w/api.php?action=opensearch&namespace=0&suggest=&search=" + encodeURIComponent(query);
		console.log(url)
		const response = await fetch(url);
		if (!response.ok) {
			console.log('Could not obtain data from Wikipedia API.');
			resolve(null);
		}
		const json = await response.json();
		resolve(json);
	})
}

// Function for handling clicks in the omnibox results or Enter key press
chrome.omnibox.onInputEntered.addListener(function (text) {
	if (!(text.startsWith('https://') || text.startsWith('moz-extension://') || text.startsWith('chrome-extension://'))) {
		// This is a search string, so it needs to be converted to a search page URL
		text = getSearchUrl(text, activeLanguage);
	}
	chrome.tabs.update({ url: text });
})

// Initialize welcome message and context menu entry on extension load
chrome.runtime.onInstalled.addListener(async function (details) {
	// Initialize context menu
	chrome.contextMenus.create({
		id: "search-wikipedia",
		title: 'Search Wikipedia for \"%s\"',
		contexts: ['selection']
	})
	// Load settings and languages from synced storage, and migrate old local data if needed
	const legacyData = await chrome.storage.local.get(['userLanguage', 'multiLang']);
	const storageData = await chrome.storage.sync.get(['userLanguage', 'multiLang']);
	// Set user language
	if (legacyData.userLanguage) {
		await chrome.storage.sync.set({
			userLanguage: legacyData.userLanguage
		});
	} else if (storageData.userLanguage) {
		console.log(`Language set to ${storageData.userLanguage}.`);
	} else {
		const newLang = await getSystemLanguage();
		await chrome.storage.sync.set({
			userLanguage: newLang
		});
	}
	// Set multi-language mode
	if (legacyData.multiLang) {
		await chrome.storage.sync.set({
			multiLang: legacyData.multiLang
		});
	} else if (storageData.multiLang) {
		console.log(`Multi-language mode set to ${storageData.multiLang}.`);
	} else {
		await chrome.storage.sync.set({
			multiLang: false
		});
	}
	// Delete old data so migration doesn't run again
	chrome.storage.local.clear();
	// Show welcome message
	if (details.reason === 'install' || details.reason === 'update') {
		chrome.tabs.create({ 'url': chrome.runtime.getURL('welcome.html') });
	};
})

// Function for context menu search
chrome.contextMenus.onClicked.addListener(async function (info) {
	if (info.menuItemId == "search-wikipedia") {
		const storageData = await chrome.storage.local.get(['userLanguage']);
		const targetUrl = getSearchUrl(info.selectionText, storageData.userLanguage);
		chrome.tabs.create({ url: targetUrl });
	}
})