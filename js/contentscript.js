/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

// Remind users of Wikipedia Search on Wikipedia home page

if ((window.location.href.indexOf("www.wikipedia.org")) > -1 && (document.body.querySelector(".search-container"))) {
	var searchcontainer = document.body.querySelector(".search-container");
	searchcontainer.innerHTML = searchcontainer.innerHTML + "<i>Since you have the Wikipedia Search extension installed, you can search Wikipedia from your browser's search bar. Just type 'wiki' in the search bar, then a space, then the name of the article you want.</i>";
}