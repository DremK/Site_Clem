// ========================================
// SERVICE D'ENVOI D'EMAILS - EmailJS
// ========================================

// Configuration EmailJS
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_zen_reunion', // À remplacer par votre service ID EmailJS
    TEMPLATE_ID: 'template_booking_confirmation', // À remplacer par votre template ID
    PUBLIC_KEY: 'your_public_key_here' // À remplacer par votre clé publique
};

/**
 * Initialise EmailJS avec la clé publique
 */
function initEmailJS() {
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS non chargé, chargement du script...');
        loadEmailJSScript();
        return;
    }
    
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('📧 EmailJS initialisé');
}

/**
 * Charge le script EmailJS si non présent
 */
function loadEmailJSScript() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('📧 EmailJS chargé et initialisé');
    };
    document.head.appendChild(script);
}

/**
 * Envoie un email de confirmation de réservation
 * @param {Object} booking - Les données de la réservation
 * @returns {Promise} - Promesse de l'envoi d'email
 */
async function sendBookingConfirmationEmail(booking) {
    try {
        // Vérifier qu'EmailJS est disponible
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS non disponible');
            throw new Error('Service email non disponible');
        }

        // Préparer les données pour le template
        const templateParams = {
            to_email: booking.client.email,
            to_name: `${booking.client.prenom} ${booking.client.nom}`,
            client_name: booking.client.prenom,
            service_name: booking.serviceName,
            booking_date: formatFrenchDate(booking.date),
            booking_time: booking.time,
            booking_duration: `${booking.duration} minutes`,
            booking_price: `${booking.price}€`,
            booking_address: booking.client.adresse,
            booking_phone: booking.client.telephone,
            booking_message: booking.client.message || 'Aucun message particulier',
            booking_id: booking.id,
            company_name: 'Zen Réunion',
            company_email: 'contact@zenreunion.re',
            company_phone: '+262 692 12 34 56'
        };

        console.log('📧 Envoi de l\'email de confirmation à:', booking.client.email);

        // Envoyer l'email via EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );

        console.log('✅ Email envoyé avec succès:', response);
        return { success: true, response };

    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
        return { 
            success: false, 
            error: error.message || 'Erreur inconnue lors de l\'envoi de l\'email'
        };
    }
}

/**
 * Envoie une notification au propriétaire du site
 * @param {Object} booking - Les données de la réservation
 */
async function sendOwnerNotification(booking) {
    try {
        const templateParams = {
            to_email: 'contact@zenreunion.re', // Email du propriétaire
            subject: `Nouvelle réservation - ${booking.serviceName}`,
            client_name: `${booking.client.prenom} ${booking.client.nom}`,
            client_email: booking.client.email,
            client_phone: booking.client.telephone,
            service_name: booking.serviceName,
            booking_date: formatFrenchDate(booking.date),
            booking_time: booking.time,
            booking_price: `${booking.price}€`,
            booking_address: booking.client.adresse,
            booking_message: booking.client.message || 'Aucun message particulier',
            booking_id: booking.id
        };

        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            'template_owner_notification', // Template pour le propriétaire
            templateParams
        );

        console.log('📧 Notification propriétaire envoyée');
        return { success: true, response };

    } catch (error) {
        console.error('❌ Erreur notification propriétaire:', error);
        return { success: false, error };
    }
}

/**
 * Formate une date au format français
 * @param {string} dateString - Date au format ISO
 * @returns {string} - Date formatée
 */
function formatFrenchDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Affiche le statut de l'envoi d'email dans la modal
 * @param {boolean} success - Succès de l'envoi
 * @param {string} email - Email du client
 */
function updateEmailStatusInModal(success, email) {
    const modalEmailElement = document.getElementById('modal-email');
    if (modalEmailElement) {
        if (success) {
            modalEmailElement.innerHTML = `
                <span style="color: #10b981;">${email}</span>
                <i class="fas fa-check-circle" style="color: #10b981; margin-left: 8px;"></i>
                <small style="display: block; color: #6b7280; margin-top: 4px;">
                    Email de confirmation envoyé avec succès
                </small>
            `;
        } else {
            modalEmailElement.innerHTML = `
                <span style="color: #ef4444;">${email}</span>
                <i class="fas fa-exclamation-triangle" style="color: #ef4444; margin-left: 8px;"></i>
                <small style="display: block; color: #6b7280; margin-top: 4px;">
                    L'email n'a pas pu être envoyé automatiquement
                </small>
            `;
        }
    }
}

/**
 * Version de secours : ouvre le client email avec le message pré-rempli
 * @param {Object} booking - Les données de la réservation
 */
function openFallbackEmail(booking) {
    const subject = encodeURIComponent(`[Zen Réunion] Confirmation de votre réservation #${booking.id}`);
    
    const body = encodeURIComponent(
`Bonjour ${booking.client.prenom},

Votre réservation a bien été enregistrée !

📅 Détails de votre réservation :
- Service : ${booking.serviceName}
- Date : ${formatFrenchDate(booking.date)}
- Heure : ${booking.time}
- Durée : ${booking.duration} minutes
- Prix : ${booking.price}€
- Adresse : ${booking.client.adresse}

Nous vous attendons à l'adresse indiquée.

Pour toute modification ou annulation, merci de nous contacter au plus tard 24h avant votre rendez-vous.

Cordialement,
L'équipe Zen Réunion
contact@zenreunion.re
+262 692 12 34 56`
    );

    const emailLink = `mailto:${booking.client.email}?subject=${subject}&body=${body}`;
    window.open(emailLink, '_blank');
}

// Initialiser EmailJS au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser EmailJS avec un léger délai pour s'assurer que le script est chargé
    setTimeout(initEmailJS, 1000);
});

console.log('📧 Service email chargé - EmailJS configuré');

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendBookingConfirmationEmail,
        sendOwnerNotification,
        updateEmailStatusInModal,
        openFallbackEmail
    };
}
