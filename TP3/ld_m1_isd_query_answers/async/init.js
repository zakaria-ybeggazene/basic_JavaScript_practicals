window.addEventListener("load", function () {
    let search = document.getElementById("search");
    let searchButton = document.getElementById("searchButton");
    let inQuery = false;

    searchButton.addEventListener("click", async function (ev) {
        inQuery = true;
        searchButton.disabled = "disabled";
        let divResults = document.getElementById("searchResults");
        let imageURLs = await MediaWiki.searchImages(search.value);
        divResults.innerHTML = "";
        for (let url of imageURLs) {
            divResults.innerHTML += "<img src='" + url + "'/>";
        }
        inQuery = false;
        searchButton.disabled = "";
    });

});
