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

// Add video link after last modified date
const videoLink = document.createElement('a');
videoLink.href = 'https://www.loom.com/share/574119239c4b48baa5c25f19faeab2f8';
videoLink.textContent = '🎥 Watch Project Video';
videoLink.target = '_blank';
videoLink.style.display = 'block';
videoLink.style.marginTop = '0.75rem';
videoLink.style.marginLeft = 'auto';
videoLink.style.marginRight = 'auto';
videoLink.style.width = 'fit-content';
videoLink.style.padding = '0.5rem 1rem';
videoLink.style.backgroundColor = 'var(--secondary-color)';
videoLink.style.color = 'white';
videoLink.style.textDecoration = 'none';
videoLink.style.borderRadius = '6px';
videoLink.style.fontWeight = '600';
videoLink.style.transition = 'background-color 0.3s';
videoLink.addEventListener('mouseenter', () => {
    videoLink.style.backgroundColor = 'var(--secondary-dark)';
});
videoLink.addEventListener('mouseleave', () => {
    videoLink.style.backgroundColor = 'var(--secondary-color)';
});
document.querySelector("#lastModified").appendChild(videoLink);
