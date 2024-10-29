function toggleMenu() {
  const submenuFabs = document.querySelectorAll('.submenu-fab');
  submenuFabs.forEach(fab => {
    fab.classList.toggle('active');
  });
}
