// Remind users of Wikipedia Search on Wikipedia home page
if (window.location.href.includes("www.wikipedia.org") && document.body.querySelector(".search-container")) {
	var searchcontainer = document.body.querySelector(".search-container")
	searchcontainer.innerHTML = searchcontainer.innerHTML + "You can search Wikipedia from your browser's search bar. Just type 'wiki' in the search bar, then a space, then the name of the article you want."
}