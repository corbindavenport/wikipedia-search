// Functions for Omnibox Search
// Derived from OmniWiki (github.com/hamczu/OmniWiki)
function initializeOmniboxSearch(userLanguage) {
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
						description: "<dim>Change search language (currently set to " + userLanguage + ")</dim>"
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
		var req = new XMLHttpRequest()

		req.open("GET", "https://" + userLanguage + ".wikipedia.org/w/api.php?action=opensearch&namespace=0&suggest=&search=" + query, true)
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
			chrome.tabs.update(null, { url: "https://" + userLanguage + ".wikipedia.org/w/index.php?search=" + text })
		}
	})

}

chrome.runtime.onInstalled.addListener(function () {
	// Initialize language settings
	var langPromise = new Promise(function (resolve, reject) {
		chrome.storage.local.get(async function (data) {
			if (data.userLanguage) {
				console.log("Language already set to '" + data.userLanguage + "' (" + defaultLangArray[defaultPrefixArray.indexOf(data.userLanguage)] + ")")
				resolve()
			} else {
				if (localStorage['language']) {
					// Transfer language setting from Wikipedia Search 7.0.2-9.1
					if (defaultPrefixArray.includes(localStorage['language'])) {
						chrome.storage.local.set({
							userLanguage: localStorage['language']
						}, function () {
							console.log('Language setting (' + localStorage['language'] + ') migrated to chrome.storage.')
							// Delete old variable so this check doesn't happen again
							localStorage.removeItem('language')
							resolve()
						})
					} else {
						// Detect system language and set it as the default
						resetToSystemLanguage()
						resolve()
					}
				} else {
					// Detect system language and set it as the default
					resetToSystemLanguage()
					resolve()
				}
			}
		})
	})
	// Finish startup
	Promise.all([langPromise]).then(function () {
		chrome.storage.local.get(function (data) {
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
			// Initialize Omnibox search
			initializeOmniboxSearch(data.userLanguage)
			// Show welcome page after update
			const welcomeString = encodeURIComponent(defaultLangArray[defaultPrefixArray.indexOf(data.userLanguage)] + ' (' + data.userLanguage + ')')
			if (data.version) {
				if (!(data.version === chrome.runtime.getManifest().version)) {
					chrome.tabs.create({ 'url': chrome.extension.getURL('welcome.html?lang=' + welcomeString) })
					chrome.storage.local.set({
						version: chrome.runtime.getManifest().version
					})
				}
			} else {
				chrome.tabs.create({ 'url': chrome.extension.getURL('welcome.html?lang=' + welcomeString) })
				chrome.storage.local.set({
					version: chrome.runtime.getManifest().version
				})
			}
		})
	})
})