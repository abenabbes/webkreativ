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

// Smooth scroll
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Scroll animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(el => observer.observe(el));
}

// ✅ Form handling with redirect
function handleFormSubmit(event) {
    event.preventDefault();

    // Si tu utilises EmailJS, décommente ce bloc :
    /*
    emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', event.target)
        .then(() => {
            window.location.href = 'merci.html';
        })
        .catch((error) => {
            console.error('Erreur EmailJS :', error);
            alert("Erreur lors de l'envoi du message.");
        });
    */

    // Si tu n’utilises pas EmailJS pour l’instant :
    setTimeout(() => {
        window.location.href = 'merci.html';
    }, 500);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Scroll animations
    initScrollAnimations();

    // Handle form submission
    const contactForm = document.querySelector('form');
    if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);

    // Close mobile menu on link click
    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.add('hidden');
        });
    });
});
