// Toggle navigation menu for mobile
const hamBtn = document.getElementById('ham-btn');
const navBar = document.getElementById('nav-bar');

hamBtn?.addEventListener('click', () => {
    hamBtn.classList.toggle('show');
    navBar.classList.toggle('show');
});
