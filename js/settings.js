/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

// List of Wikipedia's supported language in an array
var langArray= ["ar","az","bg","nan","be","ca","cs","da","de","et","el","en","simple","es","eo","eu","fa","fr","gl","ko","hy","hi","hr","id","it","he","ka","la","lt","hu","ms","min","nl","ja","no","nn","ce","uz","pl","pt","kk","ro","ru","ceb","sk","sl","sr","sh","fi","sv","ta","th","tr","uk","ur","vi","vo","war","zh"];
var detailArray = ["العربية","Azərbaycanca","Български","Bân-lâm-gú / Hō-ló-oē","Беларуская (Акадэмічная)","Català","Čeština","Dansk","Deutsch","Eesti","Ελληνικά","English","Simple English","Español","Esperanto","Euskara","فارسی","Français","Galego","한국어","Հայերեն","हिन्दी","Hrvatski","Bahasa Indonesia","Italiano","עברית","ქართული","Latina","Lietuvių","Magyar","Bahasa Melayu","Bahaso Minangkabau","Nederlands","日本語","Norsk (Bokmål)","Norsk (Nynorsk)","Нохчийн","Oʻzbekcha / Ўзбекча","Polski","Português","Қазақша / Qazaqşa / قازاقشا","Română","Русский","Sinugboanong Binisaya","Slovenčina","Slovenščina","Српски / Srpski","Srpskohrvatski / Српскохрватски","Suomi","Svenska","தமிழ்","ภาษาไทย","Türkçe","Українська","اردو","Tiếng Việt","Volapük","Winaray","中文"];

// Load settings
$(window).on('load', function() {
	// Populate languages menu
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
	if (localStorage.getItem("protocol") === "https://") {
		$("input[name='protocol']").prop("checked", true);
	} else {
		$("input[name='protocol']").prop("checked", true);
	}
	$("input[name='shortcut']").prop("checked", $.parseJSON(localStorage.getItem("shortcut")));
});

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
	if ($("input[name='protocol']").is(":checked")) {
		localStorage["protocol"] = "https://";
	} else {
		localStorage["protocol"] = "http://";
	}
	localStorage.setItem("shortcut", $("input[name='shortcut']").is(":checked"));
});