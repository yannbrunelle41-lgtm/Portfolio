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