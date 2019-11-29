// Add version number to welcome page
document.querySelector('.version').innerHTML = chrome.runtime.getManifest().version

// Add language to welcome page
if (JSON.parse(localStorage.getItem("settings-modified")) == false) {
	document.querySelector(".language-warning").innerHTML = 'The search language has been auto-detected as <b>' + localStorage["full-language"] + ' (' + localStorage["language"] + ')</b>.<a class="btn btn-primary" href="settings.html" role="button">Change language</a>'
} else {
	document.querySelector(".language-warning").innerHTML = 'The search language is currently set to <b>' + localStorage["full-language"] + ' (' + localStorage["language"] + ')</b>.<a class="btn btn-primary" href="settings.html" role="button">Change language</a>'
}

// Button links
document.querySelectorAll('.link-btn').forEach(function (el) {
	el.addEventListener('click', function () {
		chrome.tabs.create({ url: el.getAttribute('data-url') })
	})
})

// Show instructions for leaving a review based on the browser being used
const useragent = navigator.userAgent
var review = document.querySelector('.review-info')
// Opera has to be checked before Chrome, because Opera has both "Chrome" and "OPR" in the user agent string
if (useragent.includes("OPR")) {
	review.innerHTML = 'Leaving a review on the <a href="https://addons.opera.com/en/extensions/details/wikipedia-search/" target="_blank">Opera add-ons site</a> is also greatly appreciated!'
} else if (useragent.includes("Chrome")) {
	review.innerHTML = 'Leaving a review on the <a href="https://chrome.google.com/webstore/detail/wikipedia-search/lipakennkogpodadpikgipnogamhklmk" target="_blank">Chrome Web Store</a> is also greatly appreciated!'
}