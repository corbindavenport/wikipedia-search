/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

/* Load settings */
$(window).on('load', function() {
	$("#language").val(localStorage["language"]);
	if (localStorage.getItem("protocol") === "https://") {
		$("input[name='protocol']").prop("checked", true);
	} else {
		$("input[name='protocol']").prop("checked", true);
	}
	$("input[name='shortcut']").prop("checked", $.parseJSON(localStorage.getItem("shortcut")));
});

/* Save settings */
$(document).on('change', "input,select", function() {
	localStorage["language"] = $("#language").val();
	if ($("input[name='protocol']").is(":checked")) {
    localStorage["protocol"] = "https://";
  } else {
    localStorage["protocol"] = "http://";
  }
	localStorage.setItem("shortcut", $("input[name='shortcut']").is(":checked"));
});