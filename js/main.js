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
// Helper : Affiche une notification de mise à jour
// -------------------------------
function showUpdateNotification() {
  const bar = document.createElement('div');
  bar.innerHTML = `
    🔁 Nouvelle version du site disponible.
    <button id="reloadBtn" style="
      margin-left:10px;
      background:#fff;
      color:#007BFF;
      border:none;
      padding:6px 10px;
      border-radius:4px;
      cursor:pointer;
      font-weight:bold;
    ">Recharger</button>
  `;
  Object.assign(bar.style, {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#007BFF',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'sans-serif',
  });

  document.body.appendChild(bar);

  document.getElementById('reloadBtn').addEventListener('click', () => {
    bar.remove();
    window.location.reload();
  });
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

  
}

);
