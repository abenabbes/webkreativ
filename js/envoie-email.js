(function () {
  // Initialisation EmailJS
  emailjs.init('xFNikoKE7n7chXIgE'); // Clé publique

  // Regex pour validation
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const frenchPhoneRe = /^(?:(?:\+33|0)\s?[1-9])(?:[\s.\-]?\d{2}){4}$/;

  function showError(input, message) {
    let errorElem = document.getElementById(input.id + 'Error');
    if (errorElem) {
      errorElem.textContent = message;
      errorElem.classList.remove('hidden');
    }
    input.classList.add('border-red-500');
  }

  function clearError(input) {
    let errorElem = document.getElementById(input.id + 'Error');
    if (errorElem) errorElem.classList.add('hidden');
    input.classList.remove('border-red-500');
  }

  function validate() {
    let isValid = true;

    // Récupération des champs
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let telephone = document.getElementById('telephone');
    let message = document.getElementById('message');

    // Nom
    clearError(name);
    if (name.value.trim() === "") {
      showError(name, "Veuillez entrer votre nom.");
      isValid = false;
    }

    // Email
    clearError(email);
    if (!emailRe.test(email.value.trim())) {
      showError(email, "Adresse email invalide.");
      isValid = false;
    }

    // Téléphone
    clearError(telephone);
    if (!frenchPhoneRe.test(telephone.value.trim())) {
      showError(telephone, "Numéro invalide (ex: 06 12 34 56 78 ou +33 6 ...)");
      isValid = false;
    }

    // Message
    clearError(message);
    if (message.value.trim() === "") {
      showError(message, "Veuillez écrire un message.");
      isValid = false;
    }

    return isValid;
  }

  // Gestion du formulaire
  document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    if (!validate()) {
      return; // Stop si erreurs
    }

    // Envoi EmailJS
    emailjs.sendForm('service_9w7ytnw', 'template_itmi7ql', this)
      .then(() => {
        window.location.href = 'https://abenabbes.github.io/webkreativ/merci.html';
      })
      .catch(() => {
        alert('Échec de l\'envoi, veuillez réessayer.');
      });
  });
})();
