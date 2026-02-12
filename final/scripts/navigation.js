// Toggle navigation menu for mobile
const hamBtn = document.getElementById('ham-btn');
const navBar = document.getElementById('nav-bar');

hamBtn?.addEventListener('click', () => {
    hamBtn.classList.toggle('show');
    navBar.classList.toggle('show');
});

// Update footer with current year and last modified date
document.querySelector("#currentYear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = `Last Modification: ${document.lastModified}`;
