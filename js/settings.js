// Function for populating settings
async function loadSettings() {
	// Update list of Wikipedias using API
	const select = document.getElementById('wikipedia-search-language-select')
	const resetButton = document.getElementById('wikipedia-search-reset-language')
	const multiLangButton = document.querySelector('#wikipedia-search-multilang')
	const siteSelect = document.querySelector('#wikipedia-search-site-select')
	const wikiList = await getWikis();
	for (const [key, value] of Object.entries(wikiList)) {
		var option = document.createElement('option')
		option.setAttribute('value', key);
		option.innerText = `${value} - ${key}.wikipedia.org`;
		select.appendChild(option);
	}
	// Retrieve settings from storage
	new Promise(function (resolve, reject) {
		chrome.storage.local.get(function (data) {
			console.log(data)
			select.value = data.userLanguage
			multiLangButton.checked = data.multiLang
			resolve()
		})
	}).then(function () {
		// Allow interaction on settings
		select.remove(0)
		select.removeAttribute('disabled')
		resetButton.removeAttribute('disabled')
		multiLangButton.removeAttribute('disabled')
	})
}

// Save settings after any input change
document.querySelectorAll('input,select').forEach(function (el) {
	el.addEventListener('change', function () {
		chrome.storage.local.set({
			// Default language
			userLanguage: document.querySelector('#wikipedia-search-language-select').value,
			// Multi-language
			multiLang: document.querySelector('#wikipedia-search-multilang').checked,
		}, function () {
			console.log('settings saved')
		})
	})
})

// Reset language button
document.getElementById('wikipedia-search-reset-language').addEventListener('click', async function () {
	var lang = await resetToSystemLanguage()
	// resetToSystemLanguage updates the storage, so here we only need to change the select value
	document.getElementById('wikipedia-search-language-select').value = lang
})

loadSettings()