const ham_btn = document.querySelector('#ham-btn');
const navBar_nav = document.querySelector('#nav-bar');

ham_btn.addEventListener('click', () => {
    ham_btn.classList.toggle('show');
    navBar_nav.classList.toggle('show');
    
    if (ham_btn.classList.contains('show')) {
        ham_btn.title = 'Close navigation menu';
    } else {
        ham_btn.title = 'Open navigation menu';
    }
});

// Set initial title
ham_btn.title = 'Open navigation menu';