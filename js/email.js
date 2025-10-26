// Initialiser EmailJS avec votre Public Key
document.addEventListener("DOMContentLoaded", function () {
    emailjs.init({
        publicKey: "308KNvDrpU6XfF-Ky",
    });

    // Gérer l'envoi du formulaire
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Empêche le comportement par défaut

            emailjs.sendForm('service_s8xelha', 'template_pfxbnlb', this)
                .then(function () {
                    console.log('E-mail envoyé avec succès !');
                    // Redirection après succès
                    window.location.href = 'https://abenabbes.github.io/portfolio/remerciment.html';
                }, function (error) {
                    console.error('Échec de l\'envoi...', error);
                    alert("Une erreur est survenue lors de l'envoi.");
                });
        });
    }
});
