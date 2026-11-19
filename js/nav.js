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

const boutonGauche = document.querySelector(".command-left");
const boutonDroit = document.querySelector(".command-right");
const compteur = document.querySelector(".commands p")
const cartes = document.querySelectorAll(".article-project")
let numeroProjetActuel = 1;

boutonGauche.addEventListener("click", function () {
  numeroProjetActuel = numeroProjetActuel - 1;
  if (numeroProjetActuel === 0) {
    numeroProjetActuel = 4;
  }
  compteur.textContent = numeroProjetActuel + "/4";
});

boutonDroit.addEventListener("click", function () {
  numeroProjetActuel = numeroProjetActuel + 1;
  if (numeroProjetActuel === 5) {
    numeroProjetActuel = 1;
  }
  console.log(numeroProjetActuel)   
  compteur.textContent = numeroProjetActuel + "/4";
  const carteCentrale = cartes[numeroProjetActuel - 1];
});




