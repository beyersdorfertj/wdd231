// Membership Form Validation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('membership-form');
    const submitBtn = document.getElementById('submit-btn');
    const timestampField = document.getElementById('timestamp');
    const existingMemberInfo = document.getElementById('existing-member-info');

    // Check if user already has a membership application
    const existingMembership = localStorage.getItem('membershipApplication');
    if (existingMembership) {
        const memberData = JSON.parse(existingMembership);

        // Show existing member info
        existingMemberInfo.style.display = 'block';
        document.getElementById('existing-member-name').textContent = memberData.firstName;
        document.getElementById('member-email').textContent = memberData.email;

        // Format date
        const appDate = new Date(memberData.timestamp);
        document.getElementById('application-date').textContent = appDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Hide the form
        form.style.display = 'none';
        return; // Exit early, don't set up form validation
    }

    // Set timestamp on load
    timestampField.value = new Date().toISOString();

    // Get all required fields
    const requiredFields = form.querySelectorAll('[required]');

    // Validate form function
    function validateForm() {
        let isValid = true;

        requiredFields.forEach(field => {
            if (field.type === 'checkbox') {
                if (!field.checked) {
                    isValid = false;
                }
            } else if (field.tagName === 'SELECT') {
                if (!field.value || field.value === '') {
                    isValid = false;
                }
            } else {
                if (!field.value.trim()) {
                    isValid = false;
                }
            }

            // Check pattern validity for fields with pattern attribute
            if (field.hasAttribute('pattern') && field.value.trim()) {
                if (!field.validity.valid) {
                    isValid = false;
                }
            }
        });

        // Enable or disable submit button
        submitBtn.disabled = !isValid;
    }

    // Add input event listeners to all required fields
    requiredFields.forEach(field => {
        field.addEventListener('input', validateForm);
        field.addEventListener('change', validateForm);
    });

    // Form submit handler
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        // Update timestamp before submission
        const timestamp = new Date().toISOString();
        timestampField.value = timestamp;

        // Collect form data
        const formData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postal-code').value,
            experience: document.getElementById('experience').value,
            certifications: document.getElementById('certifications').value,
            emergencyName: document.getElementById('emergency-name').value,
            emergencyPhone: document.getElementById('emergency-phone').value,
            emergencyRelation: document.getElementById('emergency-relation').value,
            medicalConditions: document.getElementById('medical-conditions').value,
            medications: document.getElementById('medications').value,
            termsAccepted: document.getElementById('terms').checked,
            timestamp: timestamp
        };

        // Save to localStorage
        localStorage.setItem('membershipApplication', JSON.stringify(formData));
        console.log('Membership saved to localStorage');

        // Show thank you dialog
        const dialog = document.getElementById('thankyou-dialog');
        const memberNameSpan = document.getElementById('member-name');
        memberNameSpan.textContent = `, ${formData.firstName}`;
        dialog.showModal();

        // Setup close button handler
        const closeBtn = document.getElementById('close-thankyou');
        closeBtn.onclick = () => {
            dialog.close();
            window.location.href = 'index.html';
        };
    });

    // Initial validation check
    validateForm();
});
