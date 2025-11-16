(function () {
  // === REGEX pour validation ===
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const frenchPhoneRe = /^(?:(?:\+33|0)\s?[1-9])(?:[\s.\-]?\d{2}){4}$/;

  function showError(input, message) {
    const errorElem = document.getElementById(input.id + 'Error');
    if (errorElem) {
      errorElem.textContent = message;
      errorElem.classList.remove('hidden');
    }
    input.classList.add('border-red-500');
  }

  function clearError(input) {
    const errorElem = document.getElementById(input.id + 'Error');
    if (errorElem) errorElem.classList.add('hidden');
    input.classList.remove('border-red-500');
  }

  function validate() {
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const telephone = document.getElementById('telephone');
    const message = document.getElementById('message');
    const honeypot = document.getElementById('website'); // champ caché anti-bot

    // Si honeypot rempli => bot
    if (honeypot && honeypot.value.trim() !== "") return false;

    clearError(name);
    if (name.value.trim() === "") { showError(name, "Veuillez entrer votre nom."); isValid = false; }

    clearError(email);
    if (!emailRe.test(email.value.trim())) { showError(email, "Adresse email invalide."); isValid = false; }

    clearError(telephone);
    if (!frenchPhoneRe.test(telephone.value.trim())) { showError(telephone, "Numéro invalide (ex: 06 12 34 56 78 ou +33 6 ...)"); isValid = false; }

    clearError(message);
    if (message.value.trim() === "") { showError(message, "Veuillez écrire un message."); isValid = false; }

    return isValid;
  }

  // === GESTION DU FORMULAIRE ===
  document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (!validate()) return;

    // --- CONFIGURATION WEB APP ---
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxW_B3oPqM76Op7jsEZqKV5_TZTC0K0BdzoHUb83i3-ipD0pF3VUFW2Ygy-C-Rg6irCHw/exec?key=Aba!78Nada-2025v"; 
    // <-- Remplace XXXXXXXXXXXXXXXX par ton URL Web App
    const SECRET_KEY = "Aba!78Nada-2025v"; // <-- Ta clé secrète

    const payload = {
      key: SECRET_KEY,
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      telephone: document.getElementById('telephone').value.trim(),
      message: document.getElementById('message').value.trim(),
      source: "Site WebKreativ"
    };

    // --- ENVOI POST ---
    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors", // permet d'envoyer depuis site statique GitHub Pages
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(() => {
      // Redirection vers page merci
      window.location.href = "https://abenabbes.github.io/webkreativ/merci.html";
    })
    .catch((err) => {
      console.error(err);
      alert("Échec de l'envoi, veuillez réessayer.");
    });
  });
})();
