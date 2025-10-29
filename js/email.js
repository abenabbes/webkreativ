document.addEventListener("DOMContentLoaded", function () {
  emailjs.init({ publicKey: "xFNikoKE7n7chXIgE" });

  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  const msg = document.getElementById('formMessage');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Vérif anti-bot
      if (document.getElementById('bot-field').value) return;

      btn.disabled = true;
      btn.textContent = 'Envoi en cours...';
      msg.classList.add('hidden');

      emailjs.sendForm('service_s8xelha', 'template_pfxbnlb', this)
        .then(() => {
          window.location.href = 'https://abenabbes.github.io/webkreativ/merci.html';
        })
        .catch((error) => {
          msg.textContent = "❌ Une erreur est survenue. Réessayez plus tard.";
          msg.classList.remove('hidden');
          btn.disabled = false;
          btn.textContent = 'Envoyer le message';
          console.error(error);
        });
    });
  }
});
