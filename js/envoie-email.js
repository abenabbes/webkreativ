// ./js/envoie-email.js
// Script robuste pour envoyer le formulaire via EmailJS

(function () {
  const PUBLIC_KEY = 'xFNikoKE7n7chXIgE'; // ta clé publique EmailJS
  const SERVICE_ID = 'service_9w7ytnw';
  const TEMPLATE_ID = 'template_itmi7ql';
  const INIT_TIMEOUT = 10000; // ms à attendre le SDK (10s)

  function waitForEmailJs(timeout = INIT_TIMEOUT) {
    return new Promise((resolve, reject) => {
      const interval = 100;
      let waited = 0;
      const id = setInterval(() => {
        if (typeof window.emailjs !== 'undefined') {
          clearInterval(id);
          resolve(window.emailjs);
        } else if ((waited += interval) >= timeout) {
          clearInterval(id);
          reject(new Error('EmailJS SDK introuvable (timeout)'));
        }
      }, interval);
    });
  }

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

  async function initAndBind() {
    try {
      await waitForEmailJs();

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

        // simple validation HTML5 s'assure des attributs required
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Envoi en cours...';
        }
        setFormMessage('Envoi en cours...', 'info');

        try {
          // sendForm envoie directement le <form>
          const res = await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
          console.info('EmailJS sendForm result:', res);
          setFormMessage('Message envoyé. Redirection...', 'success');
          // redirection vers merci (tu peux changer l'URL si besoin)
          window.location.href = 'https://abenabbes.github.io/webkreativ/merci.html';
        } catch (err) {
          console.error('Erreur envoi EmailJS:', err);
          setFormMessage('Erreur lors de l’envoi. Veuillez réessayer.', 'error');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer le message';
          }
        }
      });
    } catch (err) {
      console.error(err);
      const submitBtn = document.querySelector('#contactForm button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi indisponible';
      }
      setFormMessage('Envoi indisponible (problème de chargement du SDK).', 'error');
    }
  }

  // Démarrer après DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAndBind);
  } else {
    initAndBind();
  }
})();
