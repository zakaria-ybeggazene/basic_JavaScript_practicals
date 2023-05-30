/* Un objet singleton utilisé comme namespace ou 'package' */
var MediaWiki = {};

MediaWiki.ajax = function (method, url) {

    return new Promise ((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange",  function () {
            /* quand la requête change à l'état 'terminé' */
            if (this.readyState == 4) {
                if (this.status == 200)
                    resolve(this.responseText);
                else
                    reject(this.status + " : " + this.responseText);
            }
        });

        /* on commence la requête HTTP */
        xhr.open(method, url);
        /* on définit quelques en-têtes */
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8"); // type de retour
        xhr.setRequestHeader( 'Api-User-Agent', 'M1Info/1.0' ); //spécifique à Wikimedia

        /* on envoie la requête */
         xhr.send();
    })
};

/* fonction qui envoie uen requête AJAX à l'API Wikimedia. Le resultat est récupéré au format JSON
   et passé en argument à la fonction 'success' en cas de succès ou 'fail' en cas d'erreur.
*/

MediaWiki.query = async function (params) {
    let paramString = "";

    for (var p in params) {
        /* on itère sur toutes les clés de 'params' (qui ne sont pas dans son prototype)
           pour construire la requête
        */
        if (params.hasOwnProperty (p)) {
            paramString += "&" + p + "=" + encodeURIComponent(params[p]);
        };

    };
    let url = "https://www.mediawiki.org/w/api.php?origin=*&format=json&formatversion=2"
        + paramString;

    let res = await MediaWiki.ajax("POST", url);
    return JSON.parse(res);
};


/* Effectue une requête pour récupérer l'URL d'une image dont on donne le nom de fichier.

   Pour un fichier  'foo.jpg', si l'image existe, le résultat est de la forme :

   { batchcomplete :true,
     query: {
              pages :[
                      { ns :6,
                        title: "foo.jpg' ,
                        missing:true,
                        known:true,
                        imagerepository :"shared",
                        imageinfo : [
                          {  url : "https://upload.wikimedia.org/wikipedia/commons/6/69/foo.JPG",
                            descriptionurl : "https://commons.wikimedia.org/wiki/File:foo.jpg",
                            descriptionshorturl :"https://commons.wikimedia.org/w/index.php?curid=18433517"
                            }
                            ]
                      }
                      ]
            }
  }


 */

MediaWiki.getImageURL = function (title) {
    return MediaWiki.query( { titles : title,
                       action : "query",
                       prop : "imageinfo",
                       iiprop : "url" });
};

/* Effectue une requête pour récupérer toutes les pages d'image ayant un rapport avec la chaîne donnée.
*/

MediaWiki.searchImages = async function (str) {
    let req = await MediaWiki.query ( { srsearch : str,
                                        action : "query",
                                        srnamespace : "6",
                                        list : 'search',
                                        utf8 : "1",
                                        srlimit : "20"
                                    });

    let images_array = await Promise.all(req.query.search.map((r) => MediaWiki.getImageURL(r.title)));
    let res = images_array.map ((json) => json.query.pages[0].imageinfo[0].url);
    return res;
};
