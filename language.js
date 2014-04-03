/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

function save_options() {
    var select = document.getElementById("language");
    var language = select.children[select.selectedIndex].value;
    localStorage["language"] = language;
}

function restore_options() {
    var favorite = localStorage["language"];
    if (!favorite) {
        return;
    }
    var select = document.getElementById("language");
    for (var i = 0; i < select.children.length; i++) {
        var child = select.children[i];
        if (child.value == favorite) {
            child.selected = "true";
        break;
        }
    }
}

window.onload = function(){
    document.querySelector('input[value="Save"]').onclick=save_options;
}

window.addEventListener('load',function(){
    var favorite = localStorage["language"];
    if (!favorite) {
        return;
    }
    var select = document.getElementById("language");
    for (var i = 0; i < select.children.length; i++) {
        var child = select.children[i];
        if (child.value == favorite) {
            child.selected = "true";
            break;
        }
    }
});

function startSearch(event) {       
    document.getElementById("searchform").submit();     
}