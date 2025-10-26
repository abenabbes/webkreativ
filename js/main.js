// Navigation data
const menuItems = [
    { "id": 1, "label": "Accueil", "href": "#accueil" },
    { "id": 2, "label": "Services", "href": "#services" },
    { "id": 3, "label": "Réalisations", "href": "#realisations" },
    { "id": 4, "label": "À propos", "href": "#apropos" },
    { "id": 5, "label": "Contact", "href": "#contact" }
];

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}

// Smooth scroll functions
function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function scrollToRealisations() {
    document.getElementById('realisations').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Scroll animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Form handling
function handleFormSubmit(event) {
    event.preventDefault();
    alert('Merci pour votre message ! Je vous répondrai dans les plus brefs délais.');
    event.target.reset();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize scroll animations
    initScrollAnimations();

    // Add form submit handler
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.add('hidden');
        });
    });
});

// Handle navigation with JavaScript
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
    }
});