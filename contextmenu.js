    function onSearch(info, tab) {
        chrome.tabs.detectLanguage(null, function(lang) {
            var language = localStorage["launguage"];
           var taburl = "http://" + language + ".wikipedia.org/w/index.php?title=Special:Search&search=" + info.selectionText.replace(/\s/g, "+");
             chrome.tabs.create({ url: taburl, selected: false });
        });
    }
    var id = chrome.contextMenus.create({ "title": "Wikipedia Search", "contexts": ["selection"],
        "onclick": onSearch
    });