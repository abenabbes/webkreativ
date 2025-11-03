(function () {
  emailjs.init('xFNikoKE7n7chXIgE'); // Remplace par ta clé publique EmailJS
})();

document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();

  emailjs.sendForm('service_9w7ytnw', 'template_itmi7ql', this)
    .then(function(response) {
      window.location.href = 'https://abenabbes.github.io/webkreativ/merci.html';
    }, function(error) {
      alert('Echec de l\'envoi, réessayez.');
    });
});
