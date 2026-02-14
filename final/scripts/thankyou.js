// Thank You Page - Display Registration Confirmation using URLSearchParams

import upcomingTours from '../data/upcoming-tours.mjs';

// Get URL parameters
const params = new URLSearchParams(window.location.search);

// Display confirmation details
function displayConfirmation() {
    // Get basic info from URL params
    const email = params.get('email');
    const firstName = params.get('firstName');
    const lastName = params.get('lastName');
    const participants = params.get('participants');
    const selectedLegs = params.get('selectedLegs');
    const bookingRef = params.get('reference');

    // Display email and reference
    document.getElementById('confirm-email').textContent = email || 'your email';
    document.getElementById('confirm-reference').textContent = bookingRef || 'N/A';

    // Build booking details HTML
    let detailsHTML = '';

    // Check if user is a member
    const membershipData = localStorage.getItem('membershipApplication');
    const isMember = membershipData !== null;

    if (selectedLegs && selectedLegs.length > 0) {
        // Multiple legs booked
        const legIds = selectedLegs.split(',').map(id => parseInt(id));
        const selectedTours = upcomingTours.filter(t => legIds.includes(t.id));

        if (selectedTours.length > 0) {
            // Calculate total price
            const totalPrice = selectedTours.reduce((sum, tour) => {
                const priceMatch = tour.price.match(/[\d,]+/);
                if (priceMatch) {
                    return sum + parseFloat(priceMatch[0].replace(/,/g, ''));
                }
                return sum;
            }, 0);

            // Calculate discounts
            const discountPercent = legIds.length === 2 ? 8 : 10;
            const discountAmount = totalPrice * (discountPercent / 100);
            let finalPrice = totalPrice - discountAmount;

            let discountHTML = `
                <div class="price-line discount">
                    <span>Series discount (${discountPercent}%):</span>
                    <span>-€${discountAmount.toFixed(2)}</span>
                </div>`;

            if (isMember) {
                const memberDiscount = (totalPrice - discountAmount) * 0.3;
                finalPrice = finalPrice * 0.7;
                discountHTML += `
                    <div class="price-line discount">
                        <span>Member discount (30%):</span>
                        <span>-€${memberDiscount.toFixed(2)}</span>
                    </div>`;
            }

            detailsHTML = `
                <div class="booking-summary">
                    <h3>Booking Summary</h3>
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Participants:</strong> ${participants}</p>
                    <p><strong>Selected Tours:</strong></p>
                    <ul>
                        ${selectedTours.map(t => `<li>${t.seriesName} - Leg ${t.leg}: ${t.destination} (${t.date})</li>`).join('')}
                    </ul>
                </div>
                <div class="price-breakdown">
                    <h5>Price Breakdown</h5>
                    <div class="price-line">
                        <span>Selected ${legIds.length} legs:</span>
                        <span>€${totalPrice.toFixed(2)}</span>
                    </div>
                    ${discountHTML}
                    <div class="price-line total">
                        <strong>Total Price:</strong>
                        <strong>€${finalPrice.toFixed(2)}</strong>
                    </div>
                </div>
            `;
        }
    } else {
        // Single tour booking
        const tourId = params.get('tourId');
        const tour = upcomingTours.find(t => t.id === tourId);

        if (tour) {
            const priceMatch = tour.price.match(/[\d,]+/);
            if (priceMatch) {
                const originalPrice = parseFloat(priceMatch[0].replace(/,/g, ''));
                let finalPrice = originalPrice;
                let priceBreakdownHTML = '';

                if (isMember) {
                    finalPrice = originalPrice * 0.7;
                    const discount = originalPrice * 0.3;

                    priceBreakdownHTML = `
                        <div class="price-breakdown">
                            <h5>Price Breakdown</h5>
                            <div class="price-line">
                                <span>Tour price:</span>
                                <span>€${originalPrice.toFixed(2)}</span>
                            </div>
                            <div class="price-line discount">
                                <span>Member discount (30%):</span>
                                <span>-€${discount.toFixed(2)}</span>
                            </div>
                            <div class="price-line total">
                                <strong>Total Price:</strong>
                                <strong>€${finalPrice.toFixed(2)}</strong>
                            </div>
                        </div>
                    `;
                } else {
                    priceBreakdownHTML = `
                        <div class="price-breakdown">
                            <h5>Price Breakdown</h5>
                            <div class="price-line total">
                                <strong>Total Price:</strong>
                                <strong>€${finalPrice.toFixed(2)}</strong>
                            </div>
                        </div>
                    `;
                }

                const tourTitle = tour.isPartOfSeries ? `${tour.seriesName} - Leg ${tour.leg}` : tour.title;

                detailsHTML = `
                    <div class="booking-summary">
                        <h3>Booking Summary</h3>
                        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                        <p><strong>Participants:</strong> ${participants}</p>
                        <p><strong>Tour:</strong> ${tourTitle}</p>
                        <p><strong>Destination:</strong> ${tour.destination}</p>
                        <p><strong>Date:</strong> ${tour.date}</p>
                        <p><strong>Duration:</strong> ${tour.duration}</p>
                    </div>
                    ${priceBreakdownHTML}
                `;
            }
        }
    }

    document.getElementById('booking-details').innerHTML = detailsHTML;
}

// Initialize
displayConfirmation();
