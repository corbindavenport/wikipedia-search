// List of Wikipedia's supported language in an array
var langArray= ["ar","az","bg","nan","be","ca","cs","da","de","et","el","en","simple","es","eo","eu","fa","fr","gl","ko","hy","hi","hr","id","it","he","ka","la","lt","hu","ms","min","nl","ja","no","nn","ce","uz","pl","pt","kk","ro","ru","ceb","sk","sl","sr","sh","fi","sv","ta","th","tr","uk","ur","vi","vo","war","zh"];
var detailArray = ["العربية","Azərbaycanca","Български","Bân-lâm-gú / Hō-ló-oē","Беларуская (Акадэмічная)","Català","Čeština","Dansk","Deutsch","Eesti","Ελληνικά","English","Simple English","Español","Esperanto","Euskara","فارسی","Français","Galego","한국어","Հայերեն","हिन्दी","Hrvatski","Bahasa Indonesia","Italiano","עברית","ქართული","Latina","Lietuvių","Magyar","Bahasa Melayu","Bahaso Minangkabau","Nederlands","日本語","Norsk (Bokmål)","Norsk (Nynorsk)","Нохчийн","Oʻzbekcha / Ўзбекча","Polski","Português","Қазақша / Qazaqşa / قازاقشا","Română","Русский","Sinugboanong Binisaya","Slovenčina","Slovenščina","Српски / Srpski","Srpskohrvatski / Српскохрватски","Suomi","Svenska","தமிழ்","ภาษาไทย","Türkçe","Українська","اردو","Tiếng Việt","Volapük","Winaray","中文"];

// Load settings
langArray.forEach(function callback(currentValue, index, array) {
	$('#language').append($('<option>', {
		value: currentValue,
		text: detailArray[langArray.indexOf(currentValue)]
	}));
});
// Remove loading option
$("#language option[value='loading'").remove();
// Set to current language
$("#language").val(localStorage["language"]);
$("input[name='shortcut']").prop("checked", $.parseJSON(localStorage.getItem("shortcut")));

// Show instructions for leaving a review based on the browser being used
var useragent = navigator.userAgent

// Opera has to be checked before Chrome, because Opera has both "Chrome" and "OPR" in the user agent string
if (useragent.includes("OPR")) {
	document.querySelector('.review-info').innerHTML = 'Leaving a review on the <a href="https://addons.opera.com/en/extensions/details/wikipedia-search/" target="_blank">Opera add-ons site</a> is also greatly appreciated!'
} else if (useragent.includes("Chrome")) {
	document.querySelector('.review-info').innerHTML = 'Leaving a review on the <a href="https://chrome.google.com/webstore/detail/wikipedia-search/lipakennkogpodadpikgipnogamhklmk" target="_blank">Chrome Web Store</a> is also greatly appreciated!'
}

// Reset language button
$(document).on('click', ".reset-language", function() {
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
$(document).on('change', "input,select", function() {
	localStorage["settings-modified"] = "true";
	localStorage["language"] = $("#language").val();
	localStorage["full-language"] = detailArray[langArray.indexOf($("#language").val())];
	localStorage["protocol"] = "https://"; // We'll remove this option later, but at least it's not user-visible anymore
	localStorage.setItem("shortcut", $("input[name='shortcut']").is(":checked"));
});