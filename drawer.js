function toggleDrawer() {
    const drawer = document.getElementById('infoDrawer');
    drawer.classList.toggle('open');
    const arrow = drawer.querySelector('.drawer-arrow');
    arrow.textContent = drawer.classList.contains('open') ? '▼' : '▲';
}
