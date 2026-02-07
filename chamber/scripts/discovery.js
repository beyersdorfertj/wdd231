import discoveryItems from '../data/discovery.mjs';

// Get the container
const cardsContainer = document.querySelector('#discovery-cards');

// Create modal elements
const modal = document.createElement('dialog');
modal.id = 'discovery-modal';
document.body.appendChild(modal);

// Function to show modal with item details
function showModal(item) {
    modal.innerHTML = `
        <button class="close-btn" aria-label="Close">&times;</button>
        <h2>${item.name}</h2>
        <figure>
            <img src="${item.image2}" alt="${item.name}" loading="lazy">
        </figure>
        <address>${item.address}</address>
        <p class="full-description">${item.fullDescription}</p>
        <p class="contact"><strong>Contact:</strong> ${item.contact}</p>
    `;
    
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => modal.close());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.close();
        }
    });
    
    modal.showModal();
}

// Function to create a card for each item
function createCard(item) {
    const card = document.createElement('div');
    card.classList.add('discovery-card');
    
    const img = document.createElement('img');
    img.src = item.image1;
    img.alt = item.name;
    img.width = 300;
    img.height = 200;
    img.loading = 'lazy';
    
    const title = document.createElement('h2');
    title.textContent = item.name;
    
    const address = document.createElement('address');
    address.textContent = item.address;
    
    const description = document.createElement('p');
    description.textContent = item.shortDescription;
    
    const button = document.createElement('button');
    button.textContent = 'Learn More';
    button.addEventListener('click', () => {
        showModal(item);
    });
    
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(address);
    card.appendChild(description);
    card.appendChild(button);
    
    return card;
}

// Display all items
function displayItems() {
    if (!cardsContainer) return;
    
    cardsContainer.innerHTML = '';
    discoveryItems.forEach(item => {
        const card = createCard(item);
        cardsContainer.appendChild(card);
    });
}

// Function to display visit message
function displayVisitMessage() {
    const visitMessageElement = document.getElementById('visit-message');
    if (!visitMessageElement) return;
    
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    
    if (!lastVisit) {
        // First visit
        visitMessageElement.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const lastVisitDate = parseInt(lastVisit);
        const timeDiff = now - lastVisitDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 1) {
            // Less than a day
            visitMessageElement.textContent = "Back so soon! Awesome!";
        } else if (daysDiff === 1) {
            // Exactly one day
            visitMessageElement.textContent = "You last visited 1 day ago.";
        } else {
            // More than one day
            visitMessageElement.textContent = `You last visited ${daysDiff} days ago.`;
        }
    }
    
    // Store current visit
    localStorage.setItem('lastVisit', now.toString());
}

// Initialize
displayItems();
displayVisitMessage();
