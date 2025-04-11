function initMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
  
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }
  
  document.addEventListener('astro:after-swap', () => {
    initMenu();
  });
  
  initMenu();
  