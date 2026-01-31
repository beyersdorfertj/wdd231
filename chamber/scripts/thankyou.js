// Extract and display form submission data from URL parameters
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const submissionDetails = document.getElementById('submission-details');

    // Define field labels for display
    const fieldLabels = {
        'first-name': 'First Name',
        'last-name': 'Last Name',
        'title': 'Title',
        'email': 'Email',
        'phone': 'Mobile Phone',
        'organization': 'Business/Organization Name',
        'membership': 'Membership Level',
        'description': 'Business Description',
        'timestamp': 'Submitted On'
    };

    // Format membership level for display
    const formatMembership = (level) => {
        const levels = {
            'np': 'Non-Profit',
            'bronze': 'Bronze',
            'silver': 'Silver',
            'gold': 'Gold'
        };
        return levels[level] || level;
    };

    // Format timestamp for display
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(parseInt(timestamp));
        return date.toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'short'
        });
    };

    // Create summary HTML
    let summaryHTML = '<dl class="details-list">';
    
    for (const [key, value] of urlParams) {
        if (key === 'timestamp') {
            summaryHTML += `
                <dt>${fieldLabels[key] || key}:</dt>
                <dd>${formatTimestamp(value)}</dd>
            `;
        } else if (key === 'membership') {
            summaryHTML += `
                <dt>${fieldLabels[key] || key}:</dt>
                <dd>${formatMembership(value)}</dd>
            `;
        } else if (key !== 'timestamp') {
            summaryHTML += `
                <dt>${fieldLabels[key] || key}:</dt>
                <dd>${value}</dd>
            `;
        }
    }
    
    summaryHTML += '</dl>';
    
    // Display the details or show a default message
    if (urlParams.toString()) {
        submissionDetails.innerHTML = summaryHTML;
    } else {
        submissionDetails.innerHTML = '<p class="no-data">No submission data available.</p>';
    }
});
