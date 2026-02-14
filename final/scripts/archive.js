// Display sailing trip reports

// Global variable to store trip reports
let tripReports = [];

// Async function to load trip reports from JSON with try/catch
async function loadTripReports() {
    try {
        const response = await fetch('data/trips.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        tripReports = data;

        // Display trips after data is loaded
        displayTrips();

    } catch (error) {
        console.error('Failed to load trip reports:', error);

        // Display error message to user
        const container = document.getElementById('trip-reports');
        if (container) {
            container.innerHTML = '<p style="color: #d32f2f; text-align: center; padding: 2rem;">Unable to load trip reports. Please try again later.</p>';
        }
    }
}

function createTripCard(trip) {
    const card = document.createElement('article');
    card.className = 'trip-card';

    card.innerHTML = `
        <img class="trip-image" src="${trip.images[0].src}" alt="${trip.title}" width="400" height="300" loading="lazy">
        <div class="trip-header">
            <h3>${trip.title}</h3>
            <p class="trip-date">${trip.date}</p>
        </div>
        <div class="trip-meta">
            <p><strong>Skipper:</strong> ${trip.skipper}</p>
            <p><strong>Sailing Area:</strong> ${trip.sailingArea}</p>
            <p><strong>Distance:</strong> ${trip.distance}</p>
            <p><strong>Duration:</strong> ${trip.duration}</p>
            <p><strong>Boat:</strong> ${trip.boat}</p>
        </div>
        <div class="trip-summary">
            <p>${trip.summary}</p>
        </div>
        <button class="read-more-btn" data-trip-id="${trip.id}">Read Full Report</button>
    `;

    const button = card.querySelector('.read-more-btn');
    button.addEventListener('click', () => showFullReport(trip));

    return card;
}

function showFullReport(trip) {
    const dialog = document.getElementById('trip-dialog');
    let currentSlide = 0;
    let slideInterval;

    dialog.innerHTML = `
        <button class="close-dialog" aria-label="Close dialog">×</button>
        <div class="dialog-slideshow">
            <div class="slideshow-container">
                ${trip.images.map((img, index) => `
                    <figure class="slide ${index === 0 ? 'active' : ''}">
                        <img src="${img.src}" alt="${trip.title}" width="${img.width}" height="${img.height}" loading="${index === 0 ? 'eager' : 'lazy'}">
                        <figcaption>${img.caption}</figcaption>
                    </figure>
                `).join('')}
            </div>
            <button class="slide-nav prev" aria-label="Previous image">‹</button>
            <button class="slide-nav next" aria-label="Next image">›</button>
            <div class="slide-indicators">
                ${trip.images.map((_, index) => `
                    <span class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>
                `).join('')}
            </div>
        </div>
        <h2>${trip.title}</h2>
        <div class="trip-full-report">
            ${trip.report.split('\n\n').map(para => `<p>${para.trim()}</p>`).join('')}
        </div>
    `;

    const closeBtn = dialog.querySelector('.close-dialog');
    const slides = dialog.querySelectorAll('.slide');
    const indicators = dialog.querySelectorAll('.indicator');
    const prevBtn = dialog.querySelector('.prev');
    const nextBtn = dialog.querySelector('.next');

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 3000);
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    prevBtn.addEventListener('click', () => {
        stopSlideshow();
        prevSlide();
        startSlideshow();
    });

    nextBtn.addEventListener('click', () => {
        stopSlideshow();
        nextSlide();
        startSlideshow();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopSlideshow();
            showSlide(index);
            startSlideshow();
        });
    });

    closeBtn.addEventListener('click', () => {
        stopSlideshow();
        dialog.close();
    });

    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            stopSlideshow();
            dialog.close();
        }
    });

    dialog.showModal();
    startSlideshow();
}

function displayTrips() {
    const container = document.getElementById('trip-reports');
    tripReports.forEach(trip => {
        container.appendChild(createTripCard(trip));
    });
}

// Initialize - load trip reports
loadTripReports();
