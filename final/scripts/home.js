// Home Page - Display upcoming tours and latest reports

import upcomingTours from '../data/upcoming-tours.mjs';

// Display next 3 upcoming tours
function displayUpcomingTours() {
    const container = document.getElementById('upcoming-tours-home');
    if (!container) return;

    // Group series tours and handle standalone tours
    const tourMap = new Map();

    upcomingTours.forEach(tour => {
        if (tour.isPartOfSeries && tour.seriesName) {
            // For series tours, only keep the first leg
            if (!tourMap.has(tour.seriesName)) {
                tourMap.set(tour.seriesName, tour);
            } else {
                // Update end date if this is a later leg
                const existing = tourMap.get(tour.seriesName);
                // Parse dates to get the latest end date
                const existingEndParts = existing.date.split('-')[1].trim().split(',')[0].trim().split(' ');
                const currentEndParts = tour.date.split('-')[1].trim().split(',')[0].trim().split(' ');
                // Just update to show this is multi-leg - we'll use the series info
                tourMap.set(tour.seriesName, { ...existing, lastLegDate: tour.date });
            }
        } else {
            // Standalone tours
            tourMap.set(tour.id, tour);
        }
    });

    // Get first 3 unique tours
    const displayTours = Array.from(tourMap.values()).slice(0, 3);

    if (displayTours.length === 0) {
        container.innerHTML = '<p>No tours available.</p>';
        return;
    }

    container.innerHTML = displayTours.map(tour => {
        // Check if it's a series tour
        const isSeries = tour.isPartOfSeries && tour.totalLegs > 1;

        let dateDisplay = tour.date;
        if (isSeries && tour.lastLegDate) {
            // Extract start date from first leg and end date from last leg
            const startDate = tour.date.split('-')[0].trim();
            const endDate = tour.lastLegDate.split('-')[1].trim();
            dateDisplay = `${startDate} - ${endDate}`;
        }

        return `
            <div class="tour-card">
                <h4>${isSeries ? tour.seriesName : tour.title}</h4>
                <p class="tour-date">${dateDisplay}</p>
                ${isSeries ? `<p class="tour-legs">${tour.totalLegs} Legs</p>` : ''}
            </div>
        `;
    }).join('');
}

// Display latest 3 reports
function displayLatestReports() {
    const container = document.getElementById('latest-reports');
    if (!container) return;

    // Group series tours from the end of the list
    const tourMap = new Map();
    const reversedTours = [...upcomingTours].reverse();

    reversedTours.forEach(tour => {
        if (tour.isPartOfSeries && tour.seriesName) {
            // For series tours, only keep if not already added
            if (!tourMap.has(tour.seriesName)) {
                tourMap.set(tour.seriesName, tour);
            }
        } else {
            // Standalone tours
            if (!tourMap.has(tour.id)) {
                tourMap.set(tour.id, tour);
            }
        }
    });

    // Get last 3 unique tours as reports
    const reports = Array.from(tourMap.values()).slice(0, 3);

    if (reports.length === 0) {
        container.innerHTML = '<p>Reports coming soon...</p>';
        return;
    }

    container.innerHTML = reports.map(tour => {
        const isSeries = tour.isPartOfSeries && tour.totalLegs > 1;

        return `
            <div class="report-card">
                <h4>${isSeries ? tour.seriesName : tour.title}</h4>
                <p class="report-date">${tour.date}</p>
                ${isSeries ? `<p class="report-legs">${tour.totalLegs} Legs</p>` : ''}
            </div>
        `;
    }).join('');
}

// Initialize
displayUpcomingTours();
displayLatestReports();
