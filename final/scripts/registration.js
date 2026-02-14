// Display Upcoming Sailing Tours as Table

import upcomingTours from '../data/upcoming-tours.mjs';
import boats from '../data/boats.mjs';
import { showBoatGallery } from './fleet.js';

// Load booked spots from localStorage
function getBookedSpots() {
    const stored = localStorage.getItem('bookedSpots');
    return stored ? JSON.parse(stored) : {};
}

// Save booked spots to localStorage
function saveBookedSpots(tourId, participants) {
    const bookedSpots = getBookedSpots();
    bookedSpots[tourId] = (bookedSpots[tourId] || 0) + participants;
    localStorage.setItem('bookedSpots', JSON.stringify(bookedSpots));
}

// Get available spots for a tour
function getAvailableSpots(tour) {
    const bookedSpots = getBookedSpots();
    const booked = bookedSpots[tour.id] || 0;
    return tour.availableSpots - booked;
}

function createToursTable() {
    const table = document.createElement('table');
    table.className = 'tours-table';

    // Create table header
    table.innerHTML = `
        <thead>
            <tr>
                <th>Tour</th>
                <th>Date</th>
                <th>Details</th>
                <th>Difficulty</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody id="tours-tbody">
        </tbody>
    `;

    return table;
}

function createTourRow(tour) {
    const row = document.createElement('tr');

    // Get available spots (accounting for local bookings)
    const availableSpots = getAvailableSpots(tour);
    const isFull = availableSpots <= 0;

    // Build tour title - for series tours, show only series badge and leg info
    let tourTitleHtml = '';
    if (tour.isPartOfSeries) {
        tourTitleHtml = `
            <div class="series-badge">
                <span class="series-name">${tour.seriesName}</span>
                <span class="leg-info">Leg ${tour.leg}/${tour.totalLegs}</span>
            </div>
        `;
    } else {
        tourTitleHtml = `
            <div class="series-badge">
                <span class="series-name tour-single-name">${tour.title}</span>
            </div>
        `;
    }

    // Determine difficulty class
    const difficultyClass = tour.difficulty.toLowerCase().replace(' ', '-');

    // Determine availability status
    let availabilityClass = 'spots-available';
    let availabilityText = `${availableSpots} of ${tour.maxParticipants} spots`;

    if (isFull) {
        availabilityClass = 'spots-full';
        availabilityText = 'Fully booked';
    } else if (tour.availableSpots <= 2) {
        availabilityClass = 'spots-limited';
        availabilityText = `Only ${tour.availableSpots} left!`;
    }

    row.innerHTML = `
        <td data-label="Tour">
            ${tourTitleHtml}
            <div class="tour-destination">${tour.destination}</div>
            <div class="tour-route">${tour.route}</div>
            <div class="tour-date-inline">
                <strong>${tour.date}</strong> (${tour.duration})
            </div>
        </td>
        <td data-label="Date">
            <div>${tour.date}</div>
            <div style="font-size: 0.85rem; color: #666; margin-top: 0.25rem;">${tour.duration}</div>
        </td>
        <td data-label="Details">
            <div class="tour-details">
                <button class="boat-btn" data-boat-name="${tour.boat}">${tour.boat}</button><br>
                <strong>Skipper:</strong> ${tour.skipper}
                ${tour.isPartOfSeries ? `<br><strong style="color: var(--accent-color);">${tour.seriesDiscount}</strong>` : ''}
            </div>
            <div class="tour-info-combined">
                <div class="tour-info-item">
                    <label>Difficulty</label>
                    <span class="difficulty difficulty-${difficultyClass}">${tour.difficulty}</span>
                </div>
                <div class="tour-info-item">
                    <label>Price</label>
                    <div class="tour-price">${tour.price}</div>
                </div>
                <div class="tour-info-item">
                    <label>Availability</label>
                    <span class="${availabilityClass}">${availabilityText}</span>
                </div>
                <div class="tour-info-item">
                    <button class="register-btn" data-tour-id="${tour.id}" ${isFull ? 'disabled' : ''}>
                        ${isFull ? 'Full' : 'Register'}
                    </button>
                </div>
            </div>
        </td>
        <td data-label="Difficulty">
            <span class="difficulty difficulty-${difficultyClass}">${tour.difficulty}</span>
        </td>
        <td data-label="Price">
            <div class="tour-price">${tour.price}</div>
        </td>
        <td data-label="Availability">
            <span class="${availabilityClass}">${availabilityText}</span>
        </td>
        <td data-label="Action">
            <button class="register-btn" data-tour-id="${tour.id}" ${isFull ? 'disabled' : ''}>
                ${isFull ? 'Full' : 'Register'}
            </button>
        </td>
    `;

    // Add event listener to register buttons (for both layouts)
    const registerBtns = row.querySelectorAll('.register-btn');
    registerBtns.forEach(btn => {
        btn.addEventListener('click', () => handleRegistration(tour));
    });

    // Add event listener to boat button
    const boatBtn = row.querySelector('.boat-btn');
    if (boatBtn) {
        boatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const boatName = e.target.dataset.boatName;
            // Find boat by matching name in boat string
            const boat = boats.find(b => boatName.includes(b.name));
            if (boat) {
                showBoatGallery(boat);
            }
        });
    }
    registerBtns.forEach(btn => {
        if (tour.availableSpots > 0) {
            btn.addEventListener('click', () => handleRegistration(tour));
        }
    });

    return row;
}

function handleRegistration(tour) {
    // Store selected tour in localStorage
    localStorage.setItem('selectedTour', JSON.stringify(tour));

    // Show registration form
    showRegistrationForm(tour);
}

function showRegistrationForm(tour) {
    const dialog = document.getElementById('registration-form-dialog');
    const form = document.getElementById('trip-registration-form');
    const tourTitle = document.getElementById('form-tour-title');
    const tourDetails = document.getElementById('form-tour-details');
    const seriesLegsSection = document.getElementById('series-legs-selection');

    // Set tour information
    tourTitle.textContent = tour.isPartOfSeries ? `${tour.seriesName} - Leg ${tour.leg}/${tour.totalLegs}` : tour.title;
    tourDetails.innerHTML = `
        <div class="tour-detail-item"><strong>Date:</strong> <span>${tour.date}</span></div>
        <div class="tour-detail-item"><strong>Duration:</strong> <span>${tour.duration}</span></div>
        <div class="tour-detail-item"><strong>Destination:</strong> <span>${tour.destination}</span></div>
        <div class="tour-detail-item"><strong>Price:</strong> <span id="tour-price-display">${tour.price}</span></div>
    `;

    // Set hidden tour ID
    document.getElementById('form-tour-id').value = tour.id;

    // Set max participants based on available spots
    const availableSpots = getAvailableSpots(tour);
    const participantsInput = document.getElementById('participants');
    participantsInput.max = availableSpots;
    participantsInput.value = Math.min(1, availableSpots);

    // Handle series tours
    if (tour.isPartOfSeries) {
        document.getElementById('form-series-name').value = tour.seriesName;
        seriesLegsSection.style.display = 'block';

        // Show discount info
        const discountText = tour.totalLegs === 2
            ? 'Book both legs and save 8%!'
            : 'Book 2 legs and save 8%, or all 3 legs and save 10%!';
        document.getElementById('series-discount-text').textContent = discountText;

        // Find all legs of this series
        const seriesLegs = upcomingTours.filter(t =>
            t.isPartOfSeries && t.seriesName === tour.seriesName
        ).sort((a, b) => a.leg - b.leg);

        // Create checkboxes for each leg
        const legsContainer = document.getElementById('legs-checkboxes');
        legsContainer.innerHTML = '';

        seriesLegs.forEach(leg => {
            const checkbox = document.createElement('div');
            const availableSpots = getAvailableSpots(leg);
            const isFull = availableSpots <= 0;
            const isCurrentLeg = leg.id === tour.id;

            checkbox.className = isFull ? 'leg-checkbox leg-full' : 'leg-checkbox';
            checkbox.innerHTML = `
                <input type="checkbox" 
                       id="leg-${leg.id}" 
                       name="selectedLegs" 
                       value="${leg.id}" 
                       ${isCurrentLeg ? 'checked' : ''}
                       ${isFull ? 'disabled' : ''}>
                <label for="leg-${leg.id}">
                    <strong>Leg ${leg.leg}/${leg.totalLegs}:</strong> ${leg.destination}
                    ${isFull ? '<span class="full-badge">FULL</span>' : ''}
                    <br>
                    <span class="leg-details">${leg.date} - ${leg.price}</span>
                </label>
            `;
            legsContainer.appendChild(checkbox);
        });

        // Add event listeners for price calculation
        const checkboxes = legsContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                updatePriceSummary(seriesLegs, tour.totalLegs);
                updateMaxParticipants(seriesLegs);
            });
        });

        // Initial price calculation
        updatePriceSummary(seriesLegs, tour.totalLegs);
        updateMaxParticipants(seriesLegs);
    } else {
        seriesLegsSection.style.display = 'none';
    }

    // Reset form
    form.reset();

    // Show dialog
    dialog.showModal();

    // Validate form after showing to set initial button state
    setTimeout(() => validateForm(), 0);
}

function updatePriceSummary(seriesLegs, totalLegs) {
    const checkedBoxes = document.querySelectorAll('input[name="selectedLegs"]:checked');
    const selectedCount = checkedBoxes.length;
    const priceDisplay = document.getElementById('tour-price-display');

    if (selectedCount === 0) {
        // Show message to select at least one leg
        priceDisplay.textContent = 'Select legs below';
        priceDisplay.style.color = '#999';
        return;
    }

    // Calculate subtotal
    let subtotal = 0;
    checkedBoxes.forEach(cb => {
        // Convert checkbox value to number for comparison
        const selectedId = parseInt(cb.value);
        const leg = seriesLegs.find(l => l.id === selectedId);
        if (leg) {
            // Extract just the number from price string (e.g., "€750 per person" -> 750)
            const priceMatch = leg.price.match(/[\d,]+/);
            if (priceMatch) {
                const price = parseFloat(priceMatch[0].replace(/,/g, ''));
                subtotal += price;
            }
        }
    });

    // Calculate discount
    let discountPercent = 0;
    if (selectedCount >= 2) {
        discountPercent = selectedCount === 2 ? 8 : 10;
    }

    // Check if user is a member for additional 30% discount
    const membershipData = localStorage.getItem('membershipApplication');
    const isMember = membershipData !== null;

    // Apply series discount first
    let discountedPrice = subtotal * (1 - discountPercent / 100);

    // Then apply member discount on top
    if (isMember) {
        discountedPrice = discountedPrice * 0.7; // 30% off
    }

    const total = discountedPrice;

    // Update price display
    priceDisplay.style.color = '';
    if (discountPercent > 0 || isMember) {
        let discountInfo = '';
        if (discountPercent > 0 && isMember) {
            discountInfo = `<small>(-${discountPercent}% series, -30% member)</small>`;
        } else if (discountPercent > 0) {
            discountInfo = `<small>(-${discountPercent}%)</small>`;
        } else if (isMember) {
            discountInfo = `<small>(-30% member)</small>`;
        }
        priceDisplay.innerHTML = `<span style="text-decoration: line-through; color: #999;">€${subtotal.toFixed(2)}</span> <span style="color: var(--accent-color); font-weight: bold;">€${total.toFixed(2)}</span> ${discountInfo}`;
    } else {
        priceDisplay.textContent = `€${total.toFixed(2)}`;
    }
}

function updateMaxParticipants(seriesLegs) {
    const checkedBoxes = document.querySelectorAll('input[name="selectedLegs"]:checked');
    const participantsInput = document.getElementById('participants');

    if (checkedBoxes.length === 0) {
        participantsInput.max = 1;
        participantsInput.value = 1;
        return;
    }

    // Find minimum available spots across all selected legs
    let minAvailableSpots = Infinity;
    checkedBoxes.forEach(cb => {
        const selectedId = parseInt(cb.value);
        const leg = seriesLegs.find(l => l.id === selectedId);
        if (leg) {
            const availableSpots = getAvailableSpots(leg);
            minAvailableSpots = Math.min(minAvailableSpots, availableSpots);
        }
    });

    // Set max to minimum available spots
    participantsInput.max = minAvailableSpots;
    // Adjust current value if it exceeds the new max
    if (parseInt(participantsInput.value) > minAvailableSpots) {
        participantsInput.value = minAvailableSpots;
    }
}

function displayTours() {
    const container = document.getElementById('upcoming-tours');

    // Clear existing content
    container.innerHTML = '';

    if (upcomingTours.length === 0) {
        container.innerHTML = '<p class="no-tours">No upcoming tours available at this time. Please check back later!</p>';
        return;
    }

    const table = createToursTable();
    container.appendChild(table);

    const tbody = document.getElementById('tours-tbody');
    upcomingTours.forEach(tour => {
        tbody.appendChild(createTourRow(tour));
    });
}

// Generate booking reference number
function generateBookingReference() {
    const year = new Date().getFullYear();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars like I, O, 0, 1
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `REF-${year}-${randomPart}`;
}

// Initialize
displayTours();

// Validate form and enable/disable submit button
function validateForm() {
    const submitBtn = document.querySelector('.submit-btn');
    if (!form || !submitBtn) return;

    const requiredFields = form.querySelectorAll('[required]');
    const seriesLegsSection = document.getElementById('series-legs-selection');
    let allValid = true;

    // Check all required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            allValid = false;
        }
    });

    // For series tours, check if at least one leg is selected
    if (seriesLegsSection && seriesLegsSection.style.display !== 'none') {
        const selectedLegs = form.querySelectorAll('input[name="selectedLegs"]:checked');
        if (selectedLegs.length === 0) {
            allValid = false;
        }
    }

    submitBtn.disabled = !allValid;
}

// Form event handlers
const form = document.getElementById('trip-registration-form');
const dialog = document.getElementById('registration-form-dialog');

// Add validation listeners
form.addEventListener('input', validateForm);
form.addEventListener('change', validateForm);

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Get selected legs for series tours
    const selectedLegs = Array.from(form.querySelectorAll('input[name="selectedLegs"]:checked'))
        .map(cb => cb.value);

    if (selectedLegs.length > 0) {
        data.selectedLegs = selectedLegs.join(',');
    }

    // Generate booking reference
    const bookingRef = generateBookingReference();
    data.reference = bookingRef;

    // Update available spots in localStorage
    const participants = parseInt(data.participants) || 1;
    if (selectedLegs.length > 0) {
        // Update spots for all selected legs
        selectedLegs.forEach(legId => {
            saveBookedSpots(legId, participants);
        });
    } else {
        // Update spots for single tour
        saveBookedSpots(data.tourId, participants);
    }

    // Build query string for navigation
    const queryParams = new URLSearchParams(data).toString();

    // Close dialog and navigate to thank you page
    dialog.close();
    window.location.href = `thankyou.html?${queryParams}`;
});

// Close button handler
const closeBtn = document.getElementById('close-form-btn');
closeBtn.onclick = () => {
    dialog.close();
};

// Close button for thank you dialog
const closeThankyouBtn = document.getElementById('close-thankyou-btn');
closeThankyouBtn.onclick = () => {
    document.getElementById('thank-you-dialog').close();
};

// Close on backdrop click
dialog.onclick = (e) => {
    if (e.target === dialog) {
        dialog.close();
    }
};

// Check if user is a member and update banner
function updateMemberBanner() {
    const membershipData = localStorage.getItem('membershipApplication');
    const banner = document.getElementById('member-discount-banner');

    if (membershipData && banner) {
        const member = JSON.parse(membershipData);
        banner.innerHTML = `
            <div class="banner-icon">✓</div>
            <div class="banner-content">
                <h3>Welcome, ${member.firstName}!</h3>
                <p>As a member, you receive a <strong>30% discount</strong> on all sailing tours.</p>
            </div>
        `;
        banner.classList.add('member-active');
    }
}

// Reset bookings by clicking on logo (hidden feature)
const logo = document.querySelector('header img');
if (logo) {
    logo.style.cursor = 'pointer';
    logo.title = 'Click to reset all bookings';
    logo.onclick = () => {
        if (confirm('Reset all bookings?\n\nThis will restore original availability for all tours.')) {
            localStorage.removeItem('bookedSpots');
            displayTours();
            alert('✓ All bookings have been reset.\nOriginal availability restored.');
        }
    };
}

// Initialize member banner
updateMemberBanner();
