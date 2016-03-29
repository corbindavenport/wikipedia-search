/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

$(window).load(function() {
	// Settings Page
	if ($("#language").length) {
		$("#bitcoin").hide();
		if ($("#protocol").val() === "http://") {
			$("#protocolalert").show();
		} else {
			$("#protocolalert").hide();
		}
		$("#language").val(localStorage["language"]);
		$("#protocol").val(localStorage["protocol"]);
		$("#shortcut").prop("checked", $.parseJSON(localStorage.getItem("shortcut")));
		$("#contentscripts").prop("checked", $.parseJSON(localStorage.getItem("contentscripts")));
		$("#hidesearch").prop("checked", $.parseJSON(localStorage.getItem("hidesearch")));
	}
	// Welcome Page
	if ($(".version").length) {
		$("#bitcoin").hide();
		$(".version").html(chrome.runtime.getManifest().version);
	}
	// Awesome New Tab Page Widget
	if ($("#searchInput").length) {
		$("#searchInput").keypress(function (e) {
		  if (e.which == 13) {
		    window.parent.location = localStorage.getItem("protocol") + localStorage.getItem("language") + ".wikipedia.org/w/index.php?search=" + encodeURI($("#searchInput").val());
				return false;
		  }
		});
	}
});

$(document).on('change', "input,select", function() {
	if ($("#language").length) {
		if ($("#protocol").val() === "http://") {
			$("#protocolalert").show();
		} else {
			$("#protocolalert").hide();
		}
	  localStorage["language"] = $("#language").val();
		localStorage["protocol"] = $("#protocol").val();
		localStorage.setItem("shortcut", $("#shortcut").is(":checked"));
		localStorage.setItem("contentscripts", $("#contentscripts").is(":checked"));
		localStorage.setItem("hidesearch", $("#hidesearch").is(":checked"));
	}
});

$(document).on('click', "input[value='Donate via Bitcoin']", function() {
  $("#bitcoin").show();
});

$(document).on('click', "input[value='Donate via PayPal']", function() {
  window.open('https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4SZVSMJKDS35J&lc=US&item_name=Peek%20Donation&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted', '_blank');
});
