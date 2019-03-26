$(document).ready(function() {

	// Add version number to welcome page
	$(".version").html(" " + chrome.runtime.getManifest().version);

	// Add language to welcome page
	if ($.parseJSON(localStorage.getItem("settings-modified")) == false) {
		$(".language-warning").html('The search language has been auto-detected as <b>' + localStorage["full-language"] + ' (' + localStorage["language"] + ')</b>.<a class="btn btn-primary" href="settings.html" role="button">Change language</a>');
	} else {
		$(".language-warning").html('The search language is currently set to <b>' + localStorage["full-language"] + ' (' + localStorage["language"] + ')</b>.<a class="btn btn-primary" href="settings.html" role="button">Change language</a>');
	}

	//Show instructions for leaving a review based on the browser being used
	var useragent = navigator.userAgent;

	// Opera has to be checked before Chrome, because Opera has both "Chrome" and "OPR" in the user agent string
	if (useragent.includes("OPR")) {
		$('.review-info').html('Also please leave a review on the <a href="https://addons.opera.com/en/extensions/details/wikipedia-search/" target="_blank">Opera add-ons site</a> if you can.');
	} else if (useragent.includes("Chrome")) {
		$('.review-info').html('Also please leave a review on the <a href="https://chrome.google.com/webstore/detail/wikipedia-search/lipakennkogpodadpikgipnogamhklmk" target="_blank">Chrome Web Store</a> if you can.');
	}

});