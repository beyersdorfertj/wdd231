// Membership data variable
let membershipData = {};

// Load membership data from JSON
async function loadMembershipData() {
    try {
        const response = await fetch('data/membership.json');
        membershipData = await response.json();
        createMembershipCards();
    } catch (error) {
        console.error('Error loading membership data:', error);
    }
}

// Create membership cards dynamically
function createMembershipCards() {
    const container = document.getElementById('cards-container');
    if (!container) return;

    Object.keys(membershipData).forEach(level => {
        const data = membershipData[level];
        const card = document.createElement('div');
        card.className = 'membership-card';
        card.setAttribute('data-level', level);
        
        card.innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.description}</p>
            <a href="#" class="learn-more" data-level="${level}">Learn More</a>
        `;
        
        container.appendChild(card);
    });
}

// Highlight selected membership card
function highlightMembershipCard(selectedLevel) {
    const cards = document.querySelectorAll('.membership-card');
    cards.forEach(card => {
        if (card.getAttribute('data-level') === selectedLevel) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

// Validate form and enable/disable submit button
function validateForm() {
    const form = document.querySelector('form');
    const submitBtn = document.getElementById('submit-btn');
    if (!form || !submitBtn) return;

    const requiredFields = form.querySelectorAll('[required]');
    let allValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            allValid = false;
        }
    });

    submitBtn.disabled = !allValid;
}

// Set timestamp when form loads
document.addEventListener('DOMContentLoaded', () => {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    // Validate form on input
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('input', validateForm);
        form.addEventListener('change', validateForm);
        validateForm(); // Initial check
    }

    // Load membership data and create cards
    loadMembershipData();

    // Listen for membership level selection changes
    const membershipSelect = document.getElementById('membership');
    if (membershipSelect) {
        membershipSelect.addEventListener('change', (e) => {
            const selectedLevel = e.target.value;
            if (selectedLevel) {
                highlightMembershipCard(selectedLevel);
            } else {
                // Remove all highlights if no selection
                document.querySelectorAll('.membership-card').forEach(card => {
                    card.classList.remove('selected');
                });
            }
        });
    }

    // Handle membership modal dialog
    const modal = document.getElementById('membership-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalBenefits = document.getElementById('modal-benefits');
    const closeButton = document.querySelector('.close-modal');

    // Add event listeners to dynamically created links
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('learn-more')) {
            e.preventDefault();
            const level = e.target.getAttribute('data-level');
            const data = membershipData[level];
            
            if (data && modal) {
                // Update modal content
                modalTitle.textContent = data.title;
                modalPrice.textContent = data.price;
                modalBenefits.innerHTML = '';
                data.benefits.forEach(benefit => {
                    const li = document.createElement('li');
                    li.textContent = benefit;
                    modalBenefits.appendChild(li);
                });
                
                modal.showModal();
            }
        }
    });

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (modal) {
                modal.close();
            }
        });
    }

    // Close modal when clicking outside of it
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.close();
            }
        });
    }
});
