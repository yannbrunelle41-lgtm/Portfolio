// querySelector trouve le premier élément qui correspond au sélecteur. Le point indique une classe CSS.
const bouton = document.querySelector(".burger-menu");
// Le # indique un identifiant HTML. Ici, on mémorise l'élément qui a id="menu".
const menu = document.querySelector("#menu");

// addEventListener indique quelle fonction exécuter à chaque clic sur le bouton burger.
bouton.addEventListener("click", function () {
  // getAttribute lit la valeur HTML de data-visible. === compare cette valeur au texte "false".
  if (menu.getAttribute("data-visible") === "false") {
    // console.log affiche l'état avant l'ouverture dans la console du navigateur.
    console.log(menu.getAttribute("data-visible"));
    // setAttribute passe data-visible à "true". Le CSS utilise cette valeur pour afficher le menu.
    menu.setAttribute("data-visible", "true")
    // aria-expanded indique aux technologies d'assistance que le bouton a ouvert le menu.
    bouton.setAttribute("aria-expanded", "true")
  } // Fin des instructions exécutées à l'ouverture.
  // else exécute ce bloc dans l'autre cas. Le menu est alors ouvert et doit se fermer.
  else {
    // On affiche l'état du menu dans la console avant de le fermer.
    console.log(menu.getAttribute("data-visible"));
    // On remet data-visible à "false" pour masquer le menu via le CSS.
    menu.setAttribute("data-visible", "false")
    // On indique aux technologies d'assistance que le menu est replié.
    bouton.setAttribute("aria-expanded", "false")
  } // Fin des instructions exécutées à la fermeture.
}); // Fin de la fonction appelée au clic sur le bouton burger.

// On récupère les flèches, le compteur et les cartes du carrousel.
// On trouve le bouton qui sélectionne le projet précédent.
const boutonGauche = document.querySelector(".command-left");
// On trouve le bouton qui sélectionne le projet suivant.
const boutonDroit = document.querySelector(".command-right");
// Le sélecteur trouve le paragraphe dans .commands, celui qui affiche par exemple 1/4.
const compteur = document.querySelector(".commands p");
// On récupère .projects, la zone qui contient et cadre les cartes.
const piste = document.querySelector(".projects");
// querySelectorAll trouve les cartes dans cette zone. Array.from transforme le résultat en tableau.
const cartes = Array.from(piste.querySelectorAll(".article-project"));

// Les angles sont en radians. 2 × π correspond à un tour complet.
// Math.PI donne π. La valeur 2 × π sert de référence pour un tour entier.
const tourComplet = Math.PI * 2;
// On divise le tour par le nombre de cartes. Avec quatre cartes, chacune est espacée d'un quart de tour.
const angleEntreCartes = tourComplet / cartes.length;
// La roue met 520 millisecondes à avancer d'une carte.
const dureeRotation = 520;
// matchMedia permet de vérifier si la personne a activé la réduction des animations sur son appareil.
const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)");
// Le tableau commence à l'indice 0. Cette valeur correspond donc au premier projet.
let indiceCentral = 0;
// Ce témoin vaut false tant qu'aucune rotation n'est en train de se jouer.
let rotationEnCours = false;
// Ce tableau conserve les prochains clics dans l'ordre où ils arrivent.
const directionsEnAttente = [];

// Cette fonction place toutes les cartes pour un angle donné de la roue.
function dessinerRoue(rotation) {
  // forEach parcourt le tableau. carte est l'élément traité et indice est sa position dans le tableau.
  cartes.forEach(function (carte, indice) {
    // Chaque carte a sa place sur la roue. On soustrait la même rotation
    // à toutes les cartes pour qu'elles avancent ensemble.
    // On calcule l'angle de départ de cette carte, puis on lui applique la rotation commune.
    const angle = indice * angleEntreCartes - rotation;
    // Le sinus vaut entre -1 et 1. Un résultat négatif place la carte à gauche, un positif à droite.
    const positionLaterale = Math.sin(angle);
    // Le cosinus vaut 1 devant, 0 sur les côtés et -1 tout à l'arrière.
    const profondeur = Math.cos(angle);

    // Le sinus donne la position gauche/droite en largeur de carte.
    // Le cosinus place la carte à l'avant (0 rem) ou à l'arrière (-16 rem).
    // On limite l'inclinaison pour laisser les faces latérales visibles.
    // On convertit la position latérale en pourcentage de la largeur de la carte, jusqu'à 105 % de chaque côté.
    const x = positionLaterale * 105;
    // Soustraire 1 place l'avant à zéro. Multiplier par 8 donne le recul en rem sur l'axe Z.
    const z = (profondeur - 1) * 8;
    // On convertit la position latérale en un angle compris entre -30° et +30°. Au centre, l'angle vaut 0°.
    const inclinaison = positionLaterale * 30;
    // translate3d déplace la carte sur les axes X, Y et Z. rotateY la pivote autour de son axe vertical.
    carte.style.transform = `translate3d(${x}%, 0, ${z}rem) rotateY(${inclinaison}deg)`;

    // Les cartes restent opaques à l'avant et s'effacent en passant derrière.
    // L'ordre des couches garde les cartes proches devant les cartes éloignées.
    // Math.max garde 0 à l'avant. À l'arrière, le recul augmente jusqu'à 1.
    const recul = Math.max(0, -profondeur);
    // On soustrait le carré du recul à 1 pour obtenir une disparition progressive vers l'arrière.
    const opacite = 1 - recul ** 2;
    // L'opacité vaut 1 quand la carte est opaque et 0 quand elle est transparente.
    carte.style.opacity = opacite;
    // Le ? choisit hidden si l'opacité vaut zéro. Le : donne visible dans les autres cas.
    carte.style.visibility = opacite === 0 ? "hidden" : "visible";
    // On donne le z-index le plus élevé aux cartes les plus proches pour qu'elles passent devant les autres.
    carte.style.zIndex = Math.round((profondeur + 1) * 100);
  }); // Fin du traitement d'une carte. forEach passe à la suivante.
} // Fin du placement des cartes pour cette image.

// Cette fonction met à jour le projet sélectionné après le mouvement.
function actualiserProjetCentral() {
  // Le compteur et la classe centrale suivent la carte arrivée de face.
  // On parcourt les cartes pour marquer celle qui vient d'arriver au centre.
  cartes.forEach(function (carte, indice) {
    // Avec ces deux arguments, toggle ajoute central si l'indice correspond et la retire sinon.
    carte.classList.toggle("central", indice === indiceCentral);
  }); // Fin du passage sur les cartes.
  // On ajoute 1 car l'affichage commence à 1 alors que les indices commencent à 0.
  compteur.textContent = `${indiceCentral + 1}/${cartes.length}`;
} // Fin de la mise à jour du projet sélectionné.

// Cette fonction démarre la prochaine rotation si un clic est en attente.
function lancerRotation() {
  // Les clics rapides attendent leur tour pour éviter les sauts de position.
  // Le symbole || veut dire « ou ». return sort si la roue tourne déjà ou si la file est vide.
  if (rotationEnCours || directionsEnAttente.length === 0) return;

  // On indique que la roue est occupée avant de commencer à animer les cartes.
  rotationEnCours = true;
  // shift retire le premier clic de la file et renvoie son sens, 1 ou -1.
  const direction = directionsEnAttente.shift();
  // Le projet qui est déjà au centre détermine l'angle de départ de la roue.
  const angleDepart = indiceCentral * angleEntreCartes;
  // On multiplie l'écart entre deux cartes par le sens pour obtenir un quart de tour à droite ou à gauche.
  const angleParcouru = direction * angleEntreCartes;
  // On réserve une variable pour l'heure de la première image, encore inconnue à ce stade.
  let instantDepart;

  // instant est le temps en millisecondes que le navigateur fournit pour l'image en cours.
  function animer(instant) {
    // Le navigateur appelle cette fonction avant chaque nouvelle image.
    // La progression va de 0 à 1 et sert à calculer un seul angle commun.
    // ??= fixe instantDepart au premier appel, puis conserve cette même valeur aux appels suivants.
    instantDepart ??= instant;
    // matches indique si l'appareil demande de réduire les animations.
    const progression = mouvementReduit.matches
      // Si oui, on passe directement à 1, la position finale.
      ? 1
      // Sinon, on divise le temps écoulé par la durée. Math.min empêche la progression de dépasser 1.
      : Math.min((instant - instantDepart) / dureeRotation, 1);
    // Le cosinus transforme la progression en un mouvement qui accélère puis ralentit.
    const progressionAdoucie = (1 - Math.cos(progression * Math.PI)) / 2;
    // On ajoute la part du quart de tour déjà parcourue à l'angle de départ, puis on place les quatre cartes.
    dessinerRoue(angleDepart + angleParcouru * progressionAdoucie);

    // Tant que la progression est inférieure à 1, la rotation continue.
    if (progression < 1) {
      // On demande au navigateur de rappeler animer à l'image suivante.
      requestAnimationFrame(animer);
      // On quitte cet appel pour attendre la prochaine image avant de terminer la rotation.
      return;
    } // Fin du cas où la roue tourne encore.

    // Le modulo permet de revenir du dernier projet au premier et inversement.
    // Le % donne le reste de la division. Ajouter cartes.length évite un indice négatif quand on recule depuis 0.
    indiceCentral = (indiceCentral + direction + cartes.length) % cartes.length;
    // On actualise le compteur et la classe central maintenant que la carte est arrivée.
    actualiserProjetCentral();
    // La roue est libre pour un éventuel clic suivant.
    rotationEnCours = false;
    // On traite le prochain clic si la file en contient un.
    lancerRotation();
  } // Fin de la fonction appelée à chaque image.

  // On demande la première image pour démarrer la rotation.
  requestAnimationFrame(animer);
} // Fin de la fonction qui lance une rotation.

// Droite : la carte de droite avance au centre. Gauche : mouvement inverse.
// On relie le bouton droit à cette fonction, exécutée à chaque clic.
boutonDroit.addEventListener("click", function () {
  // On ajoute 1 à la file. C'est la consigne qui fait avancer d'un projet.
  directionsEnAttente.push(1);
  // On essaie de démarrer la rotation. Si elle est occupée, la consigne reste dans la file.
  lancerRotation();
}); // Fin de la fonction appelée au clic sur la flèche droite.

// On relie le bouton gauche à sa propre fonction de clic.
boutonGauche.addEventListener("click", function () {
  // On ajoute -1 à la file pour reculer d'un projet.
  directionsEnAttente.push(-1);
  // On lance la rotation si la roue est libre.
  lancerRotation();
}); // Fin de la fonction appelée au clic sur la flèche gauche.

// On met les quatre cartes sur la roue, y compris celle qui part à l'arrière.
// Au chargement de la page, on prépare chaque carte pour le placement en 3D.
cartes.forEach(function (carte) {
  // On retire les anciennes classes de position pour que les quatre cartes puissent participer au mouvement.
  carte.classList.remove("a-gauche", "a-droite", "masquee");
}); // Fin de la préparation des cartes.
// roue-active applique la grille et la perspective définies dans le CSS.
piste.classList.add("roue-active");
// À l'angle zéro, le premier projet est de face. On affiche cette position avant tout clic.
dessinerRoue(0);
