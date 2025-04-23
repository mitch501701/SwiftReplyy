// Swift Reply - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const modal = document.getElementById('signup-modal');
    const modalClose = document.getElementById('modal-close');
    const getStartedBtn = document.querySelector('.btn-primary');
    const joinWaitlistBtns = document.querySelectorAll('a[href="#signup"]');
    const modalForm = document.getElementById('modal-form');
    const successMessage = document.getElementById('success-message');
    const adminLink = document.querySelector('.admin-link');
    
    // Show modal when "Get Started" button is clicked
    getStartedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });
    
    // Show modal when any "Join Waitlist" button is clicked
    joinWaitlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });
    
    // Close modal when close button is clicked
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Handle form submission
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
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
            
            // Save the data
            saveToDatabase(formData)
                .then(() => {
                    // Show success message with animation
                    modalForm.style.display = 'none';
                    successMessage.classList.remove('hidden');
                    successMessage.classList.add('fade-in');
                    
                    // Reset form
                    modalForm.reset();
                    
                    // Close modal after delay
                    setTimeout(() => {
                        closeModal();
                        // Reset modal for next open
                        setTimeout(() => {
                            modalForm.style.display = 'block';
                            successMessage.classList.add('hidden');
                            successMessage.classList.remove('fade-in');
                        }, 500);
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error saving data:', error);
                    alert('There was an error submitting your information. Please try again.');
                });
        });
    }
    
    // Make sure Admin link goes to admin.html
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'admin.html';
        });
    }
    
    // Helper functions
    function openModal() {
        modal.style.display = 'flex';
        // Use setTimeout to ensure the transition happens after display change
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    function closeModal() {
        modal.classList.remove('show');
        // Wait for transition to complete before hiding
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    function validateForm(formData) {
        // Validate name
        if (!formData.name || formData.name.trim() === '') {
            alert('Please enter your name.');
            return false;
        }
        
        // Validate email
        if (!formData.email || !isValidEmail(formData.email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        
        return true;
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Save to database (using localStorage for demo)
    function saveToDatabase(formData) {
        return new Promise((resolve, reject) => {
            try {
                // Get existing data
                const existingData = JSON.parse(localStorage.getItem('swiftReplyWaitlist') || '[]');
                
                // Check for duplicate email
                const isDuplicate = existingData.some(entry => entry.email === formData.email);
                if (isDuplicate) {
                    alert('This email is already registered.');
                    reject(new Error('Duplicate email'));
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
    
    // Ensure pricing cards are visible on all devices
    const pricingGrid = document.querySelector('.pricing-grid');
    if (pricingGrid) {
        // Force redraw of pricing grid to ensure all cards are visible
        pricingGrid.style.display = 'none';
        setTimeout(() => {
            pricingGrid.style.display = 'grid';
        }, 0);
    }
});

