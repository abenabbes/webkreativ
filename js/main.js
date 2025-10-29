// -------------------------------
// Navigation data
// -------------------------------
const menuItems = [
  { id: 1, label: "Accueil", href: "#accueil" },
  { id: 2, label: "Services", href: "#services" },
  { id: 3, label: "Réalisations", href: "#realisations" },
  { id: 4, label: "À propos", href: "#apropos" },
  { id: 5, label: "Contact", href: "#contact" }
];

// -------------------------------
// Mobile menu toggle
// -------------------------------
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenu.classList.toggle('hidden');
}

// -------------------------------
// Smooth scroll functions
// -------------------------------
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

// -------------------------------
// Scroll animations
// -------------------------------
function initScrollAnimations() {
  const elements = document.querySelectorAll('.scroll-animate');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// -------------------------------
// Init on DOM loaded
// -------------------------------
document.addEventListener('DOMContentLoaded', function () {

  // Smooth scroll for all anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Scroll animations
  initScrollAnimations();

  // Close mobile menu when clicking a link
  document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.add('hidden');
    });
  });

  // -------------------------------
  // Service Worker Registration
  // -------------------------------
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./js/service-worker.js')
      .then(reg => {
        console.log('✅ Service Worker enregistré :', reg.scope);

        // Vérifie s'il y a une mise à jour
        reg.onupdatefound = () => {
          const newWorker = reg.installing;
          newWorker.onstatechange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔁 Nouvelle version du site détectée, mise à jour en cours...');
              newWorker.postMessage({ action: 'skipWaiting' });
            }
          };
        };
      })
      .catch(err => console.error('❌ Erreur SW :', err));

    // Recharge la page quand un nouveau SW prend le contrôle
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }
});
