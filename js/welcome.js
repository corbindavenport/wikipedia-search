// Function for retrieving parameters from URLs
// Credit: https://stackoverflow.com/a/901144/2255592
function getParameterByName(name, url) {
	if (!url) {
	  url = window.location.href
	}
	name = name.replace(/[\[\]]/g, '\\$&')
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	  results = regex.exec(url)
	if (!results) return null
	if (!results[2]) return ''
	return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }

// Add version number to welcome page
document.querySelector('.version').innerHTML = chrome.runtime.getManifest().version

// Add language to welcome page
var lang = decodeURIComponent(getParameterByName('lang'))
document.querySelector(".wikipedia-search-language").innerHTML = 'The search language is currently set to <b>' + lang + '</b>.'

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