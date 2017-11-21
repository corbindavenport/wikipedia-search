/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

/* Code for the Awesome New Tab Page widget */

$(window).on("load", function() {
    $("#searchInput").attr("placeholder", "Search in " + localStorage.getItem("language") + "...")
});

$("#searchInput").keypress(function (e) {
    if (e.which == 13) {
    window.parent.location = localStorage.getItem("protocol") + localStorage.getItem("language") + ".wikipedia.org/w/index.php?search=" + encodeURI($("#searchInput").val());
        return false;
    }
});