// ========================================
// SERVICE D'ENVOI D'EMAILS - Solution Serveur Local
// ========================================

/**
 * Solution 1: Utilisation de l'API mailto (simple mais limité)
 * Ouvre le client email par défaut avec les informations pré-remplies
 */
function sendEmailViaMailto(booking) {
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
Clément - Les mains de Clem
contact@zenreunion.re
+262 692 12 34 56`
    );

    const emailLink = `mailto:${booking.client.email}?subject=${subject}&body=${body}`;
    window.open(emailLink, '_blank');
    
    return { success: true, method: 'mailto' };
}

/**
 * Solution 2: Utilisation de PHP avec fetch (nécessite un serveur web)
 * Envoie les données à un script PHP qui envoie l'email
 */
async function sendEmailViaPHP(booking) {
    try {
        const response = await fetch('/send-email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to_email: booking.client.email,
                to_name: `${booking.client.prenom} ${booking.client.nom}`,
                service_name: booking.serviceName,
                booking_date: formatFrenchDate(booking.date),
                booking_time: booking.time,
                booking_duration: `${booking.duration} minutes`,
                booking_price: `${booking.price}€`,
                booking_address: booking.client.adresse,
                booking_phone: booking.client.telephone,
                booking_message: booking.client.message || 'Aucun message particulier',
                booking_id: booking.id
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Email envoyé via PHP');
            return { success: true, method: 'php' };
        } else {
            console.error('❌ Erreur PHP:', result.error);
            return { success: false, error: result.error, method: 'php' };
        }
    } catch (error) {
        console.error('❌ Erreur réseau PHP:', error);
        return { success: false, error: error.message, method: 'php' };
    }
}

/**
 * Solution 3: Utilisation de Node.js/Express (serveur local)
 * Envoie les données à un serveur Node.js local
 */
async function sendEmailViaNodeJS(booking) {
    try {
        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to_email: booking.client.email,
                to_name: `${booking.client.prenom} ${booking.client.nom}`,
                service_name: booking.serviceName,
                booking_date: formatFrenchDate(booking.date),
                booking_time: booking.time,
                booking_duration: `${booking.duration} minutes`,
                booking_price: `${booking.price}€`,
                booking_address: booking.client.adresse,
                booking_phone: booking.client.telephone,
                booking_message: booking.client.message || 'Aucun message particulier',
                booking_id: booking.id
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Email envoyé via Node.js');
            return { success: true, method: 'nodejs' };
        } else {
            console.error('❌ Erreur Node.js:', result.error);
            return { success: false, error: result.error, method: 'nodejs' };
        }
    } catch (error) {
        console.error('❌ Erreur réseau Node.js:', error);
        return { success: false, error: error.message, method: 'nodejs' };
    }
}

/**
 * Solution 4: Utilisation de Google Apps Script (gratuit avec Gmail)
 * Envoie les données à un script Google Apps Script
 */
async function sendEmailViaGoogleAppsScript(booking) {
    try {
        const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
        
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to_email: booking.client.email,
                to_name: `${booking.client.prenom} ${booking.client.nom}`,
                service_name: booking.serviceName,
                booking_date: formatFrenchDate(booking.date),
                booking_time: booking.time,
                booking_duration: `${booking.duration} minutes`,
                booking_price: `${booking.price}€`,
                booking_address: booking.client.adresse,
                booking_phone: booking.client.telephone,
                booking_message: booking.client.message || 'Aucun message particulier',
                booking_id: booking.id
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Email envoyé via Google Apps Script');
            return { success: true, method: 'google-apps-script' };
        } else {
            console.error('❌ Erreur Google Apps Script:', result.error);
            return { success: false, error: result.error, method: 'google-apps-script' };
        }
    } catch (error) {
        console.error('❌ Erreur réseau Google Apps Script:', error);
        return { success: false, error: error.message, method: 'google-apps-script' };
    }
}

/**
 * Solution principale : simulation d'envoi d'email pour les tests
 */
async function sendAutomaticEmail(booking) {
    console.log('📧 Simulation d\'envoi d\'email...');
    
    // Simuler un délai d'envoi d'email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Afficher les détails dans la console
    console.log('📧 Email simulé envoyé à:', booking.client.email);
    console.log('📋 Détails de la réservation:', {
        service: booking.serviceName,
        date: formatFrenchDate(booking.date),
        time: booking.time,
        client: `${booking.client.prenom} ${booking.client.nom}`,
        prix: `${booking.price}€`,
        adresse: booking.client.adresse
    });
    
    // Simuler un envoi réussi
    return { 
        success: true, 
        method: 'simulation',
        message: 'Email simulé envoyé avec succès'
    };
}

/**
 * Formate une date au format français
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

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendAutomaticEmail,
        sendEmailViaMailto,
        sendEmailViaPHP,
        sendEmailViaNodeJS,
        sendEmailViaGoogleAppsScript
    };
}
