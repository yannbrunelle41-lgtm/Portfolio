// Code JavaScript réalisé par Codex.

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

const piste = document.querySelector(".projects");
if (piste) {
  const boutonGauche = document.querySelector(".command-left");
  const boutonDroit = document.querySelector(".command-right");
  const compteur = document.querySelector(".commands p");
  const cartes = Array.from(piste.querySelectorAll(".article-project"));

  const tourComplet = Math.PI * 2;
  const angleEntreCartes = tourComplet / cartes.length;
  const dureeRotation = 520;
  const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)");
  let indiceCentral = 0;
  let rotationEnCours = false;
  const directionsEnAttente = [];

  function dessinerRoue(rotation) {
    cartes.forEach(function (carte, indice) {
      const angle = indice * angleEntreCartes - rotation;
      const positionLaterale = Math.sin(angle);
      const profondeur = Math.cos(angle);

      carte.style.setProperty("--position-roue", positionLaterale);
      carte.style.setProperty("--recul-roue", profondeur - 1);

      const recul = Math.max(0, -profondeur);
      const opacite = 1 - recul ** 2;
      carte.style.opacity = opacite;
      carte.style.visibility = opacite === 0 ? "hidden" : "visible";
      carte.style.zIndex = Math.round((profondeur + 1) * 100);
    });
  }

  function actualiserProjetCentral() {
    cartes.forEach(function (carte, indice) {
      carte.classList.toggle("central", indice === indiceCentral);
    });
    compteur.textContent = `${indiceCentral + 1}/${cartes.length}`;
  }

  function lancerRotation() {
    if (rotationEnCours || directionsEnAttente.length === 0) return;

    rotationEnCours = true;
    const direction = directionsEnAttente.shift();
    const angleDepart = indiceCentral * angleEntreCartes;
    const angleParcouru = direction * angleEntreCartes;
    let instantDepart;

    function animer(instant) {
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

      indiceCentral = (indiceCentral + direction + cartes.length) % cartes.length;
      actualiserProjetCentral();
      rotationEnCours = false;
      lancerRotation();
    }

    requestAnimationFrame(animer);
  }

  boutonDroit.addEventListener("click", function () {
    directionsEnAttente.push(1);
    lancerRotation();
  });

  boutonGauche.addEventListener("click", function () {
    directionsEnAttente.push(-1);
    lancerRotation();
  });

  cartes.forEach(function (carte) {
    carte.classList.remove("a-gauche", "a-droite", "masquee");
  });
  piste.classList.add("roue-active");
  dessinerRoue(0);
}
