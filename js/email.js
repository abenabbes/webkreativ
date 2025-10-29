// email.js
document.addEventListener("DOMContentLoaded", function () {
    // Initialisation EmailJS avec ta clé publique
    emailjs.init("xFNikoKE7n7chXIgE");

    const form = document.getElementById("contactForm");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            // Désactiver le bouton pendant l'envoi
            const submitBtn = form.querySelector("button[type='submit']");
            submitBtn.disabled = true;
            submitBtn.textContent = "Envoi en cours...";

             emailjs.sendForm('service_9w7ytnw', 'template_itmi7ql', this)
                .then(() => {
                    console.log("✅ E-mail envoyé avec succès !");
                    window.location.href = "https://abenabbes.github.io/webkreativ/merci.html";
                })
                .catch((error) => {
                    console.error("❌ Erreur d'envoi :", error);
                    alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Envoyer le message";
                });
        });
    }
});
