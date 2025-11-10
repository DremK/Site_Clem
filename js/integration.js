// ========================================
// INTÉGRATION - Fonctions pour lier les sections
// ========================================

/**
 * Fonction appelée par les boutons "Réserver" de la section Nos Massages
 * Fait défiler vers la section réservation et présélectionne le service
 */
function scrollToBooking(serviceId) {
    // Activer le bouton de service correspondant
    const serviceButtons = document.querySelectorAll('.service-btn');
    serviceButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-service') === serviceId) {
            btn.classList.add('active');
        }
    });

    // Présélectionner le service dans l'input hidden
    const serviceSelect = document.getElementById('service-select');
    if (serviceSelect) {
        serviceSelect.value = serviceId;

        // Déclencher l'événement change pour mettre à jour l'affichage
        const event = new Event('change');
        serviceSelect.dispatchEvent(event);
    }

    // Scroll vers la section réservation
    const reservationSection = document.getElementById('reservation');
    if (reservationSection) {
        const offset = 80; // Hauteur de la navbar
        const targetPosition = reservationSection.offsetTop - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Fermer la modal de confirmation
 */
function closeBookingModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ========================================
// EVENT LISTENERS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Gestion du bouton de fermeture de la modal
    const btnModalClose = document.getElementById('btn-modal-close');
    if (btnModalClose) {
        btnModalClose.addEventListener('click', () => {
            closeBookingModal();

            // Scroll vers le haut de la page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Fermer la modal en cliquant en dehors
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'confirmation-modal') {
                closeBookingModal();
            }
        });
    }

    // Gestion du bouton Hero "Réserver ma séance"
    const heroBookingBtn = document.querySelector('.hero-content .btn-primary');
    if (heroBookingBtn) {
        heroBookingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('reservation').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
});

console.log('📝 Intégration chargée : sections massages et réservation liées');
