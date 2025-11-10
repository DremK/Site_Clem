# 📚 Documentation Complète - Site Massage Zen Réunion

---

## 📑 Table des matières

1. [Description du Projet](#description-du-projet)
2. [Installation et Configuration](#installation-et-configuration)
3. [Personnalisation](#personnalisation)
4. [Guide des Images](#guide-des-images)
5. [Phase 2 - Backend & Fonctionnalités Avancées](#phase-2---backend--fonctionnalités-avancées)
6. [Déploiement](#déploiement)
7. [Résolution de Problèmes](#résolution-de-problèmes)

---

## Description du Projet

### Vue d'ensemble
Site web OnePage moderne pour la promotion et la réservation de séances de massage à l'Île de la Réunion. Le design s'inspire de la beauté naturelle de l'île avec une palette de couleurs tropicales apaisantes.

### Fonctionnalités Actuelles ✅
- Design responsive (mobile, tablette, desktop)
- Navigation smooth avec liens d'ancrage
- Présentation des différents types de massage
- Formulaire de réservation interactif
- Récapitulatif dynamique de la réservation
- Section contact avec carte Google Maps
- Animations au scroll
- Galerie photos
- Section "À propos"

### Design

**Palette de couleurs :**
- Vert tropical : `#2E8B57`
- Rose corail : `#F78DA7`
- Sable chaud : `#F2D0A9`
- Bleu lagon : `#00A0A0`
- Blanc cassé : `#FAF9F6`

**Typographies :**
- Titres : Playfair Display (élégant, naturel)
- Texte : Lato (lisible, moderne)

### Structure du Projet
```
Site_Clement/
├── index.html              # Page principale
├── css/
│   └── style.css          # Styles CSS
├── js/
│   └── script.js          # JavaScript
├── assets/
│   └── images/            # Images du site
└── log/                   # Documentation
    └── DOCUMENTATION.md   # Ce fichier
```

---

## Installation et Configuration

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- (Optionnel) Un serveur web local pour le développement

### Démarrage Rapide

1. **Ouvrir le site** :
   - Double-cliquez sur `index.html`
   - OU utilisez un serveur local :
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js
   npx http-server

   # PHP
   php -S localhost:8000
   ```

2. **Accéder au site** :
   - Directement : ouvrir `index.html`
   - Avec serveur : `http://localhost:8000`

---

## Personnalisation

### 1. Modifier les Coordonnées

**Fichier :** `index.html`

**Section Contact (ligne ~370)** :
```html
<!-- Cherchez : Section 5: Contact & Localisation -->
<div class="contact-item">
    <h3>Adresse</h3>
    <p>12 Rue des Palmiers<br>97410 Saint-Pierre<br>Île de la Réunion</p>
</div>
```

Modifiez :
- Adresse
- Téléphone
- Email
- Horaires d'ouverture

### 2. Personnaliser les Massages

**Section Nos Massages (ligne ~65)** :
```html
<!-- Cherchez : Section 2: Nos Massages -->
<h3 class="massage-title">Massage Relaxant</h3>
<p class="massage-description">...</p>
<span class="massage-duration">60 min</span>
<span class="massage-price">55€</span>
```

**Important :** Si vous modifiez un massage, mettez aussi à jour :
- Le formulaire de réservation (ligne ~260)
- L'attribut `data-massage`, `data-duration`, `data-price` sur les boutons

### 3. Modifier les Couleurs

**Fichier :** `css/style.css`

**Variables CSS (ligne ~5)** :
```css
:root {
    --color-vert-tropical: #2E8B57;
    --color-rose-corail: #F78DA7;
    --color-sable-chaud: #F2D0A9;
    --color-bleu-lagon: #00A0A0;
    --color-blanc-casse: #FAF9F6;
}
```

### 4. Personnaliser la Carte Google Maps

1. Allez sur [Google Maps](https://www.google.com/maps)
2. Cherchez votre adresse
3. Cliquez sur "Partager" > "Intégrer une carte"
4. Copiez le code iframe
5. Remplacez dans `index.html` (section Contact, ligne ~388)

### 5. Texte "À Propos"

**Section À Propos (ligne ~415)** :
```html
<!-- Cherchez : Section 6: À Propos -->
<p>Depuis plus de 10 ans, nous accompagnons...</p>
```

Personnalisez votre histoire et votre philosophie.

---

## Guide des Images

### Images Nécessaires

Placez ces images dans `assets/images/` :

| Fichier | Dimensions | Usage |
|---------|-----------|-------|
| `hero-bg.jpg` | 1920x1080px | Fond section d'accueil |
| `massage-relaxant.jpg` | 600x400px | Carte massage relaxant |
| `massage-sportif.jpg` | 600x400px | Carte massage sportif |
| `massage-huiles.jpg` | 600x400px | Carte massage huiles |
| `massage-duo.jpg` | 600x400px | Carte massage duo |
| `gallery-1.jpg` à `gallery-4.jpg` | 800x600px | Galerie photos |
| `praticien.jpg` | 600x800px | Photo praticien |

### Sources d'Images Gratuites

- [Unsplash](https://unsplash.com/) - Haute qualité
- [Pexels](https://www.pexels.com/) - Variété
- [Pixabay](https://pixabay.com/) - Libre de droits

**Mots-clés de recherche :**
- "spa massage"
- "tropical massage"
- "wellness spa"
- "reunion island"
- "essential oils"
- "zen spa"

### Optimisation des Images

**Avant d'ajouter vos images, optimisez-les :**

**Outils en ligne :**
- [TinyPNG](https://tinypng.com/)
- [Squoosh](https://squoosh.app/)
- [Compressor.io](https://compressor.io/)

**Tailles recommandées :**
- hero-bg.jpg : ~200-300 KB
- Cartes massage : ~80-120 KB
- Galerie : ~100-150 KB
- Praticien : ~100-150 KB

**Format :** JPG pour les photos, PNG pour les logos/transparence

---

## Phase 2 - Backend & Fonctionnalités Avancées

### Vue d'ensemble

La Phase 2 transforme la maquette en site fonctionnel avec :
- ✅ Réservations en ligne
- ✅ Paiement sécurisé (Stripe)
- ✅ Synchronisation Google Calendar
- ✅ Notifications email/SMS

**Durée estimée :** 2-3 semaines
**Budget estimé :** 1500-3000€ (si vous engagez un développeur)

---

### Stack Technique Recommandée

```
Backend : Node.js + Express
Base de données : PostgreSQL
Paiement : Stripe
Email : Resend ou SendGrid
SMS : Twilio (optionnel)
Calendar : Google Calendar API
Hébergement : Vercel / Render
```

---

### Étape 1 : Configuration des Services

#### A. Stripe (Paiement)
1. Créer un compte sur https://stripe.com/
2. Récupérer les clés API (test et production)
3. Configurer les webhooks

#### B. Google Calendar
1. Créer un projet sur https://console.cloud.google.com/
2. Activer l'API Google Calendar
3. Créer des identifiants OAuth 2.0

#### C. Email/SMS
1. Créer un compte Resend (https://resend.com/)
2. Créer un compte Twilio pour SMS (optionnel)

---

### Étape 2 : Backend Node.js

#### Installation

```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv stripe nodemailer googleapis twilio
npm install --save-dev nodemon
```

#### Structure
```
backend/
├── server.js
├── .env
├── routes/
│   ├── booking.js
│   └── payment.js
├── services/
│   ├── stripeService.js
│   ├── calendarService.js
│   ├── emailService.js
│   └── smsService.js
└── models/
    └── Booking.js
```

#### Fichier .env
```env
PORT=3000
NODE_ENV=development

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Calendar
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
GOOGLE_CALENDAR_ID=...

# Email
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@zenreunion.re

# SMS (optionnel)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+262...

FRONTEND_URL=http://localhost:8000
```

---

### Étape 3 : Intégration Stripe

#### Service Stripe (backend)

```javascript
// backend/services/stripeService.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(bookingData) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: bookingData.massageType,
          description: `Massage du ${bookingData.date} à ${bookingData.heure}`,
        },
        unit_amount: bookingData.price * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/#reservation`,
    metadata: {
      bookingId: bookingData.id,
      customerEmail: bookingData.email,
    },
  });

  return session;
}

module.exports = { createCheckoutSession };
```

#### Frontend

```javascript
// js/script.js - Modifier le submit du formulaire
async function processPayment(formData) {
  try {
    const response = await fetch('http://localhost:3000/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const { sessionId } = await response.json();
    const stripe = Stripe('pk_test_...');
    await stripe.redirectToCheckout({ sessionId });
  } catch (error) {
    alert('Une erreur est survenue. Veuillez réessayer.');
  }
}
```

---

### Étape 4 : Google Calendar

```javascript
// backend/services/calendarService.js
const { google } = require('googleapis');

async function addEventToCalendar(bookingData) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: `${bookingData.massageType} - ${bookingData.prenom} ${bookingData.nom}`,
    description: `
      Client: ${bookingData.prenom} ${bookingData.nom}
      Email: ${bookingData.email}
      Téléphone: ${bookingData.telephone}
      Prix: ${bookingData.price}€
    `,
    start: {
      dateTime: `${bookingData.date}T${bookingData.heure}:00`,
      timeZone: 'Indian/Reunion',
    },
    end: {
      dateTime: calculateEndTime(bookingData),
      timeZone: 'Indian/Reunion',
    },
    attendees: [{ email: bookingData.email }],
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

  return response.data;
}

module.exports = { addEventToCalendar };
```

---

### Étape 5 : Notifications Email

```javascript
// backend/services/emailService.js
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendConfirmationEmail(bookingData) {
  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: bookingData.email,
    subject: '✅ Confirmation de votre réservation - Zen Réunion',
    html: `
      <h1>Bonjour ${bookingData.prenom},</h1>
      <p>Votre réservation a été confirmée !</p>
      <h2>Détails :</h2>
      <ul>
        <li>Massage : ${bookingData.massageType}</li>
        <li>Date : ${new Date(bookingData.date).toLocaleDateString('fr-FR')}</li>
        <li>Heure : ${bookingData.heure}</li>
        <li>Prix : ${bookingData.price}€</li>
      </ul>
      <p>À bientôt !<br>L'équipe Zen Réunion</p>
    `,
  });
}

async function sendNotificationToOwner(bookingData) {
  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: 'votre-email@example.com',
    subject: '🔔 Nouvelle réservation',
    html: `
      <h1>Nouvelle réservation</h1>
      <ul>
        <li>Client : ${bookingData.prenom} ${bookingData.nom}</li>
        <li>Email : ${bookingData.email}</li>
        <li>Téléphone : ${bookingData.telephone}</li>
        <li>Massage : ${bookingData.massageType}</li>
        <li>Date : ${bookingData.date} à ${bookingData.heure}</li>
      </ul>
    `,
  });
}

module.exports = { sendConfirmationEmail, sendNotificationToOwner };
```

---

### Étape 6 : Workflow Complet

**Parcours utilisateur :**

1. Client remplit le formulaire
2. Frontend envoie les données au backend
3. Backend crée une session Stripe
4. Client est redirigé vers Stripe pour payer
5. Stripe webhook confirme le paiement
6. Backend :
   - Sauvegarde la réservation
   - Ajoute l'événement à Google Calendar
   - Envoie email au client
   - Envoie notification au praticien
   - (Optionnel) Envoie SMS

---

### Base de Données

**Schéma PostgreSQL :**

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  prenom VARCHAR(100) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  massage_type VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  heure TIME NOT NULL,
  duration INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  message TEXT,
  stripe_session_id VARCHAR(255),
  stripe_payment_id VARCHAR(255),
  google_event_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Tests Phase 2

**Checklist :**
- [ ] Formulaire de réservation (validation)
- [ ] Paiement Stripe mode test
- [ ] Ajout à Google Calendar
- [ ] Envoi d'emails
- [ ] Gestion des erreurs
- [ ] Responsive
- [ ] Performance

---

## Déploiement

### Option 1 : Netlify (Gratuit - Site statique)

**Méthode 1 : Drag & Drop**
1. Allez sur https://app.netlify.com/drop
2. Glissez-déposez le dossier du projet
3. Votre site est en ligne !

**Méthode 2 : CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 2 : Vercel (Gratuit)

```bash
npm install -g vercel
vercel
```

### Option 3 : GitHub Pages (Gratuit)

1. Créer un repo GitHub
2. Pusher le code
3. Aller dans Settings > Pages
4. Sélectionner la branch main
5. Site disponible à `username.github.io/repo-name`

### Avec Backend (Phase 2)

**Frontend :** Netlify ou Vercel
**Backend :** Render, Railway, ou Heroku
**Base de données :** Supabase, Railway, ou RDS

---

## Résolution de Problèmes

### Les images ne s'affichent pas

**Vérifiez :**
- Les images sont dans `assets/images/`
- Les noms de fichiers sont corrects (sensible à la casse)
- Format : JPG ou PNG

**Solution temporaire :**
Les images utilisent un fond de couleur si non trouvées

### Le formulaire ne fonctionne pas

**Vérifiez :**
- Console du navigateur (F12) pour les erreurs
- `script.js` est bien chargé
- Tous les champs requis sont remplis

### Problèmes de style

**Solutions :**
- Videz le cache : `Ctrl + F5`
- Vérifiez que `style.css` est lié dans `index.html`
- Inspectez l'élément (F12) pour voir les styles appliqués

### Navigation ne scroll pas

**Vérifiez :**
- `scroll-behavior: smooth` dans le CSS
- Les IDs des sections correspondent aux liens
- JavaScript est activé

---

## Support & Contact

**Pour toute question :**
1. Consultez d'abord cette documentation
2. Vérifiez la console (F12)
3. Contactez le développeur

---

## Changelog

**v1.0 - Novembre 2024**
- ✅ Création du site OnePage
- ✅ Design responsive
- ✅ Formulaire de réservation
- ✅ Animations au scroll
- ✅ Documentation complète

**v2.0 - À venir (Phase 2)**
- ⏳ Intégration Stripe
- ⏳ Google Calendar API
- ⏳ Notifications email/SMS
- ⏳ Backend Node.js
- ⏳ Base de données

---

**Développé avec ❤️ pour Zen Réunion**

*Documentation mise à jour : Novembre 2024*
