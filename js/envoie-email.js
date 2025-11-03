// ./js/email.js (version robuste)
(function () {
  function waitForEmailJs(timeout = 5000) {
    return new Promise((resolve, reject) => {
      const interval = 50;
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

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      await waitForEmailJs(5000); // attends jusqu'à 5s
      // Si tu as initialisé dans le HTML (recommandé), tu peux commenter l'init ici
      if (!emailjs._inited) {
        try { emailjs.init('xFNikoKE7n7chXIgE'); } catch(e){/* noop */ }
      }

      const form = document.getElementById('contactForm');
      if (!form) return console.warn('Formulaire de contact introuvable');

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitBtn = form.querySelector("button[type='submit']");
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Envoi en cours..."; }

        try {
          await emailjs.sendForm('service_9w7ytnw', 'template_itmi7ql', form);
          console.log('✅ E-mail envoyé avec succès !');
          window.location.href = "https://abenabbes.github.io/webkreativ/merci.html";
        } catch (err) {
          console.error('❌ Erreur d\'envoi :', err);
          alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Envoyer le message"; }
        }
      });
    } catch (err) {
      console.error(err);
      const submitBtn = document.querySelector("#contactForm button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Envoi indisponible (problème technique)";
      }
    }
  });
})();
