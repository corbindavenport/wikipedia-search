/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

$(document).ready(function() {

	// Add version number to welcome page
	$(".version").html(" " + chrome.runtime.getManifest().version);

	//Show instructions for leaving a review based on the browser being used
	var useragent = navigator.userAgent;

	// Opera has to be checked before Chrome, because Opera has both "Chrome" and "OPR" in the user agent string
	if (useragent.includes("OPR")) {
		$('.review-info').html('Also please leave a review on the <a href="https://addons.opera.com/en/extensions/details/wikipedia-search/" target="_blank">Opera add-ons site</a> if you can.');
	} else if (useragent.includes("Chrome")) {
		$('.review-info').html('Also please leave a review on the <a href="https://chrome.google.com/webstore/detail/wikipedia-search/lipakennkogpodadpikgipnogamhklmk" target="_blank">Chrome Web Store</a> if you can.');
	}

});