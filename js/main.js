/**
 * Frugal Tee Website JavaScript
 * Handles form validation, submissions, and interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initContactForm();
    initScrollAnimations();
    initSmoothScrolling();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Handle active nav link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Mobile menu close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

/**
 * Contact form functionality
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous validation states
        clearFormValidation();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        showLoadingState(true);
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await simulateFormSubmission();
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showErrorMessage('Sorry, there was an error submitting your form. Please try again.');
        } finally {
            showLoadingState(false);
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

/**
 * Form validation functions
 */
function validateForm() {
    const requiredFields = document.querySelectorAll('#contactForm [required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone format if provided
    const phoneField = document.getElementById('phone');
    if (phoneField.value && !isValidPhone(phoneField.value)) {
        showFieldError(phoneField, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    // Field-specific validation
    switch (field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'tel':
            if (value && !isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
    }
    
    // Minimum length validation for message
    if (field.id === 'message' && value.length < 10) {
        showFieldError(field, 'Please provide more details (minimum 10 characters)');
        return false;
    }
    
    // If we get here, field is valid
    showFieldSuccess(field);
    return true;
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = message;
    }
}

function showFieldSuccess(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = '';
    }
}

function clearFormValidation() {
    const fields = document.querySelectorAll('#contactForm .form-control, #contactForm .form-select');
    fields.forEach(field => {
        field.classList.remove('is-invalid', 'is-valid');
    });
    
    const feedbacks = document.querySelectorAll('#contactForm .invalid-feedback');
    feedbacks.forEach(feedback => {
        feedback.textContent = '';
    });
}

function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace(' *', '') : field.name;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Form submission handling
 */
async function simulateFormSubmission() {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Always succeed for demo purposes
            resolve();
        }, 1500);
    });
}

function showLoadingState(loading) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('i').nextSibling;
    
    if (loading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        btnText.textContent = ' Sending...';
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        btnText.textContent = ' Send Message';
    }
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    const form = document.getElementById('contactForm');
    
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide success message after 10 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 10000);
}

function showErrorMessage(message) {
    // Create error alert if it doesn't exist
    let errorAlert = document.getElementById('errorMessage');
    if (!errorAlert) {
        errorAlert = document.createElement('div');
        errorAlert.id = 'errorMessage';
        errorAlert.className = 'alert alert-danger mt-4';
        errorAlert.innerHTML = `
            <h5><i class="fas fa-exclamation-triangle me-2"></i>Error</h5>
            <p class="mb-0" id="errorText"></p>
        `;
        
        const form = document.getElementById('contactForm');
        form.parentNode.appendChild(errorAlert);
    }
    
    document.getElementById('errorText').textContent = message;
    errorAlert.style.display = 'block';
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide error message after 8 seconds
    setTimeout(() => {
        errorAlert.style.display = 'none';
    }, 8000);
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const targetPosition = target.offsetTop - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll animations
 */
function initScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.feature-card, .service-card, .hero-content, .contact-form-wrapper'
    );
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Add CSS for animations
    if (!document.querySelector('#scroll-animations-css')) {
        const style = document.createElement('style');
        style.id = 'scroll-animations-css';
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            @media (prefers-reduced-motion: reduce) {
                .animate-on-scroll {
                    opacity: 1;
                    transform: none;
                    transition: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Utility functions
 */

// Debounce function to limit rapid function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add throttled scroll event listener for better performance
window.addEventListener('scroll', throttle(() => {
    // Handle any scroll-based functionality here
}, 100));

/**
 * Analytics and tracking (placeholder)
 * Replace with actual analytics implementation
 */
function trackEvent(eventName, properties = {}) {
    // Example: Google Analytics 4
    // gtag('event', eventName, properties);
    
    // Example: Facebook Pixel
    // fbq('track', eventName, properties);
    
    // For now, just log to console
    console.log('Event tracked:', eventName, properties);
}

// Track form interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary, .btn-outline-dark')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_location: getElementLocation(e.target)
        });
    }
});

function getElementLocation(element) {
    // Determine which section the element is in
    const sections = ['home', 'about', 'services', 'contact'];
    for (let section of sections) {
        const sectionEl = document.getElementById(section);
        if (sectionEl && sectionEl.contains(element)) {
            return section;
        }
    }
    return 'unknown';
}

/**
 * Error handling and logging
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

/**
 * Performance monitoring
 */
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
            
            // Track page load performance
            trackEvent('page_performance', {
                load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)
            });
        }, 0);
    });
}
