// Burger Menu
const burger = document.querySelector('.burger');
const navLinksContainer = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links a');

burger.addEventListener('click', () => {
  navLinksContainer.classList.toggle('nav-active');
  burger.classList.toggle('toggle');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('nav-active');
    burger.classList.remove('toggle');
  });
});
