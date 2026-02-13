// Fleet Display and Boat Gallery Modal

import boats from '../data/boats.mjs';

// Create boat cards
function createBoatCard(boat) {
    const card = document.createElement('article');
    card.className = 'boat-card';

    card.innerHTML = `
        <img src="${boat.images[0].src}" alt="${boat.name} - ${boat.model}" 
             width="${boat.images[0].width}" height="${boat.images[0].height}" 
             class="boat-main-image">
        <div class="boat-header">
            <h3>${boat.name}</h3>
            <p class="boat-model">${boat.model}</p>
        </div>
        <div class="boat-specs">
            <div class="spec-item">
                <span class="spec-label">Year:</span>
                <span class="spec-value">${boat.year}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Length:</span>
                <span class="spec-value">${boat.length}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Beam:</span>
                <span class="spec-value">${boat.beam}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Draft:</span>
                <span class="spec-value">${boat.draft}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Cabins:</span>
                <span class="spec-value">${boat.cabins}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Berths:</span>
                <span class="spec-value">${boat.berths}</span>
            </div>
        </div>
        <div class="boat-description">
            <p>${boat.description}</p>
        </div>
        <div class="boat-features">
            <h4>Features:</h4>
            <ul>
                ${boat.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        <button class="view-gallery-btn" data-boat-id="${boat.id}">View Gallery (${boat.images.length} photos)</button>
    `;

    // Add event listener to gallery button
    const galleryBtn = card.querySelector('.view-gallery-btn');
    galleryBtn.addEventListener('click', () => showBoatGallery(boat));

    return card;
}

// Display all boats
function displayBoats() {
    const container = document.getElementById('fleet-container');
    if (!container) {
        console.error('Fleet container not found');
        return;
    }
    boats.forEach(boat => {
        container.appendChild(createBoatCard(boat));
    });
}

// Show boat gallery in modal
function showBoatGallery(boat) {
    const dialog = document.getElementById('boat-gallery-dialog');
    const mainImageContainer = document.getElementById('gallery-main-image');
    const thumbnailContainer = document.getElementById('gallery-thumbnails');
    const title = document.getElementById('gallery-boat-name');
    const prevBtn = document.getElementById('prev-image-btn');
    const nextBtn = document.getElementById('next-image-btn');

    title.textContent = `${boat.name} - ${boat.model}`;
    let currentIndex = 0;

    // Function to display image at specific index
    function showImage(index) {
        const img = boat.images[index];
        mainImageContainer.innerHTML = `
            <img src="${img.src}" alt="${boat.name} photo ${index + 1}"
                 width="${img.width}" height="${img.height}"
                 id="main-gallery-image">
        `;

        // Update active thumbnail
        thumbnailContainer.querySelectorAll('.thumbnail').forEach((t, i) => {
            t.classList.toggle('active', i === index);
        });

        currentIndex = index;
    }

    // Display first image as main image
    showImage(0);

    // Create thumbnail strip
    thumbnailContainer.innerHTML = '';
    boat.images.forEach((img, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
        thumbnail.innerHTML = `
            <img src="${img.src}" alt="${boat.name} thumbnail ${index + 1}"
                 width="${img.width}" height="${img.height}">
        `;

        // Click handler to change main image
        thumbnail.addEventListener('click', () => {
            showImage(index);
        });

        thumbnailContainer.appendChild(thumbnail);
    });

    // Navigation button handlers
    prevBtn.onclick = () => {
        const newIndex = (currentIndex - 1 + boat.images.length) % boat.images.length;
        showImage(newIndex);
    };

    nextBtn.onclick = () => {
        const newIndex = (currentIndex + 1) % boat.images.length;
        showImage(newIndex);
    };

    // Close button handler
    const closeBtn = document.getElementById('close-gallery-btn');
    closeBtn.onclick = () => {
        dialog.close();
    };

    // Close on backdrop click - register here so it works on all pages
    dialog.onclick = (e) => {
        if (e.target === dialog) {
            dialog.close();
        }
    };

    dialog.showModal();
}

// Close modal dialog
function closeGallery() {
    const dialog = document.getElementById('boat-gallery-dialog');
    dialog.close();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayBoats();

    // Close on backdrop click
    const dialog = document.getElementById('boat-gallery-dialog');
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            closeGallery();
        }
    });
});

// Export function for use from other pages
export { showBoatGallery };
