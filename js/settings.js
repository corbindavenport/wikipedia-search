
// Remove loading option
$("#language option[value='loading'").remove();
// Set to current language
$("#language").val(localStorage["language"]);
$("input[name='shortcut']").prop("checked", $.parseJSON(localStorage.getItem("shortcut")));

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

// Reset language button
$(document).on('click', ".reset-language", function () {
	// Detect the user's system language
	var lang = navigator.languages[0];
	// Cut off the localization part if it exists (e.g. en-US becomes en), to match with Wikipedia's format
	var n = lang.indexOf('-');
	lang = lang.substring(0, n != -1 ? n : lang.length);
	console.log(lang)
	// Check if the language has a Wikipedia
	if (langArray.includes(lang)) {
		$("#language").val(lang);
		localStorage["language"] = lang;
		localStorage["full-language"] = detailArray[langArray.indexOf(lang)];
	} else {
		alert("Sorry, Wikipedia Search could not auto-detect your system language.")
	}
});

// Save settings
$(document).on('change', "input,select", function () {
	localStorage["settings-modified"] = "true";
	localStorage["language"] = $("#language").val();
	localStorage["full-language"] = detailArray[langArray.indexOf($("#language").val())];
	localStorage["protocol"] = "https://"; // We'll remove this option later, but at least it's not user-visible anymore
	localStorage.setItem("shortcut", $("input[name='shortcut']").is(":checked"));
});