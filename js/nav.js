const bouton = document.querySelector(".burger-menu");
const menu = document.querySelector("#menu");

bouton.addEventListener("click", function () {
  if (menu.getAttribute("data-visible") === "false") {
    console.log(menu.getAttribute("data-visible"));
    menu.setAttribute("data-visible", "true")
    bouton.setAttribute("aria-expanded", "true")
  }
  else {
    console.log(menu.getAttribute("data-visible"));
    menu.setAttribute("data-visible", "false")
    bouton.setAttribute("aria-expanded", "false")
  }
});

// On récupère les flèches, le compteur et les cartes du carrousel.
const boutonGauche = document.querySelector(".command-left");
const boutonDroit = document.querySelector(".command-right");
const compteur = document.querySelector(".commands p");
const piste = document.querySelector(".projects");
const cartes = Array.from(piste.querySelectorAll(".article-project"));

// Les angles sont en radians. 2 × π correspond à un tour complet.
const tourComplet = Math.PI * 2;
const angleEntreCartes = tourComplet / cartes.length;
const dureeRotation = 520;
const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)");
let indiceCentral = 0;
let rotationEnCours = false;
const directionsEnAttente = [];

function dessinerRoue(rotation) {
  cartes.forEach(function (carte, indice) {
    // Chaque carte a sa place sur la roue. On soustrait la même rotation
    // à toutes les cartes pour qu'elles avancent ensemble.
    const angle = indice * angleEntreCartes - rotation;
    const positionLaterale = Math.sin(angle);
    const profondeur = Math.cos(angle);

    // Le sinus donne la position gauche/droite en largeur de carte.
    // Le cosinus place la carte à l'avant (0 rem) ou à l'arrière (-16 rem).
    // On limite l'inclinaison pour laisser les faces latérales visibles.
    const x = positionLaterale * 105;
    const z = (profondeur - 1) * 8;
    const inclinaison = positionLaterale * 30;
    carte.style.transform = `translate3d(${x}%, 0, ${z}rem) rotateY(${inclinaison}deg)`;

    // Les cartes restent opaques à l'avant et s'effacent en passant derrière.
    // L'ordre des couches garde les cartes proches devant les cartes éloignées.
    const recul = Math.max(0, -profondeur);
    const opacite = 1 - recul ** 2;
    carte.style.opacity = opacite;
    carte.style.visibility = opacite === 0 ? "hidden" : "visible";
    carte.style.zIndex = Math.round((profondeur + 1) * 100);
  });
}

function actualiserProjetCentral() {
  // Le compteur et la classe centrale suivent la carte arrivée de face.
  cartes.forEach(function (carte, indice) {
    carte.classList.toggle("central", indice === indiceCentral);
  });
  compteur.textContent = `${indiceCentral + 1}/${cartes.length}`;
}

function lancerRotation() {
  // Les clics rapides attendent leur tour pour éviter les sauts de position.
  if (rotationEnCours || directionsEnAttente.length === 0) return;

  rotationEnCours = true;
  const direction = directionsEnAttente.shift();
  const angleDepart = indiceCentral * angleEntreCartes;
  const angleParcouru = direction * angleEntreCartes;
  let instantDepart;

  function animer(instant) {
    // Le navigateur appelle cette fonction avant chaque nouvelle image.
    // La progression va de 0 à 1 et sert à calculer un seul angle commun.
    instantDepart ??= instant;
    const progression = mouvementReduit.matches
      ? 1
      : Math.min((instant - instantDepart) / dureeRotation, 1);
    const progressionAdoucie = (1 - Math.cos(progression * Math.PI)) / 2;
    dessinerRoue(angleDepart + angleParcouru * progressionAdoucie);

    if (progression < 1) {
      requestAnimationFrame(animer);
      return;
    }

    // Le modulo permet de revenir du dernier projet au premier et inversement.
    indiceCentral = (indiceCentral + direction + cartes.length) % cartes.length;
    actualiserProjetCentral();
    rotationEnCours = false;
    lancerRotation();
  }

  requestAnimationFrame(animer);
}

// Droite : la carte de droite avance au centre. Gauche : mouvement inverse.
boutonDroit.addEventListener("click", function () {
  directionsEnAttente.push(1);
  lancerRotation();
});

boutonGauche.addEventListener("click", function () {
  directionsEnAttente.push(-1);
  lancerRotation();
});

// On met les quatre cartes sur la roue, y compris celle qui part à l'arrière.
cartes.forEach(function (carte) {
  carte.classList.remove("a-gauche", "a-droite", "masquee");
});
piste.classList.add("roue-active");
dessinerRoue(0);
