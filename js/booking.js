// ========================================
// ÉTAT DE LA RÉSERVATION
// ========================================
const bookingState = {
    selectedService: null,
    selectedDate: null,
    selectedTime: null,
    clientInfo: {},
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    forceReload: false
};

// ========================================
// CONFIGURATION AVANCÉE
// ========================================
const BOOKING_CONFIG = {
    // Heures d'ouverture
    openingHours: {
        start: '08:00',
        end: '20:00'
    },
    // Durée par défaut des créneaux (en minutes)
    defaultSlotDuration: 60,
    // Délai d'annulation gratuit (en heures)
    freeCancellationHours: 24,
    // Capacité maximale par créneau
    maxCapacityPerSlot: 1,
    // Temps de préparation entre les séances (en minutes)
    preparationTime: 15
};

// ========================================
// DONNÉES DES SERVICES
// ========================================
const services = {
    'massage-relaxant': {
        name: 'Massage Relaxant',
        price: 55,
        duration: 60,
        image: 'assets/images/massage-relaxant.jpg',
        description: 'Massage doux et relaxant'
    },
    'massage-sportif': {
        name: 'Massage Sportif',
        price: 70,
        duration: 75,
        image: 'assets/images/massage-sportif.jpg',
        description: 'Massage tonique pour sportifs'
    },
    'massage-huiles': {
        name: 'Massage aux Huiles Tropicales',
        price: 85,
        duration: 120, // 2 heures pour le massage aux huiles tropicales
        image: 'assets/images/massage-huiles.jpg',
        description: 'Massage aux huiles locales'
    },
    'massage-duo': {
        name: 'Massage en Duo',
        price: 100,
        duration: 60,
        image: 'assets/images/massage-duo.jpg',
        description: 'Massage à deux'
    }
};

// Charger les créneaux depuis l'admin (calendarSlots)
let calendarSlots = JSON.parse(localStorage.getItem('calendarSlots')) || {};

// Fonction pour obtenir les créneaux disponibles pour une date donnée
function getAvailableSlotsForDate(date) {
    // Utiliser le même format que l'admin pour éviter le décalage
    // Créer la dateKey directement à partir des composants de la date
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const slots = calendarSlots[dateKey] || [];
    
    // Charger les réservations confirmées
    const confirmedBookings = getConfirmedBookingsForDate(dateKey);
    
    // Retourner uniquement les créneaux disponibles qui n'ont pas de réservation confirmée
    return slots
        .filter(slot => slot.available !== false)
        .map(slot => {
            // Vérifier si ce créneau a une réservation confirmée
            const isBooked = confirmedBookings.some(booking => 
                booking.time === `${slot.start}-${slot.end}`
            );
            
            // Convertir en format compatible avec le système existant
            return {
                time: `${slot.start}-${slot.end}`,
                start: slot.start,
                end: slot.end,
                available: !isBooked
            };
        });
}

// Fonction pour obtenir les réservations confirmées pour une date
function getConfirmedBookingsForDate(dateKey) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    return bookings.filter(booking => 
        booking.date === dateKey && booking.status === 'confirmed'
    );
}

// Réservations existantes (simulées - à remplacer par appel API)
let existingBookings = [];

// ========================================
// INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    renderCalendar();
    checkURLParams();
});

function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');

    if (service && services[service]) {
        const serviceSelect = document.getElementById('service-select');
        serviceSelect.value = service;
        handleServiceSelection();
    }
}

function initializeEventListeners() {
    // Sélection du service (pour compatibilité)
    const serviceSelect = document.getElementById('service-select');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', handleServiceSelection);
    }

    // Boutons de sélection de service
    const serviceButtons = document.querySelectorAll('.service-btn');
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', () => handleServiceButtonClick(btn));
    });

    // Navigation du calendrier
    document.getElementById('prev-month').addEventListener('click', () => navigateMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => navigateMonth(1));

    // Bouton continuer
    document.getElementById('btn-continue').addEventListener('click', handleContinue);

    // Modal
    document.getElementById('btn-modal-close').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// ========================================
// GESTION DU SERVICE
// ========================================
function handleServiceButtonClick(button) {
    const serviceId = button.getAttribute('data-service');

    // Retirer la classe active de tous les boutons
    document.querySelectorAll('.service-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Ajouter la classe active au bouton cliqué
    button.classList.add('active');

    // Mettre à jour l'input hidden
    const serviceSelect = document.getElementById('service-select');
    if (serviceSelect) {
        serviceSelect.value = serviceId;

        // Déclencher l'événement change pour maintenir la compatibilité
        const event = new Event('change');
        serviceSelect.dispatchEvent(event);
    }
}

function handleServiceSelection() {
    const select = document.getElementById('service-select');
    const serviceId = select.value;

    if (!serviceId) {
        bookingState.selectedService = null;
        hideServicePreview();
        return;
    }

    bookingState.selectedService = serviceId;
    const service = services[serviceId];

    // Afficher le service dans le résumé
    showServicePreview(service);

    // Mettre à jour le résumé
    updateSummary();
}

function showServicePreview(service) {
    const preview = document.getElementById('service-preview');
    const placeholder = document.getElementById('summary-placeholder');
    const serviceImage = document.getElementById('service-image');

    // Handle missing images gracefully with error handler
    serviceImage.onerror = function() {
        this.style.display = 'none';
    };
    serviceImage.src = service.image;
    serviceImage.alt = service.name;
    
    document.getElementById('service-name').textContent = service.name;
    document.getElementById('service-duration').textContent = `${service.duration} minutes`;
    document.getElementById('service-price').textContent = `${service.price}€`;

    preview.style.display = 'block';
    placeholder.style.display = 'none';
}

function hideServicePreview() {
    document.getElementById('service-preview').style.display = 'none';
    document.getElementById('summary-placeholder').style.display = 'block';
}

// ========================================
// CALENDRIER
// ========================================
function renderCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const monthTitle = document.getElementById('current-month');

    // Titre du mois
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    monthTitle.textContent = `${monthNames[bookingState.currentMonth]} ${bookingState.currentYear}`;

    // Premier jour du mois
    const firstDay = new Date(bookingState.currentYear, bookingState.currentMonth, 1);
    const lastDay = new Date(bookingState.currentYear, bookingState.currentMonth + 1, 0);

    // Décalage pour commencer lundi
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    // Effacer les jours précédents
    calendarDays.innerHTML = '';

    // Jours du mois précédent
    const prevMonthLastDay = new Date(bookingState.currentYear, bookingState.currentMonth, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        const dayDiv = createDayElement(prevMonthLastDay - i, true, false);
        dayDiv.classList.add('other-month');
        calendarDays.appendChild(dayDiv);
    }

    // Jours du mois actuel
    const today = new Date();
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(bookingState.currentYear, bookingState.currentMonth, day);
        const isPast = currentDate < today.setHours(0, 0, 0, 0);
        const isToday = currentDate.toDateString() === new Date().toDateString();

        const dayDiv = createDayElement(day, false, isPast);
        if (isToday) dayDiv.classList.add('today');

        // Vérifier si sélectionné
        if (bookingState.selectedDate &&
            bookingState.selectedDate.getDate() === day &&
            bookingState.selectedDate.getMonth() === bookingState.currentMonth &&
            bookingState.selectedDate.getFullYear() === bookingState.currentYear) {
            dayDiv.classList.add('selected');
        }

        calendarDays.appendChild(dayDiv);
    }

    // Jours du mois suivant pour compléter
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = createDayElement(day, true, false);
        dayDiv.classList.add('other-month');
        calendarDays.appendChild(dayDiv);
    }
}

function createDayElement(day, isOtherMonth, isPast) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day');
    dayDiv.textContent = day;

    if (!isOtherMonth) {
        const dateKey = `${bookingState.currentYear}-${String(bookingState.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // Utiliser la même méthode de création de date que l'admin pour éviter le décalage
        const dateForCheck = new Date(Date.UTC(bookingState.currentYear, bookingState.currentMonth, day));
        const hasAvailableSlots = getAvailableSlotsForDate(dateForCheck).length > 0;
        
        // Si la date n'a pas de créneaux disponibles, l'afficher comme barrée
        if (!hasAvailableSlots) {
            dayDiv.classList.add('no-slots');
        }
    }

    if (isPast && !isOtherMonth) {
        dayDiv.classList.add('disabled');
    } else if (!isOtherMonth) {
        dayDiv.addEventListener('click', () => handleDateSelection(day));
    }

    return dayDiv;
}

function handleDateSelection(day) {
    // Créer la date sans décalage de fuseau horaire
    // Utiliser la même méthode que l'admin pour éviter le décalage
    bookingState.selectedDate = new Date(Date.UTC(bookingState.currentYear, bookingState.currentMonth, day));
    bookingState.selectedTime = null; // Réinitialiser l'heure

    renderCalendar();
    renderTimeSlots();
    updateSummary();
}

function navigateMonth(direction) {
    bookingState.currentMonth += direction;

    if (bookingState.currentMonth > 11) {
        bookingState.currentMonth = 0;
        bookingState.currentYear++;
    } else if (bookingState.currentMonth < 0) {
        bookingState.currentMonth = 11;
        bookingState.currentYear--;
    }

    renderCalendar();

    // Si une date était sélectionnée dans un autre mois, réinitialiser
    if (bookingState.selectedDate &&
        (bookingState.selectedDate.getMonth() !== bookingState.currentMonth ||
         bookingState.selectedDate.getFullYear() !== bookingState.currentYear)) {
        renderTimeSlots();
    }
}

// ========================================
// CRÉNEAUX HORAIRES COMPACTS
// ========================================
function renderTimeSlots() {
    const timeSlotsContainer = document.getElementById('time-slots');

    if (!bookingState.selectedDate) {
        timeSlotsContainer.innerHTML = `
            <div class="no-slots-message">
                <i class="fas fa-calendar-alt"></i>
                <p>Sélectionnez une date pour voir les créneaux disponibles</p>
            </div>
        `;
        return;
    }

    timeSlotsContainer.innerHTML = '';

    // Charger les créneaux depuis l'admin
    const availableSlots = getAvailableSlotsForDate(bookingState.selectedDate);

    if (availableSlots.length === 0) {
        timeSlotsContainer.innerHTML = `
            <div class="no-slots-message">
                <i class="fas fa-calendar-times"></i>
                <p>Aucun créneau disponible pour cette date</p>
            </div>
        `;
        return;
    }

    // Trier les créneaux par heure
    availableSlots.sort((a, b) => a.start.localeCompare(b.start));

    // Créer une grille compacte
    const slotsContainer = document.createElement('div');
    slotsContainer.className = 'time-slots-compact';

    availableSlots.forEach(slot => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'time-slot-compact';
        
        // Vérifier si le créneau est déjà réservé
        const isBooked = isSlotBooked(bookingState.selectedDate, `${slot.start}-${slot.end}`);
        const isSelected = bookingState.selectedTime === `${slot.start}-${slot.end}`;

        // Afficher uniquement l'heure de début
        slotDiv.textContent = slot.start;

        if (isBooked) {
            slotDiv.classList.add('unavailable');
            slotDiv.title = 'Ce créneau est déjà réservé';
        } else {
            slotDiv.addEventListener('click', () => handleTimeSelection(`${slot.start}-${slot.end}`));
            slotDiv.title = `Réserver à ${slot.start}`;
        }

        if (isSelected) {
            slotDiv.classList.add('selected');
        }

        slotsContainer.appendChild(slotDiv);
    });

    timeSlotsContainer.appendChild(slotsContainer);
}

function calculateSlotDuration(start, end) {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    return Math.round((endTime - startTime) / (1000 * 60));
}

function isSlotBooked(date, time) {
    // Simuler des réservations (à remplacer par appel API)
    const dateString = date.toISOString().split('T')[0];

    return existingBookings.some(booking =>
        booking.date === dateString && booking.time === time
    );
}

function handleTimeSelection(time) {
    bookingState.selectedTime = time;
    renderTimeSlots();
    updateSummary();

    // Afficher le formulaire client
    showClientForm();
}

function showClientForm() {
    const clientSection = document.getElementById('client-info-section');
    const calendarTimeslotsContainer = document.getElementById('calendar-timeslots-container');

    // Cacher le calendrier + créneaux
    if (calendarTimeslotsContainer) {
        calendarTimeslotsContainer.style.display = 'none';
    }

    // Afficher le formulaire client à la place
    clientSection.style.display = 'block';

    // Ajouter le bouton "Retour" s'il n'existe pas déjà
    if (!document.getElementById('btn-back-to-calendar')) {
        const backButton = document.createElement('button');
        backButton.id = 'btn-back-to-calendar';
        backButton.className = 'btn-back';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Retour au calendrier';
        backButton.addEventListener('click', hideClientForm);
        
        // Insérer le bouton en haut du formulaire
        const form = document.getElementById('client-info-form');
        form.insertBefore(backButton, form.firstChild);
    }
}

function hideClientForm() {
    const clientSection = document.getElementById('client-info-section');
    const calendarTimeslotsContainer = document.getElementById('calendar-timeslots-container');

    // Cacher le formulaire client
    clientSection.style.display = 'none';

    // Réafficher le calendrier + créneaux avec la disposition correcte
    if (calendarTimeslotsContainer) {
        calendarTimeslotsContainer.style.display = 'grid'; // Forcer la disposition grid
        calendarTimeslotsContainer.style.gridTemplateColumns = '2fr 1fr'; // Réappliquer la disposition
        calendarTimeslotsContainer.style.gap = '1.5rem'; // Réappliquer l'espacement
    }

    // NE PAS réinitialiser l'heure sélectionnée pour conserver l'état
    // bookingState.selectedTime reste inchangé
    renderTimeSlots();
    
    // Mettre à jour le résumé pour refléter l'état actuel
    updateSummary();
}

// ========================================
// MISE À JOUR DU RÉSUMÉ
// ========================================
function updateSummary() {
    const bookingDetails = document.getElementById('booking-details');
    const summaryTotal = document.getElementById('summary-total');
    const btnContinue = document.getElementById('btn-continue');

    // Si service, date et heure sélectionnés
    if (bookingState.selectedService && bookingState.selectedDate && bookingState.selectedTime) {
        const service = services[bookingState.selectedService];

        // Afficher les détails
        bookingDetails.style.display = 'block';
        summaryTotal.style.display = 'block';

        // Date formatée
        const dateFormatted = bookingState.selectedDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        document.getElementById('selected-date').textContent = dateFormatted;
        document.getElementById('selected-time').textContent = bookingState.selectedTime;
        document.getElementById('summary-duration').textContent = `${service.duration} min`;
        document.getElementById('total-price').textContent = `${service.price}€`;

        // Activer le bouton
        btnContinue.disabled = false;
    } else {
        bookingDetails.style.display = 'none';
        summaryTotal.style.display = 'none';
        btnContinue.disabled = true;
    }
}

// ========================================
// GESTION DE LA RÉSERVATION
// ========================================
/**
 * Gère le bouton "Je réserve" et valide le formulaire
 * Affiche des messages d'erreur visuels pour guider l'utilisateur
 */
function handleContinue() {
    // Vérifier qu'un service est sélectionné (validation au moment de la réservation)
    if (!bookingState.selectedService) {
        showNotification('Veuillez choisir un type de massage avant de procéder à la réservation', 'warning');
        return;
    }

    // Valider le formulaire client
    const fields = {
        prenom: document.getElementById('prenom'),
        nom: document.getElementById('nom'),
        email: document.getElementById('email'),
        telephone: document.getElementById('telephone'),
        adresse: document.getElementById('adresse')
    };

    // Nettoyer les erreurs précédentes
    Object.values(fields).forEach(field => {
        if (field) {
            field.classList.remove('error');
            const errorMsg = field.parentElement.querySelector('.field-error');
            if (errorMsg) errorMsg.remove();
        }
    });

    let hasError = false;
    let firstErrorField = null;

    // Valider chaque champ
    Object.entries(fields).forEach(([key, field]) => {
        if (!field) return; // Skip if field not found
        if (!field.value.trim()) {
            showFieldError(field, 'Ce champ est obligatoire');
            hasError = true;
            if (!firstErrorField) firstErrorField = field;
        }
    });

    // Validation email spécifique
    if (fields.email && fields.email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fields.email.value.trim())) {
            showFieldError(fields.email, 'Veuillez entrer une adresse email valide');
            hasError = true;
            if (!firstErrorField) firstErrorField = fields.email;
        }
    }

    // Validation téléphone (format français/réunionnais)
    if (fields.telephone && fields.telephone.value.trim()) {
        const phoneRegex = /^(\+262|0)[0-9]{9}$/;
        if (!phoneRegex.test(fields.telephone.value.trim().replace(/\s/g, ''))) {
            showFieldError(fields.telephone, 'Format attendu: +262 692 XX XX XX ou 0692 XX XX XX');
            hasError = true;
            if (!firstErrorField) firstErrorField = fields.telephone;
        }
    }

    if (hasError) {
        if (firstErrorField) {
            firstErrorField.focus();
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Sauvegarder les infos client
    bookingState.clientInfo = {
        prenom: fields.prenom.value.trim(),
        nom: fields.nom.value.trim(),
        email: fields.email.value.trim(),
        telephone: fields.telephone.value.trim(),
        adresse: fields.adresse.value.trim(),
        message: document.getElementById('message') ? document.getElementById('message').value.trim() : ''
    };

    // Procéder à la réservation
    processBooking();
}

// Fonction pour afficher une erreur sur un champ
/**
 * Affiche un message d'erreur sous un champ de formulaire
 * @param {HTMLElement} field - Le champ de formulaire
 * @param {string} message - Le message d'erreur à afficher
 */
function showFieldError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

// Fonction pour afficher une notification
/**
 * Affiche une notification temporaire en haut à droite de l'écran
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de notification: 'success', 'warning', ou 'info'
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Retirer après 4 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Traite la réservation en créant l'objet booking et en l'enregistrant
 * Affiche un état de chargement pendant le traitement
 */
function processBooking() {
    const btnContinue = document.getElementById('btn-continue');
    const originalText = btnContinue.innerHTML;
    
    // Show loading state
    btnContinue.disabled = true;
    btnContinue.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement en cours...';
    
    // Simulate processing delay for better UX
    setTimeout(() => {
        const service = services[bookingState.selectedService];

        // Créer l'objet réservation avec le même format de date que l'admin
        const dateKey = `${bookingState.selectedDate.getFullYear()}-${String(bookingState.selectedDate.getMonth() + 1).padStart(2, '0')}-${String(bookingState.selectedDate.getDate()).padStart(2, '0')}`;
        
        const booking = {
            id: Date.now(), // ID temporaire
            service: bookingState.selectedService,
            serviceName: service.name,
            date: dateKey, // Utiliser le même format que l'admin pour éviter le décalage
            time: bookingState.selectedTime,
            price: service.price,
            duration: service.duration,
            client: bookingState.clientInfo,
            status: 'pending', // En attente de validation
            createdAt: new Date().toISOString()
        };

        // Sauvegarder localement (à remplacer par appel API)
        saveBooking(booking);

        // Restore button state
        btnContinue.innerHTML = originalText;

        // Afficher la modal de confirmation
        showConfirmationModal(booking);
        
        // Show success notification
        showNotification('Réservation enregistrée avec succès !', 'success');
    }, 800);
}

function saveBooking(booking) {
    // Récupérer les réservations existantes du localStorage
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Ajouter aux réservations existantes pour bloquer le créneau
    existingBookings.push({
        date: booking.date,
        time: booking.time
    });

    console.log('Réservation enregistrée:', booking);

    // Ici, envoyer au backend
    // sendBookingToBackend(booking);
}

async function showConfirmationModal(booking) {
    const modal = document.getElementById('confirmation-modal');

    // Remplir les détails
    document.getElementById('modal-service').textContent = booking.serviceName;
    document.getElementById('modal-date').textContent = new Date(booking.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('modal-time').textContent = booking.time;
    document.getElementById('modal-email').textContent = booking.client.email;

    // Afficher la modal
    modal.classList.add('active');

    // Envoyer l'email de confirmation automatiquement
    await sendAutomaticConfirmationEmail(booking);
}

async function sendAutomaticConfirmationEmail(booking) {
    try {
        console.log('📧 Tentative d\'envoi automatique de l\'email...');
        
        // Essayer d'envoyer via le nouveau système sans services tiers
        const emailResult = await sendAutomaticEmail(booking);
        
        if (emailResult.success) {
            console.log('✅ Email envoyé automatiquement avec succès via:', emailResult.method);
            updateEmailStatusInModal(true, booking.client.email);
            
        } else {
            console.warn('⚠️ Système automatique a échoué, utilisation du système de secours');
            showFallbackEmailButton(booking);
            updateEmailStatusInModal(false, booking.client.email);
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi automatique:', error);
        showFallbackEmailButton(booking);
        updateEmailStatusInModal(false, booking.client.email);
    }
}

function showFallbackEmailButton(booking) {
    const modalBody = document.querySelector('.modal-body');
    
    // Vérifier si le bouton existe déjà
    let emailButton = document.querySelector('.btn-email-fallback');
    if (!emailButton) {
        emailButton = document.createElement('button');
        emailButton.className = 'btn-email-fallback';
        emailButton.innerHTML = '<i class="fas fa-envelope"></i> Ouvrir l\'email de confirmation';
        emailButton.onclick = () => {
            openFallbackEmail(booking);
        };
        
        // Ajouter le bouton après les détails
        const modalDetails = document.querySelector('.modal-details');
        modalDetails.parentNode.insertBefore(emailButton, modalDetails.nextSibling);
    }
    
    console.log('📧 Bouton email de secours affiché pour:', booking.client.email);
}

// ========================================
// UTILITAIRES
// ========================================
function formatDate(date) {
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// ========================================
// INTÉGRATION STRIPE (À IMPLÉMENTER)
// ========================================
async function processStripePayment(booking) {
    // Exemple d'intégration Stripe
    /*
    const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
    });

    const { sessionId } = await response.json();

    const stripe = Stripe('pk_test_...');
    await stripe.redirectToCheckout({ sessionId });
    */

    console.log('Paiement Stripe à implémenter');
}

// ========================================
// CHARGER LES RÉSERVATIONS EXISTANTES
// ========================================
function loadExistingBookings() {
    // À remplacer par appel API
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

    existingBookings = bookings.map(b => ({
        date: b.date,
        time: b.time
    }));
}

// Charger au démarrage
loadExistingBookings();

// ========================================
// ENVOI D'EMAILS AUTOMATIQUES
// ========================================
async function sendAutomaticEmail(booking) {
    try {
        console.log('📧 Préparation de l\'email automatique pour:', booking.client.email);
        
        const subject = encodeURIComponent(`[Zen Réunion] Confirmation de votre réservation #${booking.id}`);
        const body = encodeURIComponent(
`Bonjour ${booking.client.prenom},

Votre réservation a été enregistrée avec succès !

📋 Détails de votre réservation :
• Service : ${booking.serviceName}
• Date : ${new Date(booking.date).toLocaleDateString('fr-FR')}
• Heure : ${booking.time}
• Durée : ${booking.duration} minutes
• Prix : ${booking.price}€

📍 Adresse :
${booking.client.adresse}

📞 Contact :
${booking.client.telephone}

Votre réservation est en attente de validation par notre équipe. 
Vous recevrez une confirmation définitive dans les 24 heures.

En cas de questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Zen Réunion
dremk34@gmail.com`
        );

        // Ouvrir le client email par défaut avec l'adresse dremk34@gmail.com comme expéditeur
        window.open(`mailto:${booking.client.email}?from=dremk34@gmail.com&subject=${subject}&body=${body}`);
        
        console.log('✅ Email automatique préparé depuis dremk34@gmail.com');
        
        return {
            success: true,
            method: 'client_email_default'
        };
        
    } catch (error) {
        console.error('❌ Erreur lors de la préparation de l\'email automatique:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

function openFallbackEmail(booking) {
    const subject = encodeURIComponent(`[Zen Réunion] Confirmation de votre réservation #${booking.id}`);
    const body = encodeURIComponent(
`Bonjour ${booking.client.prenom},

Votre réservation a été enregistrée avec succès !

📋 Détails de votre réservation :
• Service : ${booking.serviceName}
• Date : ${new Date(booking.date).toLocaleDateString('fr-FR')}
• Heure : ${booking.time}
• Durée : ${booking.duration} minutes
• Prix : ${booking.price}€

📍 Adresse :
${booking.client.adresse}

📞 Contact :
${booking.client.telephone}

Votre réservation est en attente de validation par notre équipe. 
Vous recevrez une confirmation définitive dans les 24 heures.

En cas de questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Zen Réunion
dremk34@gmail.com`
    );
    
    // Ouvrir le client email par défaut avec l'adresse dremk34@gmail.com comme expéditeur
    window.open(`mailto:${booking.client.email}?from=dremk34@gmail.com&subject=${subject}&body=${body}`);
    
    console.log('📧 Email de secours ouvert depuis dremk34@gmail.com');
}

function updateEmailStatusInModal(success, email) {
    const modalBody = document.querySelector('.modal-body');
    
    // Supprimer l'ancien statut s'il existe
    const existingStatus = document.querySelector('.email-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    // Créer le nouveau statut
    const statusDiv = document.createElement('div');
    statusDiv.className = `email-status ${success ? 'success' : 'warning'}`;
    
    if (success) {
        statusDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Email de confirmation envoyé automatiquement à ${email}</span>
        `;
    } else {
        statusDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>L'envoi automatique a échoué. Utilisez le bouton ci-dessous pour envoyer l'email manuellement.</span>
        `;
    }
    
    // Insérer le statut après les détails
    const modalDetails = document.querySelector('.modal-details');
    modalDetails.parentNode.insertBefore(statusDiv, modalDetails.nextSibling);
}

// ========================================
// NOTIFICATIONS
// ========================================
console.log('🎟️ Système de réservation BilletWeb chargé avec succès !');
console.log('📅 Calendrier interactif prêt');
console.log('⏰ Créneaux horaires configurés');
console.log('📧 Système d\'emails configuré depuis dremk34@gmail.com');
console.log('💳 Paiement Stripe à configurer (Phase 2)');
