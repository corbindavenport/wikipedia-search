// Function for populating language select
async function insertLanguages() {
	// Update list of Wikipedias using API
	const select = document.getElementById('wikipedia-search-language-select')
	const resetButton = document.getElementById('wikipedia-search-reset-language')
	const wikiList = await getWikis()
	for (i in wikiList[0]) {
		var option = document.createElement('option')
		option.setAttribute('value', wikiList[0][i])
		option.innerText = wikiList[1][i] + ' (' + wikiList[0][i] + '.wikipedia.org)'
		select.appendChild(option)
	}
	// Change selected option to active language
	new Promise(function (resolve, reject) {
		chrome.storage.local.get(function (data) {
			select.value = data.userLanguage
			resolve()
		})
	}).then(function() {
		// Finally, allow interaction on language select
		select.remove(0)
		select.removeAttribute('disabled')
		resetButton.removeAttribute('disabled')
		// Save language changes to chrome.storage
		document.getElementById('wikipedia-search-language-select').addEventListener('change', function() {
			saveLanguage(this.value)
		})
	})
}

// Function for saving language select changes
function saveLanguage(language) {
	chrome.storage.local.set({
		userLanguage: language
	}, function() {
		console.log('Language changed to:', language)
	})
}

// Button links
document.querySelectorAll('.link-btn').forEach(function (el) {
	el.addEventListener('click', function () {
		chrome.tabs.create({ url: el.getAttribute('data-url') })
	})
})

// Show instructions for leaving a review based on the browser being used
const useragent = navigator.userAgent
const review = document.querySelector('.review-info')
// Opera has to be checked before Chrome, because Opera has both "Chrome" and "OPR" in the user agent string
if (useragent.includes("OPR")) {
	review.innerHTML = 'Leaving a review on the <a href="https://addons.opera.com/en/extensions/details/wikipedia-search/" target="_blank">Opera add-ons site</a> is also greatly appreciated!'
} else if (useragent.includes("Chrome")) {
	review.innerHTML = 'Leaving a review on the <a href="https://chrome.google.com/webstore/detail/wikipedia-search/lipakennkogpodadpikgipnogamhklmk" target="_blank">Chrome Web Store</a> is also greatly appreciated!'
}

// Reset language button
document.getElementById('wikipedia-search-reset-language').addEventListener('click', function() {
	var lang = resetToSystemLanguage()
	// resetToSystemLanguage updates the storage, so here we only need to change the select value
	document.getElementById('wikipedia-search-language-select').value = lang
})

// Apply settings button
document.getElementById('wikipedia-search-apply-settings').addEventListener('click', function() {
	chrome.runtime.reload()
})

// Enable language select
insertLanguages()