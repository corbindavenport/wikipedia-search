const langSelect = document.getElementById('wikipedia-search-language-select');
const langResetBtn = document.getElementById('wikipedia-search-reset-language');
const multiLangCheck = document.getElementById('wikipedia-search-multilang');
const refreshLangBtn = document.getElementById('wikipedia-search-refresh-languages');
const refreshModal = new bootstrap.Modal(document.getElementById('langModal'));
const refreshModalText = document.getElementById('langModalText');

// Function to update language select menu with list of languages
function updateLangSelect(data) {
	// Save current value and delete list contents
	const initValue = langSelect.value;
	langSelect.innerHTML = '';
	// Create new list
	for (const [key, value] of Object.entries(data)) {
		var option = document.createElement('option')
		option.setAttribute('value', key);
		option.innerText = `${value} - ${key}.wikipedia.org`;
		langSelect.appendChild(option);
	}
	// Restore initial value
	langSelect.value = initValue;
}

// Function for populating settings
async function loadSettings() {
	// Get list of wikis from storage
	const wikiList = await getWikis();
	updateLangSelect(wikiList);
	// Retrieve settings from storage
	const storageData = await chrome.storage.sync.get(['userLanguage', 'multiLang']);
	langSelect.value = storageData.userLanguage;
	multiLangCheck.checked = storageData.multiLang;
	// Allow interaction on settings
	langSelect.remove(0);
	langSelect.removeAttribute('disabled');
	langResetBtn.removeAttribute('disabled');
	multiLangCheck.removeAttribute('disabled');
	refreshLangBtn.removeAttribute('disabled');
}

// Function to save settings
async function saveSettings() {
	chrome.storage.sync.set({
		// Default language
		userLanguage: langSelect.value,
		// Multi-language
		multiLang: multiLangCheck.checked,
	}, function () {
		console.log('Settings saved.')
	})
}

// Save settings after any input change
document.querySelectorAll('input,select').forEach(function (el) {
	el.addEventListener('change', function () {
		saveSettings();
	})
})

// Reset language button
langResetBtn.addEventListener('click', async function () {
	const newLang = await getSystemLanguage();
	langSelect.value = newLang;
	saveSettings();
})

// Refresh language button
refreshLangBtn.addEventListener('click', async function () {
	// Show loading message
	refreshLangBtn.setAttribute('disabled', 'true');
	refreshLangBtn.innerHTML = 'Please wait...'
	// Check for new languages and show success or error message
	await updateWikis().then(
		function (result) {
			console.log('Retrieved site list:', result);
			updateLangSelect(result);
			refreshModalText.innerText = `Done! Wikipedia API provided ${Object.keys(result).length} languages.`;
			refreshModal.show();

		},
		function (error) {
			console.log(error);
			refreshModalText.innerText = `There was an error:\n\n${error}`;
			refreshModal.show();
		}
	);
	// Return button to original state
	refreshLangBtn.removeAttribute('disabled');
	refreshLangBtn.innerHTML = 'Refresh languages';
})

loadSettings()