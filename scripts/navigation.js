const ham_btn = document.querySelector('#ham-btn');
const navBar_nav = document.querySelector('#nav-bar');

ham_btn.addEventListener('click', () => {
    ham_btn.classList.toggle('show');
    navBar_nav.classList.toggle('show');
});