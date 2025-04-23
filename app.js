document.addEventListener('DOMContentLoaded', function() {
    // Form submission handling
    const waitlistForm = document.getElementById('waitlist-form');
    const successMessage = document.getElementById('success-message');
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                timestamp: new Date().toISOString()
            };
            
            // Validate form data
            if (!validateForm(formData)) {
                return;
            }
            
            // Save the data (will be replaced with actual API call)
            saveToDatabase(formData)
                .then(() => {
                    // Show success message with animation
                    waitlistForm.style.display = 'none';
                    successMessage.classList.remove('hidden');
                    successMessage.classList.add('fade-in');
                    
                    // Reset form
                    waitlistForm.reset();
                })
                .catch(error => {
                    console.error('Error saving data:', error);
                    alert('There was an error submitting your information. Please try again.');
                });
        });
    }
    
    // Add subtle hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .pricing-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('popular') 
                ? 'scale(1.05) translateY(-4px)' 
                : 'translateY(-4px)';
            this.style.boxShadow = 'var(--shadow-md)';
            this.style.borderColor = 'var(--color-primary-light)';
            this.style.transition = 'all 0.2s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('popular') 
                ? 'scale(1.05)' 
                : 'translateY(0)';
            this.style.boxShadow = '';
            this.style.borderColor = '';
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation
    function validateForm(formData) {
        let isValid = true;
        
        // Validate name
        if (!formData.name || formData.name.trim() === '') {
            showError('name', 'Please enter your name');
            isValid = false;
        } else {
            clearError('name');
        }
        
        // Validate email
        if (!formData.email || !isValidEmail(formData.email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError('email');
        }
        
        return isValid;
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`) || createErrorElement(fieldId);
        
        field.style.borderColor = 'var(--color-error)';
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        field.style.borderColor = '';
        
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    function createErrorElement(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.createElement('div');
        
        errorElement.id = `${fieldId}-error`;
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--color-error)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '4px';
        
        field.parentNode.appendChild(errorElement);
        
        return errorElement;
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Save to database (placeholder for actual API call)
    function saveToDatabase(formData) {
        return new Promise((resolve, reject) => {
            // In a real implementation, this would be an API call to the server
            // For now, we'll use localStorage as a simple demonstration
            try {
                // Get existing data
                const existingData = JSON.parse(localStorage.getItem('swiftReplyWaitlist') || '[]');
                
                // Check for duplicate email
                const isDuplicate = existingData.some(entry => entry.email === formData.email);
                if (isDuplicate) {
                    showError('email', 'This email is already registered');
                    reject(new Error('This email is already registered'));
                    return;
                }
                
                // Add new entry
                existingData.push(formData);
                
                // Save back to localStorage
                localStorage.setItem('swiftReplyWaitlist', JSON.stringify(existingData));
                
                // Simulate network delay
                setTimeout(() => {
                    resolve();
                }, 800);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // Ensure pricing cards are visible on all devices
    function ensurePricingCardsVisibility() {
        const pricingGrid = document.querySelector('.pricing-grid');
        if (pricingGrid) {
            // Force display of all pricing cards
            const pricingCards = pricingGrid.querySelectorAll('.pricing-card');
            pricingCards.forEach(card => {
                card.style.display = 'block';
            });
            
            // Log to console for debugging
            console.log('Pricing cards visibility enforced:', pricingCards.length, 'cards found');
        }
    }
    
    // Call this function to ensure pricing cards are visible
    ensurePricingCardsVisibility();
});
