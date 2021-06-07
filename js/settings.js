// Function for populating settings
async function loadSettings() {
	// Update list of Wikipedias using API
	const select = document.getElementById('wikipedia-search-language-select')
	const resetButton = document.getElementById('wikipedia-search-reset-language')
	const multiLangButton = document.querySelector('#wikipedia-search-multilang')
	const siteSelect = document.querySelector('#wikipedia-search-site-select')
	const wikiList = await getWikis()
	for (i in wikiList[0]) {
		var option = document.createElement('option')
		option.setAttribute('value', wikiList[0][i])
		option.innerText = wikiList[1][i] + ' (' + wikiList[0][i] + '.wikipedia.org)'
		select.appendChild(option)
	}
	// Retrieve settings from storage
	new Promise(function (resolve, reject) {
		chrome.storage.local.get(function (data) {
			console.log(data)
			select.value = data.userLanguage
			multiLangButton.checked = data.multiLang
			siteSelect.value = data.siteVersion
			resolve()
		})
	}).then(function () {
		// Allow interaction on settings
		select.remove(0)
		select.removeAttribute('disabled')
		resetButton.removeAttribute('disabled')
		multiLangButton.removeAttribute('disabled')
		siteSelect.removeAttribute('disabled')
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
			// Site version
			siteVersion: document.querySelector('#wikipedia-search-site-select').value
		}, function() {
			console.log('settings saved')
		})
	})
})

// Button links
document.querySelectorAll('.link-btn').forEach(function (el) {
	el.addEventListener('click', function () {
		chrome.tabs.create({ url: el.getAttribute('data-url') })
	})
})

// Reset language button
document.getElementById('wikipedia-search-reset-language').addEventListener('click', function () {
	var lang = resetToSystemLanguage()
	// resetToSystemLanguage updates the storage, so here we only need to change the select value
	document.getElementById('wikipedia-search-language-select').value = lang
})

// Show credits
fetch('https://corbin.io/supporters.json').then(function (response) {
	response.json().then(function (data) {
		var creditsList = 'Diamond supporters: '
		for (var i = 0; i < data['supporters'].length; i++) {
			creditsList += data['supporters'][i] + ', '
		}
		creditsList = creditsList.substring(0, creditsList.length - 2)
		document.getElementById('supporters').innerText = creditsList
	})
})
.catch(function (err) {
	document.getElementById('supporters').innerText = 'There was an error fetching Peek supporters.'
})

loadSettings()