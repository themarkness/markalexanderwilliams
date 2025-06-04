if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const burgerButton = document.querySelector('.burger-button');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (burgerButton && mobileMenu) {
    burgerButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-active');
      burgerButton.classList.toggle('is-active');
    });
  }
});
