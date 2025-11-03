// ./js/envoie-email.js
// Script robuste pour envoyer le formulaire via EmailJS en utilisant emailjs-ready

(function () {
  const PUBLIC_KEY = 'xFNikoKE7n7chXIgE';
  const SERVICE_ID = 'service_9w7ytnw';
  const TEMPLATE_ID = 'template_itmi7ql';

  function setFormMessage(text, type = 'info') {
    const msg = document.getElementById('formMessage');
    if (!msg) return;
    msg.classList.remove('text-green-600', 'text-red-600', 'text-gray-600');
    if (type === 'success') msg.classList.add('text-green-600');
    else if (type === 'error') msg.classList.add('text-red-600');
    else msg.classList.add('text-gray-600');

    msg.textContent = text;
    msg.classList.remove('hidden');
  }

  function initForm() {
    // Initialiser EmailJS si nécessaire
    if (typeof emailjs !== 'undefined' && !emailjs._inited) {
      try { emailjs.init(PUBLIC_KEY); } catch (e) { console.warn('emailjs.init failed', e); }
      emailjs._inited = true;
    }

    const form = document.getElementById('contactForm');
    if (!form) {
      console.warn('Formulaire #contactForm introuvable');
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Envoi en cours...'; }
      setFormMessage('Envoi en cours...', 'info');

      try {
        const res = await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
        console.info('EmailJS sendForm result:', res);
        setFormMessage('Message envoyé. Redirection...', 'success');
        window.location.href = 'https://abenabbes.github.io/webkreativ/merci.html';
      } catch (err) {
        console.error('Erreur envoi EmailJS:', err);
        setFormMessage('Erreur lors de l’envoi. Veuillez réessayer.', 'error');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Envoyer le message'; }
      }
    });
  }

  // Écoute l'événement officiel EmailJS ready
  window.addEventListener('emailjs-ready', function() {
    initForm();
  });

  // Cas où EmailJS est déjà prêt
  if (typeof emailjs !== 'undefined' && emailjs._inited) {
    initForm();
  }

})();
