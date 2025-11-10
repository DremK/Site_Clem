// ========================================
// ÉTAT DE L'APPLICATION
// ========================================
let bookings = [];
let currentFilter = 'all';

// ========================================
// INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    loadBookings();
    initializeEventListeners();
    renderStats();
    renderBookingsTable();
});

function initializeEventListeners() {
    // Filtres
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            currentFilter = e.target.dataset.filter;

            // Mettre à jour l'UI
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');

            renderBookingsTable();
        });
    });
}

// ========================================
// CHARGEMENT DES DONNÉES
// ========================================
function loadBookings() {
    // Charger depuis localStorage
    const storedBookings = localStorage.getItem('bookings');
    bookings = storedBookings ? JSON.parse(storedBookings) : [];

    // Trier par date (plus récent en premier)
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function saveBookings() {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function refreshData(event) {
    loadBookings();
    renderStats();
    renderBookingsTable();

    // Animation de feedback
    if (event) {
        const btn = event.target.closest('button');
        const icon = btn.querySelector('i');
        icon.classList.add('fa-spin');eadezco

        setTimeout(() => {
            icon.classList.remove('fa-spin');
        }, 1000);
    }
}

// ========================================
// STATISTIQUES
// ========================================
function renderStats() {
    const stats = {
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        rejected: bookings.filter(b => b.status === 'rejected').length,
        total: bookings.length
    };

    // Mettre à jour les cartes de statistiques
    document.getElementById('stat-pending').textContent = stats.pending;
    document.getElementById('stat-confirmed').textContent = stats.confirmed;
    document.getElementById('stat-rejected').textContent = stats.rejected;
    document.getElementById('stat-total').textContent = stats.total;

    // Mettre à jour les badges du header
    document.getElementById('header-pending').textContent = stats.pending;
    document.getElementById('header-confirmed').textContent = stats.confirmed;
    document.getElementById('header-total').textContent = stats.total;
}

// ========================================
// TABLEAU DES RÉSERVATIONS
// ========================================
function renderBookingsTable() {
    const container = document.getElementById('table-container');

    // Filtrer les réservations
    let filteredBookings = bookings;
    if (currentFilter !== 'all') {
        filteredBookings = bookings.filter(b => b.status === currentFilter);
    }

    // Si aucune réservation
    if (filteredBookings.length === 0) {
        container.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-calendar-times"></i>
                <p>Aucune réservation ${currentFilter !== 'all' ? 'dans cette catégorie' : 'pour le moment'}</p>
            </div>
        `;
        return;
    }

    // Créer le tableau
    const table = document.createElement('table');
    table.className = 'bookings-table';

    // En-tête
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Service</th>
                <th>Date & Heure</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${filteredBookings.map(booking => createBookingRow(booking)).join('')}
        </tbody>
    `;

    container.innerHTML = '';
    container.appendChild(table);
}

function createBookingRow(booking) {
    const statusLabels = {
        pending: 'En attente',
        confirmed: 'Confirmée',
        rejected: 'Refusée'
    };

    const formattedDate = new Date(booking.date).toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return `
        <tr>
            <td>#${String(booking.id).slice(-6)}</td>
            <td>
                <strong>${booking.client.prenom} ${booking.client.nom}</strong><br>
                <small style="color: #718096;">${booking.client.email}</small>
            </td>
            <td>${booking.serviceName}</td>
            <td>
                ${formattedDate}<br>
                <strong>${booking.time}</strong>
            </td>
            <td><strong>${booking.price}€</strong></td>
            <td>
                <span class="status-badge ${booking.status}">
                    ${statusLabels[booking.status]}
                </span>
            </td>
            <td>
                <div class="booking-actions">
                    ${booking.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="updateBookingStatus(${booking.id}, 'confirmed')">
                            <i class="fas fa-check"></i> Accepter
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="updateBookingStatus(${booking.id}, 'rejected')">
                            <i class="fas fa-times"></i> Refuser
                        </button>
                    ` : `
                        <button class="btn btn-sm btn-secondary" onclick="showBookingDetails(${booking.id})">
                            <i class="fas fa-eye"></i> Détails
                        </button>
                    `}
                </div>
            </td>
        </tr>
    `;
}

// ========================================
// GESTION DES RÉSERVATIONS
// ========================================
function updateBookingStatus(bookingId, newStatus) {
    const booking = bookings.find(b => b.id === bookingId);

    if (!booking) return;

    const statusLabels = {
        confirmed: 'acceptée',
        rejected: 'refusée'
    };

    const confirmMessage = `Êtes-vous sûr de vouloir ${newStatus === 'confirmed' ? 'accepter' : 'refuser'} cette réservation ?\n\nClient: ${booking.client.prenom} ${booking.client.nom}\nService: ${booking.serviceName}\nDate: ${booking.date} à ${booking.time}`;

    if (!confirm(confirmMessage)) return;

    // Mettre à jour le statut
    booking.status = newStatus;
    booking.updatedAt = new Date().toISOString();

    // Sauvegarder
    saveBookings();

    // Mettre à jour l'affichage
    renderStats();
    renderBookingsTable();

    // Notification (à remplacer par un toast)
    alert(`Réservation ${statusLabels[newStatus]} ! Un email a été envoyé au client.`);

    // Ici, appeler l'API pour envoyer l'email
    sendStatusEmail(booking);
}

function sendStatusEmail(booking) {
    const subject = encodeURIComponent(`[Zen Réunion] Statut de votre réservation #${booking.id}`);
    const body = encodeURIComponent(
`Bonjour ${booking.client.prenom},

Votre réservation du ${new Date(booking.date).toLocaleDateString('fr-FR')} à ${booking.time} 
pour "${booking.serviceName}" a été ${booking.status === 'confirmed' ? 'confirmée' : 'annulée'}.

${booking.status === 'confirmed' ? 
    'Nous vous attendons à l\'adresse suivante :\n' + booking.client.adresse :
    'N\'hésitez pas à choisir un autre créneau sur notre site.'
}

Cordialement,
L'équipe Zen Réunion`
    );
    
    // Envoyer depuis dremk34@gmail.com
    window.open(`mailto:${booking.client.email}?from=dremk34@gmail.com&subject=${subject}&body=${body}`);
    
    console.log('📧 Email de statut envoyé à:', booking.client.email, 'depuis dremk34@gmail.com');
}

// ========================================
// MODAL DÉTAILS
// ========================================
function showBookingDetails(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const statusLabels = {
        pending: 'En attente de validation',
        confirmed: 'Confirmée',
        rejected: 'Refusée'
    };

    const formattedDate = new Date(booking.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const createdDate = new Date(booking.createdAt).toLocaleString('fr-FR');

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="booking-detail">
            <label>ID de réservation</label>
            <p>#${booking.id}</p>
        </div>

        <div class="booking-detail">
            <label>Service</label>
            <p>${booking.serviceName}</p>
        </div>

        <div class="booking-detail">
            <label>Client</label>
            <p>${booking.client.prenom} ${booking.client.nom}</p>
        </div>

        <div class="booking-detail">
            <label>Email</label>
            <p>${booking.client.email}</p>
        </div>

        <div class="booking-detail">
            <label>Téléphone</label>
            <p>${booking.client.telephone}</p>
        </div>

        <div class="booking-detail">
            <label>Date et heure</label>
            <p>${formattedDate} à ${booking.time}</p>
        </div>

        <div class="booking-detail">
            <label>Durée</label>
            <p>${booking.duration} minutes</p>
        </div>

        <div class="booking-detail">
            <label>Prix</label>
            <p><strong>${booking.price}€</strong></p>
        </div>

        <div class="booking-detail">
            <label>Statut</label>
            <p><span class="status-badge ${booking.status}">${statusLabels[booking.status]}</span></p>
        </div>

        ${booking.client.message ? `
            <div class="booking-detail">
                <label>Message du client</label>
                <p>${booking.client.message}</p>
            </div>
        ` : ''}

        <div class="booking-detail">
            <label>Réservation créée le</label>
            <p>${createdDate}</p>
        </div>

        ${booking.status === 'pending' ? `
            <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                <button class="btn btn-success" style="flex: 1;" onclick="updateBookingStatus(${booking.id}, 'confirmed'); closeModal();">
                    <i class="fas fa-check"></i> Accepter
                </button>
                <button class="btn btn-danger" style="flex: 1;" onclick="updateBookingStatus(${booking.id}, 'rejected'); closeModal();">
                    <i class="fas fa-times"></i> Refuser
                </button>
            </div>
        ` : ''}
    `;

    document.getElementById('details-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('details-modal').classList.remove('active');
}

// Fermer la modal en cliquant en dehors
document.getElementById('details-modal').addEventListener('click', (e) => {
    if (e.target.id === 'details-modal') {
        closeModal();
    }
});

// ========================================
// EXPORT DES DONNÉES
// ========================================
function exportToCSV() {
    if (bookings.length === 0) {
        alert('Aucune réservation à exporter');
        return;
    }

    const headers = ['ID', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Service', 'Date', 'Heure', 'Prix', 'Statut', 'Créé le'];

    const rows = bookings.map(b => [
        b.id,
        b.client.prenom,
        b.client.nom,
        b.client.email,
        b.client.telephone,
        b.serviceName,
        b.date,
        b.time,
        b.price,
        b.status,
        b.createdAt
    ]);

    let csvContent = headers.join(',') + '\n';
    csvContent += rows.map(row => row.join(',')).join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reservations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// ========================================
// GESTION DU CALENDRIER ADMIN AMÉLIORÉ
// ========================================
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDates = [];
let calendarSlots = JSON.parse(localStorage.getItem('calendarSlots')) || {};
let selectedTimeSlots = new Set();

// Configuration avancée pour l'admin
const ADMIN_CONFIG = {
    // Heures d'ouverture par défaut
    defaultHours: {
        start: '08:00',
        end: '20:00'
    },
    // Durées de créneaux disponibles
    slotDurations: [30, 60, 75, 90, 120],
    // Capacité maximale par créneau
    maxCapacity: 5,
    // Temps de préparation entre séances
    preparationTime: 15
};

// ========================================
// SYNCHRONISATION AVEC LES RÉSERVATIONS
// ========================================
function synchronizeWithBookingSystem() {
    // Sauvegarder les créneaux dans localStorage pour synchronisation
    localStorage.setItem('calendarSlots', JSON.stringify(calendarSlots));
    
    // Mettre à jour les services disponibles (si modifiés dans l'admin)
    updateAvailableServices();
    
    // Forcer le rechargement des données dans booking.js
    if (window.bookingState) {
        window.bookingState.forceReload = true;
    }
    
    console.log('🔄 Synchronisation avec le système de réservation effectuée');
}

function updateAvailableServices() {
    // Cette fonction peut être étendue pour synchroniser les services modifiés
    // Pour l'instant, on synchronise uniquement les créneaux
    console.log('📋 Services synchronisés');
}

function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    initCalendar();
}

function initCalendar() {
    const calendar = document.getElementById('calendar');
    const monthTitle = document.getElementById('current-month');

    // Titre du mois
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    monthTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    // Premier jour du mois
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Décalage pour commencer lundi
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    // Effacer les jours précédents
    calendar.innerHTML = '';

    // Jours du mois précédent
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        const dayDiv = createCalendarDayElement(prevMonthLastDay - i, true, false);
        dayDiv.classList.add('other-month');
        calendar.appendChild(dayDiv);
    }

    // Jours du mois actuel
    const today = new Date();
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(currentYear, currentMonth, day);
        const isPast = currentDate < today.setHours(0, 0, 0, 0);
        const isToday = currentDate.toDateString() === new Date().toDateString();

        const dayDiv = createCalendarDayElement(day, false, isPast);
        if (isToday) dayDiv.classList.add('today');

        // Vérifier si sélectionné
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (selectedDates.includes(dateKey)) {
            dayDiv.classList.add('selected');
        }

        calendar.appendChild(dayDiv);
    }

    // Jours du mois suivant pour compléter
    const totalCells = calendar.children.length;
    const remainingCells = 42 - totalCells; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = createCalendarDayElement(day, true, false);
        dayDiv.classList.add('other-month');
        calendar.appendChild(dayDiv);
    }
}

function createCalendarDayElement(day, isOtherMonth, isPast) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day-admin');
    dayDiv.textContent = day;

    if (!isOtherMonth) {
        // Utiliser le format YYYY-MM-DD sans conversion ISO pour éviter le décalage
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Ajouter l'attribut data-date pour la sélection
        dayDiv.setAttribute('data-date', dateKey);
        
        const slots = calendarSlots[dateKey] || [];
        const confirmedBookings = bookings.filter(b => b.date === dateKey && b.status === 'confirmed');
        const pendingBookings = bookings.filter(b => b.date === dateKey && b.status === 'pending');
        
        // Ajouter les indicateurs de créneaux compacts
        if (slots.length > 0 || confirmedBookings.length > 0 || pendingBookings.length > 0) {
            dayDiv.classList.add('has-slots');
            
            // Conteneur pour les indicateurs en haut à gauche (créneaux ouverts)
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'calendar-indicators';
            
            // Indicateur des créneaux ouverts (slots disponibles) - en haut à gauche
            if (slots.length > 0) {
                const slotsIndicator = document.createElement('div');
                slotsIndicator.className = 'slots-indicator';
                slotsIndicator.title = `${slots.length} créneau(x) ouvert(s)`;
                
                // Icône pour les créneaux ouverts
                const slotsIcon = document.createElement('i');
                slotsIcon.className = 'fas fa-clock slots-icon';
                slotsIndicator.appendChild(slotsIcon);
                
                // Nombre de créneaux
                const slotsCount = document.createElement('span');
                slotsCount.className = 'slots-count-text';
                slotsCount.textContent = slots.length;
                slotsIndicator.appendChild(slotsCount);
                
                indicatorsContainer.appendChild(slotsIndicator);
            }
            
            dayDiv.appendChild(indicatorsContainer);
            
            // Conteneur pour les indicateurs en bas à droite (rendez-vous)
            const bookingsIndicatorsContainer = document.createElement('div');
            bookingsIndicatorsContainer.className = 'bookings-indicators';
            bookingsIndicatorsContainer.style.position = 'absolute';
            bookingsIndicatorsContainer.style.bottom = '4px';
            bookingsIndicatorsContainer.style.right = '4px';
            bookingsIndicatorsContainer.style.display = 'flex';
            bookingsIndicatorsContainer.style.flexDirection = 'column';
            bookingsIndicatorsContainer.style.gap = '2px';
            bookingsIndicatorsContainer.style.alignItems = 'flex-end';
            
            // Indicateur des rendez-vous confirmés - en bas à droite
            if (confirmedBookings.length > 0) {
                const confirmedIndicator = document.createElement('div');
                confirmedIndicator.className = 'booking-indicator confirmed';
                confirmedIndicator.title = `${confirmedBookings.length} rendez-vous confirmé(s)`;
                
                // Icône pour les rendez-vous confirmés
                const confirmedIcon = document.createElement('i');
                confirmedIcon.className = 'fas fa-check-circle confirmed-icon';
                confirmedIndicator.appendChild(confirmedIcon);
                
                // Nombre de rendez-vous confirmés
                const confirmedCount = document.createElement('span');
                confirmedCount.className = 'booking-count-text';
                confirmedCount.textContent = confirmedBookings.length;
                confirmedIndicator.appendChild(confirmedCount);
                
                bookingsIndicatorsContainer.appendChild(confirmedIndicator);
            }
            
            // Indicateur des rendez-vous en attente - en bas à droite
            if (pendingBookings.length > 0) {
                const pendingIndicator = document.createElement('div');
                pendingIndicator.className = 'booking-indicator pending';
                pendingIndicator.title = `${pendingBookings.length} rendez-vous en attente`;
                
                // Icône pour les rendez-vous en attente
                const pendingIcon = document.createElement('i');
                pendingIcon.className = 'fas fa-clock pending-icon';
                pendingIndicator.appendChild(pendingIcon);
                
                // Nombre de rendez-vous en attente
                const pendingCount = document.createElement('span');
                pendingCount.className = 'booking-count-text';
                pendingCount.textContent = pendingBookings.length;
                pendingIndicator.appendChild(pendingCount);
                
                bookingsIndicatorsContainer.appendChild(pendingIndicator);
            }
            
            dayDiv.appendChild(bookingsIndicatorsContainer);
            
            // Tooltip avec les détails des créneaux et rendez-vous
            const tooltip = document.createElement('div');
            tooltip.className = 'slots-tooltip';
            tooltip.style.display = 'none';
            
            let tooltipContent = '';
            if (slots.length > 0) {
                tooltipContent += `<div><strong>Créneaux ouverts (${slots.length})</strong></div>`;
                tooltipContent += slots.map(slot => 
                    `<div>🕒 ${slot.start} - ${slot.end}</div>`
                ).join('');
            }
            
            if (confirmedBookings.length > 0) {
                if (slots.length > 0) tooltipContent += '<div style="margin-top: 0.5rem;"></div>';
                tooltipContent += `<div><strong>Rendez-vous confirmés (${confirmedBookings.length})</strong></div>`;
                tooltipContent += confirmedBookings.map(booking => 
                    `<div>✅ ${booking.time} - ${booking.client.prenom}</div>`
                ).join('');
            }
            
            if (pendingBookings.length > 0) {
                if (slots.length > 0 || confirmedBookings.length > 0) tooltipContent += '<div style="margin-top: 0.5rem;"></div>';
                tooltipContent += `<div><strong>Rendez-vous en attente (${pendingBookings.length})</strong></div>`;
                tooltipContent += pendingBookings.map(booking => 
                    `<div>⏳ ${booking.time} - ${booking.client.prenom}</div>`
                ).join('');
            }
            
            tooltip.innerHTML = tooltipContent;
            dayDiv.appendChild(tooltip);
        }

        if (isPast) {
            dayDiv.classList.add('disabled');
        } else {
            dayDiv.addEventListener('click', () => toggleDateSelection(dateKey));
        }
    }

    return dayDiv;
}

function toggleDateSelection(dateKey) {
    const index = selectedDates.indexOf(dateKey);
    
    // Si on essaie d'ajouter une nouvelle date
    if (index === -1) {
        // Vérifier la cohérence des créneaux si d'autres dates sont déjà sélectionnées
        if (selectedDates.length > 0) {
            const existingSlots = getTimeSlotsForDate(selectedDates[0]);
            const newDateSlots = getTimeSlotsForDate(dateKey);
            
            // Vérifier si les créneaux sont identiques
            const existingTimes = existingSlots.map(slot => slot.start).sort();
            const newDateTimes = newDateSlots.map(slot => slot.start).sort();
            
            const areSlotsIdentical = 
                existingTimes.length === newDateTimes.length &&
                existingTimes.every((time, i) => time === newDateTimes[i]);
            
            if (!areSlotsIdentical) {
                const confirmMessage = `Les créneaux de cette date ne sont pas identiques à ceux déjà sélectionnés.\n\nVoulez-vous vider la sélection actuelle et sélectionner uniquement cette date ?`;
                
                if (confirm(confirmMessage)) {
                    // Vider la sélection actuelle
                    selectedDates.forEach(date => {
                        const dayElement = document.querySelector(`[data-date="${date}"]`);
                        if (dayElement) dayElement.classList.remove('selected');
                    });
                    selectedDates = [dateKey];
                } else {
                    return; // Annuler la sélection
                }
            } else {
                // Créneaux identiques, ajouter normalement
                selectedDates.push(dateKey);
            }
        } else {
            // Première sélection
            selectedDates.push(dateKey);
        }
    } else {
        // Supprimer la date de la sélection
        selectedDates.splice(index, 1);
    }
    
    // Mettre à jour l'apparence visuelle
    const dayElement = document.querySelector(`[data-date="${dateKey}"]`);
    if (dayElement) {
        dayElement.classList.toggle('selected');
    }
    
    // Synchroniser instantanément avec le panneau de gestion des créneaux
    updateSelectedDatesList();
    
    // Gestion automatique du panneau d'édition
    if (selectedDates.length > 0) {
        // Ouvrir automatiquement le panneau si au moins une date est sélectionnée
        openEditPanel();
    } else {
        // Fermer automatiquement le panneau si aucune date n'est sélectionnée
        closeEditPanel();
    }
    
    console.log('Dates sélectionnées:', selectedDates);
    console.log('Créneaux cohérents:', checkConsistentSlotsAcrossDates());
}

function createNewTimeSlot() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!startDate || !endDate) {
        alert('Veuillez sélectionner une plage de dates');
        return;
    }

    const newSlot = {
        id: Date.now(),
        start: '09:00',
        end: '18:00',
        maxCapacity: 5
    };

    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
        const dateKey = currentDate.toISOString().split('T')[0];
        if (!calendarSlots[dateKey]) calendarSlots[dateKey] = [];
        calendarSlots[dateKey].push(newSlot);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    saveCalendar();
    initCalendar();
}

// Supprimé - Fonction de blocage des dates (plus utilisée)

function sendRescheduleEmail(booking, oldDate, newDate) {
    const subject = encodeURIComponent(`[Zen Réunion] Modification de votre réservation #${booking.id}`);
    const body = encodeURIComponent(
`Bonjour ${booking.client.prenom},

Votre rendez-vous a été déplacé :
- Ancienne date : ${oldDate}
- Nouvelle date : ${newDate}

Merci de nous contacter si ce changement ne vous convient pas.

Cordialement,
L'équipe Zen Réunion`
    );
    
    // Envoyer depuis dremk34@gmail.com
    window.open(`mailto:${booking.client.email}?from=dremk34@gmail.com&subject=${subject}&body=${body}`);
    console.log('📧 Email de déplacement envoyé à:', booking.client.email, 'depuis dremk34@gmail.com');
}

function editTimeSlot(dateKey, slotId) {
    const slot = calendarSlots[dateKey].find(s => s.id === slotId);
    const newStart = prompt('Nouvelle heure de début (HH:MM):', slot.start);
    const newEnd = prompt('Nouvelle heure de fin (HH:MM):', slot.end);
    
    if (newStart && newEnd) {
        const oldSlot = `${slot.start}-${slot.end}`;
        slot.start = newStart;
        slot.end = newEnd;
        
        // Trouver les réservations affectées
        bookings.filter(b => b.date === dateKey && b.time === oldSlot).forEach(booking => {
            booking.time = `${newStart}-${newEnd}`;
            if (confirm(`Envoyer un email de notification à ${booking.client.email} ?`)) {
                sendRescheduleEmail(booking, oldSlot, `${newStart}-${newEnd}`);
            }
        });
        
        saveBookings();
        saveCalendar();
        initCalendar();
        renderBookingsTable();
    }
}

function deleteTimeSlot(dateKey, slotId) {
    calendarSlots[dateKey] = calendarSlots[dateKey].filter(s => s.id !== slotId);
    saveCalendar();
    initCalendar();
}

function saveCalendar() {
    localStorage.setItem('calendarSlots', JSON.stringify(calendarSlots));
    synchronizeWithBookingSystem(); // Synchroniser après chaque modification
}

// ========================================
// GESTION INTERACTIVE DES CRÉNEAUX
// ========================================
function openEditPanel() {
    if (selectedDates.length === 0) {
        alert('Veuillez sélectionner au moins une date dans le calendrier');
        return;
    }
    
    updateSelectedDatesList();
    generateTimeSlotButtons();
    updateConfirmedBookingsList();
    document.getElementById('edit-panel').classList.add('active');
    document.body.classList.add('edit-panel-active');
    console.log('📂 Panneau ouvert - Classes appliquées:', {
        panel: document.getElementById('edit-panel').className,
        body: document.body.className
    });
}

function updateConfirmedBookingsList() {
    const container = document.getElementById('confirmed-bookings-list');
    
    // Récupérer tous les rendez-vous confirmés pour les dates sélectionnées
    const confirmedBookings = bookings.filter(booking => 
        selectedDates.includes(booking.date) && 
        booking.status === 'confirmed'
    );
    
    if (confirmedBookings.length === 0) {
        container.innerHTML = `
            <div class="no-bookings-message">
                <i class="fas fa-calendar-check"></i>
                <p>Aucun rendez-vous confirmé pour ces dates</p>
            </div>
        `;
        return;
    }
    
    // Trier par date et heure
    confirmedBookings.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
    });
    
    container.innerHTML = confirmedBookings.map(booking => {
        const formattedDate = new Date(booking.date).toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
        
        // Encoder l'adresse pour Google Maps
        const encodedAddress = encodeURIComponent(booking.client.adresse);
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        
        return `
            <div class="confirmed-booking-item" onclick="showBookingDetails(${booking.id})">
                <div class="booking-client">
                    ${booking.client.prenom} ${booking.client.nom}
                </div>
                <div class="booking-details">
                    <span class="booking-time">${formattedDate} à ${booking.time}</span>
                    <span>${booking.serviceName} - ${booking.price}€</span>
                    <span>📞 ${booking.client.telephone}</span>
                    <div class="booking-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span class="location-address">${booking.client.adresse}</span>
                        <a href="${googleMapsUrl}" target="_blank" class="google-maps-link" onclick="event.stopPropagation()">
                            <i class="fas fa-external-link-alt"></i> Itinéraire
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function generateTimeSlotButtons() {
    const container = document.getElementById('time-slots');
    
    // Récupérer tous les créneaux existants pour les dates sélectionnées
    const existingSlots = getExistingTimeSlotsForSelectedDates();
    
    // Récupérer toutes les réservations confirmées pour les dates sélectionnées
    const confirmedBookings = bookings.filter(booking => 
        selectedDates.includes(booking.date) && 
        booking.status === 'confirmed'
    );
    
    // Extraire les heures déjà réservées et confirmées
    const bookedHours = new Set();
    confirmedBookings.forEach(booking => {
        // Extraire l'heure de début du créneau (ex: "09:00-10:00" -> "09:00")
        const startHour = booking.time.split('-')[0];
        bookedHours.add(startHour);
    });
    
    console.log('📊 Heures déjà réservées et confirmées:', Array.from(bookedHours));
    console.log('📅 Réservations confirmées pour les dates sélectionnées:', confirmedBookings);
    
    // Heures disponibles de 8h à 20h
    const hours = [];
    for (let hour = 8; hour <= 20; hour++) {
        hours.push(`${String(hour).padStart(2, '0')}:00`);
        if (hour < 20) {
            hours.push(`${String(hour).padStart(2, '0')}:30`);
        }
    }
    
    // Générer les boutons pour toutes les heures
    container.innerHTML = hours.map(time => {
        const isActive = existingSlots.some(slot => slot.start === time);
        const isBooked = bookedHours.has(time);
        const slotData = existingSlots.find(slot => slot.start === time);
        const slotId = slotData ? slotData.id : null;
        
        let buttonClass = 'time-slot-admin-btn';
        let buttonContent = time;
        let disabled = false;
        
        if (isBooked) {
            // Heure déjà réservée et confirmée - bouton désactivé
            buttonClass += ' disabled';
            buttonContent += ' <i class="fas fa-ban"></i>';
            disabled = true;
        } else if (isActive) {
            // Heure disponible et active
            buttonClass += ' selected active';
            buttonContent += ' <i class="fas fa-check"></i>';
        } else {
            // Heure disponible mais inactive
            buttonClass += '';
        }
        
        return `
            <button class="${buttonClass}" 
                    data-time="${time}" 
                    data-slot-id="${slotId}"
                    data-booked="${isBooked}"
                    ${disabled ? 'disabled' : ''}
                    onclick="handleTimeSlotClick(this)">
                ${buttonContent}
            </button>
        `;
    }).join('');
    
    console.log('🔄 Boutons d\'heures générés avec prise en compte des réservations confirmées');
}

function checkConsistentSlotsAcrossDates() {
    if (selectedDates.length < 2) return true;
    
    // Récupérer les créneaux de la première date
    const firstDateSlots = calendarSlots[selectedDates[0]] || [];
    const firstDateTimes = firstDateSlots.map(slot => slot.start).sort();
    
    // Vérifier que toutes les autres dates ont les mêmes créneaux
    for (let i = 1; i < selectedDates.length; i++) {
        const dateSlots = calendarSlots[selectedDates[i]] || [];
        const dateTimes = dateSlots.map(slot => slot.start).sort();
        
        // Comparer les tableaux de créneaux
        if (firstDateTimes.length !== dateTimes.length) return false;
        for (let j = 0; j < firstDateTimes.length; j++) {
            if (firstDateTimes[j] !== dateTimes[j]) return false;
        }
    }
    
    return true;
}

function getTimeSlotsForDate(dateKey) {
    return calendarSlots[dateKey] || [];
}

function getExistingTimeSlotsForSelectedDates() {
    const allSlots = [];
    
    selectedDates.forEach(date => {
        if (calendarSlots[date]) {
            calendarSlots[date].forEach(slot => {
                allSlots.push({
                    ...slot,
                    date: date
                });
            });
        }
    });
    
    return allSlots;
}

function handleTimeSlotClick(button) {
    const time = button.dataset.time;
    const slotId = button.dataset.slotId;
    const isActive = button.classList.contains('active');
    
    console.log(`🕒 Clic sur heure: ${time}, actif: ${isActive}, slotId: ${slotId}`);
    
    // Action directe : cliquer sur un créneau actif le supprime, cliquer sur un créneau inactif l'ajoute
    if (isActive) {
        console.log(`🗑️ Suppression de l'heure ${time} de toutes les dates sélectionnées`);
        // Supprimer directement sans confirmation
        deleteTimeSlotForSelectedDates(time, slotId);
    } else {
        console.log(`✅ Ajout de l'heure ${time} à toutes les dates sélectionnées`);
        // Si l'horaire n'est pas actif, l'ajouter instantanément
        addTimeSlotForSelectedDates(time);
    }
    
    // Mettre à jour immédiatement l'apparence du bouton
    button.classList.toggle('active');
    button.classList.toggle('selected');
    
    // Mettre à jour l'icône
    if (button.classList.contains('active')) {
        button.innerHTML = `${time} <i class="fas fa-check"></i>`;
    } else {
        button.innerHTML = time;
    }
}

function addTimeSlotForSelectedDates(time) {
    let addedCount = 0;
    
    selectedDates.forEach(date => {
        if (!calendarSlots[date]) calendarSlots[date] = [];
        
        // Vérifier si le créneau existe déjà
        const existingSlot = calendarSlots[date].find(slot => slot.start === time);
        if (!existingSlot) {
            const newSlot = {
                id: Date.now() + Math.random(),
                start: time,
                end: getNextHour(time),
                available: true,
                maxCapacity: 5
            };
            
            calendarSlots[date].push(newSlot);
            addedCount++;
        }
    });
    
    if (addedCount > 0) {
        saveCalendar();
        initCalendar();
        // Recharger les boutons pour mettre à jour l'affichage
        generateTimeSlotButtons();
        console.log(`✅ ${addedCount} créneau(x) ajouté(s) instantanément`);
    }
}

function deleteTimeSlotForSelectedDates(time, slotId) {
    let deletedCount = 0;
    
    console.log(`🔍 Recherche de créneaux à supprimer - Heure: ${time}, SlotId: ${slotId}`);
    console.log(`📅 Dates sélectionnées:`, selectedDates);
    
    // TOUJOURS utiliser la suppression par heure, pas par ID
    // Car chaque date a un ID différent pour la même heure
    selectedDates.forEach(date => {
        console.log(`📆 Vérification de la date: ${date}`);
        if (calendarSlots[date]) {
            console.log(`📋 Créneaux existants pour ${date}:`, calendarSlots[date]);
            
            // Supprimer tous les créneaux avec cette heure de début (IGNORER slotId)
            const initialCount = calendarSlots[date].length;
            calendarSlots[date] = calendarSlots[date].filter(slot => {
                const shouldKeep = slot.start !== time;
                if (!shouldKeep) {
                    console.log(`🗑️ Suppression du créneau:`, slot);
                }
                return shouldKeep;
            });
            deletedCount += (initialCount - calendarSlots[date].length);
            
            console.log(`📊 Après suppression pour ${date}:`, calendarSlots[date]);
        } else {
            console.log(`❌ Aucun créneau configuré pour ${date}`);
        }
    });
    
    if (deletedCount > 0) {
        saveCalendar();
        // Mettre à jour le calendrier IMMÉDIATEMENT pour refléter les changements visuels
        initCalendar();
        // Recharger les boutons pour mettre à jour l'affichage
        generateTimeSlotButtons();
        // Notification silencieuse dans la console
        console.log(`🗑️ ${deletedCount} créneau(x) supprimé(s) instantanément de ${selectedDates.length} date(s)`);
        console.log('📅 Calendrier mis à jour en temps réel');
    } else {
        console.log('ℹ️ Aucun créneau trouvé à supprimer');
        console.log('🔍 Détails du problème:');
        console.log('- Heure recherchée:', time);
        console.log('- Dates vérifiées:', selectedDates);
        console.log('- État des créneaux:', calendarSlots);
    }
}

function toggleTimeSlot(button) {
    button.classList.toggle('selected');
}

function getSelectedTimeSlots() {
    const selectedButtons = document.querySelectorAll('.time-slot-admin-btn.selected');
    return Array.from(selectedButtons).map(btn => btn.dataset.time);
}

function closeEditPanel() {
    document.getElementById('edit-panel').classList.remove('active');
    document.body.classList.remove('edit-panel-active');
    // NE PAS désélectionner les dates automatiquement
    // Les dates restent sélectionnées pour permettre des modifications ultérieures
    console.log('📅 Panneau fermé - Les dates restent sélectionnées pour modifications futures');
}

function updateSelectedDatesList() {
    const list = document.getElementById('selected-dates-list');
    list.innerHTML = '';
    
    selectedDates.forEach(date => {
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
        
        const tag = document.createElement('span');
        tag.className = 'date-tag';
        tag.textContent = formattedDate;
        list.appendChild(tag);
    });
}

// Supprimé - Les modifications sont maintenant instantanées

function getNextHour(time) {
    const [hours, minutes] = time.split(':').map(Number);
    let nextHour = hours + 1;
    if (nextHour > 23) nextHour = 0;
    return `${String(nextHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function generateHourlySlots(startTime, endTime) {
    const slots = [];
    
    // Convertir les heures en minutes depuis minuit
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    
    // Générer des créneaux d'une heure
    for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += 60) {
        const slotStart = minutesToTime(currentMinutes);
        const slotEnd = minutesToTime(currentMinutes + 60);
        
        // Vérifier que le créneau ne dépasse pas l'heure de fin
        if (currentMinutes + 60 <= endMinutes) {
            slots.push({
                start: slotStart,
                end: slotEnd
            });
        }
    }
    
    return slots;
}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function updateTimeSlots() {
    const startTime = document.getElementById('slot-start-time').value;
    const endTime = document.getElementById('slot-end-time').value;
    const availability = document.querySelector('input[name="availability"]:checked').value;
    
    if (!startTime || !endTime) {
        console.log('⚠️ Veuillez spécifier les heures de début et de fin');
        return;
    }
    
    if (startTime >= endTime) {
        console.log('⚠️ L\'heure de début doit être avant l\'heure de fin');
        return;
    }
    
    let updatedCount = 0;
    
    selectedDates.forEach(date => {
        if (calendarSlots[date]) {
            calendarSlots[date].forEach(slot => {
                slot.start = startTime;
                slot.end = endTime;
                slot.available = availability === 'available';
                updatedCount++;
            });
        }
    });
    
    if (updatedCount > 0) {
        saveCalendar();
        initCalendar();
        closeEditPanel();
        console.log(`✅ ${updatedCount} créneau(x) modifié(s)`);
    } else {
        console.log('ℹ️ Aucun créneau trouvé pour les dates sélectionnées');
    }
}

function deleteTimeSlots() {
    let deletedCount = 0;
    
    selectedDates.forEach(date => {
        if (calendarSlots[date] && calendarSlots[date].length > 0) {
            deletedCount += calendarSlots[date].length;
            calendarSlots[date] = [];
        }
    });
    
    if (deletedCount > 0) {
        saveCalendar();
        initCalendar();
        closeEditPanel();
        console.log(`🗑️ ${deletedCount} créneau(x) supprimé(s)`);
    } else {
        console.log('ℹ️ Aucun créneau trouvé pour les dates sélectionnées');
    }
}

// ========================================
// FONCTIONNALITÉS AVANCÉES ADMIN
// ========================================

/**
 * Vérifie les conflits d'horaires pour une date donnée
 * @param {string} dateKey - Date au format YYYY-MM-DD
 * @param {string} startTime - Heure de début
 * @param {string} endTime - Heure de fin
 * @returns {Array} - Liste des créneaux en conflit
 */
function checkTimeSlotConflicts(dateKey, startTime, endTime) {
    const slots = calendarSlots[dateKey] || [];
    const conflicts = [];
    
    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);
    
    slots.forEach(slot => {
        const slotStart = timeToMinutes(slot.start);
        const slotEnd = timeToMinutes(slot.end);
        
        // Vérifier si les créneaux se chevauchent
        if ((newStart < slotEnd && newEnd > slotStart)) {
            conflicts.push(slot);
        }
    });
    
    return conflicts;
}

/**
 * Génère automatiquement des créneaux pour une plage horaire
 * @param {string} startTime - Heure de début
 * @param {string} endTime - Heure de fin
 * @param {number} duration - Durée des créneaux en minutes
 * @returns {Array} - Liste des créneaux générés
 */
function generateTimeSlots(startTime, endTime, duration = 60) {
    const slots = [];
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    
    for (let current = startMinutes; current < endMinutes; current += duration) {
        const slotStart = minutesToTime(current);
        const slotEnd = minutesToTime(current + duration);
        
        // Vérifier que le créneau ne dépasse pas l'heure de fin
        if (current + duration <= endMinutes) {
            slots.push({
                start: slotStart,
                end: slotEnd,
                duration: duration
            });
        }
    }
    
    return slots;
}

/**
 * Exporte les réservations vers Google Sheets (simulation)
 */
function exportToGoogleSheets() {
    if (bookings.length === 0) {
        alert('Aucune réservation à exporter');
        return;
    }
    
    // Simuler l'export vers Google Sheets
    const sheetData = bookings.map(booking => ({
        'ID': booking.id,
        'Prénom': booking.client.prenom,
        'Nom': booking.client.nom,
        'Email': booking.client.email,
        'Téléphone': booking.client.telephone,
        'Service': booking.serviceName,
        'Date': booking.date,
        'Heure': booking.time,
        'Prix': booking.price,
        'Statut': booking.status,
        'Adresse': booking.client.adresse,
        'Message': booking.client.message || '',
        'Créé le': new Date(booking.createdAt).toLocaleString('fr-FR')
    }));
    
    // Afficher les données formatées pour Google Sheets
    const csvContent = convertToCSV(sheetData);
    
    // Télécharger le fichier CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reservations_zen_reunion_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    alert(`✅ ${bookings.length} réservation(s) exportée(s) vers Google Sheets (fichier CSV téléchargé)`);
}

/**
 * Convertit les données en format CSV
 * @param {Array} data - Données à convertir
 * @returns {string} - Contenu CSV
 */
function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            // Échapper les virgules et guillemets
            return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

/**
 * Affiche les statistiques détaillées
 */
function showDetailedStats() {
    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        rejected: bookings.filter(b => b.status === 'rejected').length,
        
        // Statistiques par service
        byService: {},
        
        // Revenus
        revenue: {
            total: bookings.reduce((sum, b) => sum + (b.status === 'confirmed' ? b.price : 0), 0),
            pending: bookings.reduce((sum, b) => sum + (b.status === 'pending' ? b.price : 0), 0),
            confirmed: bookings.reduce((sum, b) => sum + (b.status === 'confirmed' ? b.price : 0), 0)
        },
        
        // Statistiques temporelles
        byMonth: {},
        byDayOfWeek: {}
    };
    
    // Calculer les statistiques par service
    bookings.forEach(booking => {
        if (!stats.byService[booking.serviceName]) {
            stats.byService[booking.serviceName] = {
                total: 0,
                confirmed: 0,
                revenue: 0
            };
        }
        
        stats.byService[booking.serviceName].total++;
        if (booking.status === 'confirmed') {
            stats.byService[booking.serviceName].confirmed++;
            stats.byService[booking.serviceName].revenue += booking.price;
        }
    });
    
    // Afficher les statistiques détaillées
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="stats-details">
            <h3>📊 Statistiques Détaillées</h3>
            
            <div class="stats-grid-detailed">
                <div class="stat-card-detailed">
                    <div class="stat-icon-detailed total">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.total}</div>
                        <div class="stat-label">Total Réservations</div>
                    </div>
                </div>
                
                <div class="stat-card-detailed">
                    <div class="stat-icon-detailed confirmed">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.confirmed}</div>
                        <div class="stat-label">Confirmées</div>
                    </div>
                </div>
                
                <div class="stat-card-detailed">
                    <div class="stat-icon-detailed pending">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.pending}</div>
                        <div class="stat-label">En Attente</div>
                    </div>
                </div>
                
                <div class="stat-card-detailed">
                    <div class="stat-icon-detailed revenue">
                        <i class="fas fa-euro-sign"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value">${stats.revenue.confirmed}€</div>
                        <div class="stat-label">Revenus Confirmés</div>
                    </div>
                </div>
            </div>
            
            <div class="service-stats">
                <h4>📋 Par Service</h4>
                ${Object.entries(stats.byService).map(([service, data]) => `
                    <div class="service-stat-item">
                        <strong>${service}</strong>
                        <div class="service-stat-details">
                            <span>${data.confirmed}/${data.total} confirmées</span>
                            <span class="revenue">${data.revenue}€</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="export-actions">
                <button class="btn btn-primary" onclick="exportToCSV()">
                    <i class="fas fa-file-csv"></i> Exporter CSV
                </button>
                <button class="btn btn-success" onclick="exportToGoogleSheets()">
                    <i class="fas fa-table"></i> Exporter Google Sheets
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('details-modal').classList.add('active');
}

/**
 * Recherche avancée dans les réservations
 */
function advancedSearch() {
    const searchTerm = prompt('Rechercher (nom, email, service, date) :');
    if (!searchTerm) return;
    
    const filteredBookings = bookings.filter(booking => 
        booking.client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.date.includes(searchTerm) ||
        booking.time.includes(searchTerm)
    );
    
    if (filteredBookings.length === 0) {
        alert('Aucune réservation trouvée pour cette recherche');
        return;
    }
    
    // Afficher les résultats
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3>🔍 Résultats de recherche : "${searchTerm}"</h3>
        <p>${filteredBookings.length} réservation(s) trouvée(s)</p>
        
        <div class="search-results">
            ${filteredBookings.map(booking => `
                <div class="search-result-item">
                    <div class="result-header">
                        <strong>${booking.client.prenom} ${booking.client.nom}</strong>
                        <span class="status-badge ${booking.status}">${booking.status}</span>
                    </div>
                    <div class="result-details">
                        <span>${booking.serviceName}</span>
                        <span>${booking.date} à ${booking.time}</span>
                        <span>${booking.price}€</span>
                    </div>
                    <div class="result-actions">
                        <button class="btn btn-sm btn-secondary" onclick="showBookingDetails(${booking.id}); closeModal();">
                            <i class="fas fa-eye"></i> Détails
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('details-modal').classList.add('active');
}

// ========================================
// SUPPRESSION DES LOGS ET RÉINITIALISATION
// ========================================
function clearAllBookings() {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer TOUTES les réservations ? Cette action est irréversible.')) {
        return;
    }

    // Supprimer toutes les réservations
    localStorage.removeItem('bookings');
    bookings = [];
    
    // Réinitialiser le calendrier
    calendarSlots = {};
    localStorage.removeItem('calendarSlots');
    selectedDates = [];
    
    // Mettre à jour l'affichage
    renderStats();
    renderBookingsTable();
    initCalendar();
    
    // Synchroniser avec le système de réservation
    synchronizeWithBookingSystem();
    
    alert('🗑️ Toutes les réservations ont été supprimées et le calendrier a été réinitialisé.');
    console.log('🔄 Système réinitialisé à zéro');
}

function clearOldBookings() {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 1); // Supprimer les réservations de plus d'un mois
    
    const oldBookings = bookings.filter(b => new Date(b.createdAt) < cutoffDate);
    
    if (oldBookings.length === 0) {
        alert('Aucune réservation ancienne à supprimer.');
        return;
    }
    
    if (!confirm(`Supprimer ${oldBookings.length} réservation(s) de plus d'un mois ?`)) {
        return;
    }
    
    // Garder uniquement les réservations récentes
    bookings = bookings.filter(b => new Date(b.createdAt) >= cutoffDate);
    saveBookings();
    
    // Mettre à jour l'affichage
    renderStats();
    renderBookingsTable();
    synchronizeWithBookingSystem();
    
    alert(`🗑️ ${oldBookings.length} réservation(s) ancienne(s) supprimée(s).`);
}

// Initialiser le calendrier au chargement
initCalendar();

// Forcer le rechargement des indicateurs après le chargement initial
setTimeout(() => {
    console.log('🔄 Rechargement des indicateurs de rendez-vous...');
    initCalendar(); // Recharger le calendrier pour afficher tous les indicateurs
}, 100);

// ========================================
// CONSOLE LOG
// ========================================
console.log('📊 Tableau de bord admin chargé');
console.log(`📅 ${bookings.length} réservation(s) dans la base de données`);
console.log(`🗓 ${Object.keys(calendarSlots).length} jour(s) avec créneaux configurés`);
