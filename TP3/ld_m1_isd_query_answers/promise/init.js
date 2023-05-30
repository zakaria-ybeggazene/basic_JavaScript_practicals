window.addEventListener("load", function () {
    let search = document.getElementById("search");
    let searchButton = document.getElementById("searchButton");
    searchButton.addEventListener("click", function (ev) {
        searchButton.disabled = "disabled";
        let divResults = document.getElementById("searchResults");
        let pImageURLs = MediaWiki.searchImages(search.value);
        pImageURLs.then (function (imageURLs) {
            divResults.innerHTML = "";
            for (let url of imageURLs) {
                divResults.innerHTML += "<img src='" + url + "'/>";
            }
            searchButton.disabled = "";
        });
    });

});
