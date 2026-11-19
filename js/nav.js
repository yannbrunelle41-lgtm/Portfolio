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
  const carteCentrale = cartes[numeroProjetActuel - 1];
  const ancienneCarteCentrale = document.querySelector(".central");
  const masquerCarte = document.querySelector(".a-droite");
  const nouvelleCarteGauche = document.querySelector(".masquee");
  ancienneCarteCentrale.classList.remove("central");
  ancienneCarteCentrale.classList.add("a-droite");
  carteCentrale.classList.remove("a-gauche");
  carteCentrale.classList.add("central");
  masquerCarte.classList.remove("a-droite");
  nouvelleCarteGauche.classList.remove("masquee");
  nouvelleCarteGauche.classList.add("a-gauche");
  masquerCarte.classList.add("masquee");
});

boutonDroit.addEventListener("click", function () {
  numeroProjetActuel = numeroProjetActuel + 1;
  if (numeroProjetActuel === 5) {
    numeroProjetActuel = 1;
  } 
  compteur.textContent = numeroProjetActuel + "/4";
  const carteCentrale = cartes[numeroProjetActuel - 1];
  const ancienneCarteCentrale = document.querySelector(".central");
  const masquerCarte = document.querySelector(".a-gauche");
  const nouvelleCarteDroite = document.querySelector(".masquee");
  ancienneCarteCentrale.classList.remove("central");
  ancienneCarteCentrale.classList.add("a-gauche")
  carteCentrale.classList.remove("a-droite");
  carteCentrale.classList.add("central");
  masquerCarte.classList.remove("a-gauche");
  nouvelleCarteDroite.classList.remove("masquee");
  nouvelleCarteDroite.classList.add("a-droite");
  masquerCarte.classList.add("masquee");
});




