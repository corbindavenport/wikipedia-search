/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

// Update Message

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "update" || "install"){
            if(localStorage.getItem("language") === null){
            var language = "en";
            localStorage["language"] = language;
            console.log("no language selected, defaulting to english");
        }
    }
    chrome.tabs.create({'url': chrome.extension.getURL('welcome.html')});
});

// Awesome New Tab Page Widget

var info = {
  poke: 3,
  width: 1,
  height: 1,
  path: "widget.html",
  "v2": {
    "resize": false,
    "min_height": 1,
    "max_height": 1,
    "min_width": 1,
    "max_width": 1
  },
  "v3": {
    "multi_placement": false
  }
};

chrome.extension.onMessageExternal.addListener(function (request, sender, sendResponse) {
  if ( request === "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-poke" ) {
    chrome.extension.sendMessage(
    sender.id, {
      head: "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-pokeback",
      body: info,
    });
  }
});

// Context Menu Search

function onSearch(info, tab) {
        chrome.tabs.detectLanguage(null, function(lang) {
            var language = localStorage["language"];
            var taburl = "http://" + language + ".wikipedia.org/w/index.php?title=Special:Search&search=" + info.selectionText.replace(/\s/g, "+");
                chrome.tabs.create({ url: taburl, selected: false });
        });
    }
    var id = chrome.contextMenus.create({ "title": "Wikipedia Search", "contexts": ["selection"],
        "onclick": onSearch
    });

// Omnibox Search
// Derived from OmniWiki (github.com/hamczu/OmniWiki)

var currentRequest = null;

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    if (currentRequest != null) {
        currentRequest.onreadystatechange = null;
        currentRequest.abort();
        currentRequest = null;
    }        

    updateDefaultSuggestion(text);
    
    if(text.length > 0){
        currentRequest = suggests(text, function(data) {
            var results = [];

            for(var i = 0; i < data[1].length; i++){
                results.push({
                    content: data[1][i],
                    description: data[1][i]
                });
            }

            suggest(results);
        });
    } else {
     
    }
});

function resetDefaultSuggestion() {      
    chrome.omnibox.setDefaultSuggestion({
        description: ' '
    });
}

resetDefaultSuggestion();
var searchLabel = chrome.i18n.getMessage('search_label');
function updateDefaultSuggestion(text) {      
    chrome.omnibox.setDefaultSuggestion({
        description: searchLabel + ': %s'
    });
   
}

chrome.omnibox.onInputStarted.addListener(function() {
    updateDefaultSuggestion('');
});

chrome.omnibox.onInputCancelled.addListener(function() {
    resetDefaultSuggestion();
});


function suggests(query, callback) {
    var language = localStorage["language"];
    var req = new XMLHttpRequest();
  
    req.open("GET", "http://" + language + ".wikipedia.org/w/api.php?action=opensearch&namespace=0&suggest=&search=" + query, true);
    req.onload = function(){
        if(this.status == 200){
            try{                  
                callback(JSON.parse(this.responseText));
            }catch(e){
                this.onerror();
            }
        }else{
            this.onerror();
        }
    };
    req.onerror = function(){

    };
    req.send();
};

chrome.omnibox.onInputEntered.addListener(function(text) {
    var language = localStorage["language"];
    chrome.tabs.update(null, {url: "http://" + language + ".wikipedia.org/w/index.php?search=" + text});
});