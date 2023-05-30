window.addEventListener("load",
function () {
  let subscreen = document.getElementById("subscreen");
  let screen = document.getElementById("screen");
  let evalInput = function () {
    /* On récupère le texte écrit dans l'élément screen */
    let input = screen.innerHTML;
    try {
      /* On essaye de le parser */
      let f = Formula.parse(input);
      /* On l'évalue */
      let n = f.eval();
      /* On écrit le résultat dans l'écran auxiliaire */
      subscreen.innerHTML = n;
    } catch (e) {
      /* En cas d'erreur, on ecrit le résultat en rouge dans l'écran auxiliaire */
      subscreen.innerHTML = "<span style='color:red;font-size:8pt;'>" + e + "</span>";
    };
  };
  /* on récupère le div contenant la table contenant les boutons dans les cases */
  let buttons = document.getElementById("buttons");
  /* on gère les évènements clicks des boutons par délégation */
  buttons.addEventListener("click", function (ev) {
    /* si la cible qui a reçu l'évènement physique est un élément
       HTML de type button */
    if (ev.target.tagName.toLowerCase() == "button") {
      /* on récupère la valeur de l'attribue value */
      let v = ev.target.value;
      let content = screen.innerHTML;
      /* Si c'est backspace, on supprime le dernier caractère de l'écran
         principal */
      if (v == "backspace") {
        screen.innerHTML = content.substring(0, content.length - 1);
      } else if (v == "clear") {
        /* Si c'est clear, on efface l'écran principal */
        screen.innerHTML = "";
      } else {
        /* sinon on rajoute le symbole à l'écran principal */
        screen.innerHTML = content + v;
      };

      /* si l'écran principal n'est pas vide, on évalue son contenu avec evalInput() */
      if (screen.innerHTML) {
        evalInput();
      } else {
        /* sinon on efface l'écran auxiliaire */
        subscreen.innerHTML = "";
      }
    }
  });

});
