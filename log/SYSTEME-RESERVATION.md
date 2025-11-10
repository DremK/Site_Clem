# 🎟️ Système de Réservation Type BilletWeb - Documentation Complète

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Fonctionnalités](#fonctionnalités)
3. [Architecture](#architecture)
4. [Utilisation](#utilisation)
5. [Interface Administrateur](#interface-administrateur)
6. [Phase 2 - Intégration Backend](#phase-2---intégration-backend)
7. [Personnalisation](#personnalisation)

---

## Vue d'ensemble

### Description
Système de réservation moderne intégré directement au site, inspiré de **BilletWeb**. Interface épurée et intuitive permettant aux clients de réserver en ligne et au praticien de gérer les réservations via un tableau de bord admin.

### Design
- **Style** : Minimaliste, moderne, rose pastel
- **Responsive** : 100% adapté mobile/tablette/desktop
- **UX** : Parcours fluide en 4 étapes

---

## Fonctionnalités

### Côté Client (booking.html)

#### 1. Sélection du Service
- Liste déroulante des massages disponibles
- Affichage du prix et de la durée
- Image de prévisualisation

#### 2. Calendrier Interactif
**Fonctionnalités :**
- Navigation mois par mois
- Visualisation des jours disponibles/indisponibles
- Désactivation automatique des dates passées
- Marquage visuel du jour sélectionné
- Jours actuels mis en évidence

**Contrôles :**
- Boutons "Mois précédent" / "Mois suivant"
- Clic sur un jour pour sélection
- Format : Lundi à Dimanche

#### 3. Créneaux Horaires
**Plages disponibles :**
- Matin : 09h00 - 11h30 (par tranches de 30 min)
- Après-midi : 14h00 - 18h00 (par tranches de 30 min)

**États des créneaux :**
- ✅ Disponible : clic possible
- ❌ Réservé : grisé, barré
- 🔵 Sélectionné : surligné en rose

**Gestion intelligente :**
- Vérification automatique des créneaux déjà réservés
- Mise à jour en temps réel
- Blocage des heures passées le jour même

#### 4. Formulaire Client
**Champs obligatoires :**
- Prénom
- Nom
- Email
- Téléphone

**Champs optionnels :**
- Message (besoins particuliers)

**Validation :**
- Format email vérifié
- Tous les champs requis contrôlés

#### 5. Résumé en Temps Réel
**Affichage :**
- Image du service
- Nom et durée
- Date formatée (ex: "Lundi 6 novembre 2024")
- Heure sélectionnée
- Prix total

**Mise à jour dynamique :**
- Actualisation à chaque changement
- Bouton "Procéder au paiement" activé uniquement si tout est rempli

#### 6. Confirmation
**Modal de succès :**
- Icône de validation
- Récapitulatif complet
- Message explicatif
- Statut : "En attente de validation"

---

### Côté Administrateur (admin.html)

#### 1. Tableau de Bord
**Statistiques en temps réel :**
- 📊 En attente
- ✅ Confirmées
- ❌ Refusées
- 📅 Total

**Design :**
- Cartes colorées avec icônes
- Chiffres grand format
- Mise à jour dynamique

#### 2. Gestion des Réservations
**Vue tableau :**
- ID de réservation
- Informations client (nom, email)
- Service et détails
- Date et heure
- Prix
- Statut (badge coloré)
- Actions

**Filtres :**
- Toutes les réservations
- En attente uniquement
- Confirmées uniquement
- Refusées uniquement

**Actions disponibles :**
- ✅ **Accepter** : change le statut en "confirmée"
- ❌ **Refuser** : change le statut en "refusée"
- 👁️ **Voir détails** : modal avec toutes les informations

#### 3. Modal Détails
**Informations complètes :**
- ID unique
- Toutes les infos client
- Service complet
- Date, heure, durée, prix
- Statut actuel
- Message du client (si présent)
- Date de création

**Actions rapides :**
- Accepter/Refuser directement depuis la modal

#### 4. Fonctionnalités Admin
- ✅ Actualisation manuelle (bouton refresh)
- ✅ Confirmation avant acceptation/refus
- ✅ Notifications console
- 🔄 Sauvegarde automatique dans localStorage

---

## Architecture

### Structure des Fichiers

```
Site_Clement/
├── booking.html              # Page de réservation client
├── admin.html                # Tableau de bord administrateur
├── index.html                # Page d'accueil (liens vers booking)
├── css/
│   ├── style.css             # Styles du site principal
│   └── booking.css           # Styles de la réservation
├── js/
│   ├── script.js             # Scripts site principal
│   ├── booking.js            # Logique de réservation
│   └── admin.js              # Logique admin
└── assets/
    └── images/               # Images des services
```

### Fichiers Créés

#### 1. booking.html
Interface de réservation moderne avec :
- Header simple avec retour au site
- Layout 2 colonnes (sélection + résumé)
- Calendrier interactif
- Grille de créneaux horaires
- Formulaire client
- Modal de confirmation

#### 2. booking.css
Design complet :
- Variables CSS (couleurs, espacements)
- Styles du calendrier
- Styles des créneaux
- Responsive design
- Animations subtiles
- Modal

#### 3. booking.js
Logique complète :
- État de réservation global
- Génération du calendrier
- Gestion des créneaux
- Validation formulaire
- Sauvegarde localStorage
- Paramètres URL (service présélectionné)

#### 4. admin.html
Tableau de bord :
- Header avec stats
- Tableau de réservations
- Système de filtres
- Modal détails
- Actions accepter/refuser

#### 5. admin.js
Logique admin :
- Chargement des réservations
- Calcul des statistiques
- Filtres dynamiques
- Mise à jour des statuts
- Export CSV (fonction prête)

---

## Utilisation

### Pour le Client

#### 1. Accéder à la réservation
**Depuis la page d'accueil :**
- Cliquer sur "Réserver ma séance" (hero)
- Cliquer sur un bouton "Réserver" d'une carte de massage

**Direct :**
- Aller sur `booking.html`

#### 2. Réserver en 4 étapes

**Étape 1 : Choisir le service**
- Ouvrir la liste déroulante "Type de massage"
- Sélectionner le massage désiré
- → Le résumé s'affiche à droite

**Étape 2 : Sélectionner la date**
- Naviguer dans le calendrier si nécessaire
- Cliquer sur le jour souhaité
- → Les créneaux horaires apparaissent

**Étape 3 : Choisir l'heure**
- Cliquer sur un créneau disponible (non grisé)
- → Le formulaire client s'affiche en dessous

**Étape 4 : Remplir les informations**
- Saisir prénom, nom, email, téléphone
- (Optionnel) Ajouter un message
- Cliquer sur "Procéder au paiement"
- → Modal de confirmation s'affiche

**Confirmation :**
- Un email sera envoyé une fois validé par le praticien
- La réservation est en attente

---

### Pour l'Administrateur

#### 1. Accéder au tableau de bord
- Aller directement sur `admin.html`
- (Ajoutez un lien protégé par mot de passe en production)

#### 2. Consulter les statistiques
- Visualiser le nombre de réservations en attente
- Suivre les confirmations/refus
- Vue d'ensemble du total

#### 3. Gérer les réservations

**Filtrer :**
- Cliquer sur "En attente" pour voir uniquement les nouvelles demandes
- Utiliser les autres filtres selon besoin

**Accepter une réservation :**
1. Cliquer sur "Accepter" (bouton vert)
2. Confirmer dans la popup
3. → Statut change en "Confirmée"
4. → Email envoyé au client (simulation)

**Refuser une réservation :**
1. Cliquer sur "Refuser" (bouton rouge)
2. Confirmer dans la popup
3. → Statut change en "Refusée"
4. → Email envoyé au client (simulation)

**Voir les détails :**
1. Cliquer sur "Détails" pour les réservations déjà traitées
2. → Modal avec toutes les informations
3. Possibilité d'accepter/refuser depuis la modal

#### 4. Actualiser les données
- Cliquer sur "Actualiser" en haut à droite
- → Recharge les réservations depuis localStorage

---

## Stockage des Données

### Actuellement : localStorage

**Objet réservation :**
```json
{
  "id": 1730886543210,
  "service": "massage-relaxant",
  "serviceName": "Massage Relaxant",
  "date": "2024-11-15",
  "time": "14:30",
  "price": 55,
  "duration": 60,
  "client": {
    "prenom": "Marie",
    "nom": "Dubois",
    "email": "marie.dubois@example.com",
    "telephone": "+262 692 12 34 56",
    "message": "Première fois, un peu stressée"
  },
  "status": "pending",
  "createdAt": "2024-11-06T10:15:43.210Z",
  "updatedAt": "2024-11-06T10:15:43.210Z"
}
```

**Clé localStorage :** `bookings`

**Limitation :**
- Stockage local au navigateur
- Pas de synchronisation entre appareils
- Effacé si on vide le cache

**⚠️ En production, remplacer par une vraie base de données (voir Phase 2)**

---

## Phase 2 - Intégration Backend

### Objectifs
1. ✅ Paiement en ligne (Stripe)
2. ✅ Base de données réelle
3. ✅ Notifications email automatiques
4. ✅ Synchronisation Google Calendar
5. ✅ API REST
6. ✅ SMS (optionnel)

### Étapes d'implémentation

#### 1. Backend Node.js/Express

**Installation :**
```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv stripe nodemailer googleapis
```

**Structure :**
```
backend/
├── server.js
├── .env
├── routes/
│   ├── bookings.js
│   └── payments.js
├── controllers/
│   ├── bookingController.js
│   └── paymentController.js
└── services/
    ├── stripeService.js
    ├── emailService.js
    └── calendarService.js
```

#### 2. Base de Données (PostgreSQL)

**Schéma :**
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  service VARCHAR(100) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER NOT NULL,

  client_prenom VARCHAR(100) NOT NULL,
  client_nom VARCHAR(100) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_telephone VARCHAR(20) NOT NULL,
  client_message TEXT,

  status VARCHAR(50) DEFAULT 'pending',
  stripe_session_id VARCHAR(255),
  stripe_payment_id VARCHAR(255),
  google_event_id VARCHAR(255),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(client_email);
```

#### 3. API Routes

**GET /api/bookings**
- Récupérer toutes les réservations (admin)
- Filtres possibles : status, date

**POST /api/bookings**
- Créer une nouvelle réservation
- Retourne l'ID et les détails

**GET /api/bookings/:id**
- Récupérer une réservation spécifique

**PATCH /api/bookings/:id/status**
- Mettre à jour le statut (admin)
- Accepter ou refuser

**POST /api/create-checkout-session**
- Créer une session Stripe
- Retourne l'URL de paiement

**POST /api/webhooks/stripe**
- Recevoir les confirmations de paiement
- Met à jour le statut automatiquement

**GET /api/available-slots**
- Récupérer les créneaux disponibles pour une date
- Exclut les créneaux déjà réservés

#### 4. Intégration Stripe

**Frontend (booking.js) :**
```javascript
async function processStripePayment(booking) {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });

  const { sessionId } = await response.json();

  const stripe = Stripe('pk_live_...');
  await stripe.redirectToCheckout({ sessionId });
}
```

**Backend (services/stripeService.js) :**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(booking) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: booking.serviceName,
          description: `${booking.date} à ${booking.time}`,
        },
        unit_amount: booking.price * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/booking.html`,
    metadata: {
      bookingId: booking.id,
    },
  });

  return session;
}
```

**Webhook :**
```javascript
app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;

    // Mettre à jour la réservation
    await updateBookingStatus(bookingId, 'confirmed');

    // Envoyer email
    await sendConfirmationEmail(bookingId);

    // Ajouter à Google Calendar
    await addToGoogleCalendar(bookingId);
  }

  res.json({ received: true });
});
```

#### 5. Notifications Email

**Service Resend :**
```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendConfirmationEmail(booking) {
  await resend.emails.send({
    from: 'Zen Réunion <noreply@zenreunion.re>',
    to: booking.client.email,
    subject: '✅ Réservation confirmée',
    html: `
      <h1>Bonjour ${booking.client.prenom},</h1>
      <p>Votre réservation est confirmée !</p>
      <ul>
        <li>Service : ${booking.serviceName}</li>
        <li>Date : ${booking.date}</li>
        <li>Heure : ${booking.time}</li>
      </ul>
      <p>À bientôt !</p>
    `
  });
}

async function sendRejectionEmail(booking) {
  await resend.emails.send({
    from: 'Zen Réunion <noreply@zenreunion.re>',
    to: booking.client.email,
    subject: 'Votre réservation',
    html: `
      <p>Malheureusement, le créneau demandé n'est plus disponible.</p>
      <p>Nous vous invitons à choisir un autre horaire.</p>
    `
  });
}
```

#### 6. Google Calendar Integration

```javascript
const { google } = require('googleapis');

async function addToGoogleCalendar(booking) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: `${booking.serviceName} - ${booking.client.prenom} ${booking.client.nom}`,
    description: `
      Client: ${booking.client.prenom} ${booking.client.nom}
      Email: ${booking.client.email}
      Téléphone: ${booking.client.telephone}
      Prix: ${booking.price}€
    `,
    start: {
      dateTime: `${booking.date}T${booking.time}:00`,
      timeZone: 'Indian/Reunion',
    },
    end: {
      dateTime: calculateEndTime(booking),
      timeZone: 'Indian/Reunion',
    },
    attendees: [{ email: booking.client.email }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 60 },
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    resource: event,
  });

  return response.data.id;
}
```

#### 7. Mise à Jour Frontend

**Remplacer localStorage par API :**

```javascript
// Dans booking.js
async function saveBooking(booking) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });

  const savedBooking = await response.json();
  return savedBooking;
}

// Dans admin.js
async function loadBookings() {
  const response = await fetch('/api/bookings');
  bookings = await response.json();
}

async function updateBookingStatus(bookingId, newStatus) {
  const response = await fetch(`/api/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });

  return await response.json();
}
```

---

## Personnalisation

### Modifier les Créneaux Horaires

**Fichier :** `js/booking.js`

```javascript
// Ligne ~35
const availableSlots = [
    { time: '09:00', minutes: 540 },
    { time: '09:30', minutes: 570 },
    // ... Ajouter/retirer des créneaux
];
```

### Modifier les Services

**Fichier :** `js/booking.js`

```javascript
// Ligne ~17
const services = {
    'nouveau-service': {
        name: 'Nouveau Massage',
        price: 90,
        duration: 120,
        image: 'assets/images/nouveau.jpg',
        description: 'Description'
    }
};
```

**Et dans :** `booking.html`

```html
<option value="nouveau-service" data-price="90" data-duration="120">
    Nouveau Massage
</option>
```

### Modifier les Couleurs

**Fichier :** `css/booking.css`

```css
:root {
    --primary-color: #FF6B9D;  /* Rose principal */
    --primary-hover: #FF5589;  /* Rose hover */
    --success: #48BB78;        /* Vert succès */
    --danger: #F56565;         /* Rouge danger */
    /* ... */
}
```

---

## Améliorations Futures

### Fonctionnalités Additionnelles
1. **Rappels automatiques** : Email/SMS 24h avant
2. **Annulation en ligne** : Lien dans l'email de confirmation
3. **Reprogrammation** : Modifier sa réservation
4. **Carte de fidélité** : Points à chaque réservation
5. **Notes et avis** : Après la séance
6. **Upload de photos** : Galerie des réalisations
7. **Multi-praticien** : Gestion de plusieurs thérapeutes
8. **Packages** : Offres combinées
9. **Codes promo** : Réductions
10. **Export PDF** : Facture/reçu

### Sécurité
- Authentification admin (login/mot de passe)
- Protection CSRF
- Rate limiting
- Validation côté serveur
- Sanitization des inputs
- HTTPS obligatoire

---

## Support & Maintenance

### Bugs Connus
- ✅ Aucun bug connu actuellement

### Dépendances
- Font Awesome 6.4.0 (icônes)
- Google Fonts (Inter, Playfair Display)

### Compatibilité Navigateurs
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

**Développé avec ❤️ pour Zen Réunion**

*Version : 1.0*
*Date : Novembre 2024*
