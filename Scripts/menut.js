
document.addEventListener("DOMContentLoaded", function() {
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav ul');

menuToggle.addEventListener('click', function() {
  nav.classList.toggle('active');
});

// Ocultar el menú al hacer clic fuera de él
document.addEventListener('click', function(event) {
  const isClickInsideNav = nav.contains(event.target);
  const isClickOnMenuToggle = menuToggle.contains(event.target);

  if (!isClickInsideNav && !isClickOnMenuToggle) {
      nav.classList.remove('active');
  }
});
});

