let hamburger = document.querySelector(".hamburger");
let hamburgerIcon = document.querySelector(".hamburger i");
let navItems = document.querySelector(".nav-items")


hamburger?.addEventListener("click", () => {
    hamburgerIcon.classList.toggle("fa-xmark");
    hamburgerIcon.classList.toggle("fa-bars");
    navItems.classList.toggle("active");
});

