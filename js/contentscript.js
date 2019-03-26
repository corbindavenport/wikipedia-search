// Remind users of Wikipedia Search on Wikipedia home page
if ((window.location.href.indexOf("www.wikipedia.org")) > -1 && (document.body.querySelector(".search-container"))) {
	var searchcontainer = document.body.querySelector(".search-container");
	searchcontainer.innerHTML = searchcontainer.innerHTML + "<i>Since you have the Wikipedia Search extension installed, you can search Wikipedia from your browser's search bar. Just type 'wiki' in the search bar, then a space, then the name of the article you want.</i>";
}