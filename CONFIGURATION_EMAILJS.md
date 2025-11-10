# Configuration EmailJS pour l'envoi automatique d'emails

## 📧 Configuration requise

Pour que le système d'envoi automatique d'emails fonctionne, vous devez configurer EmailJS avec vos identifiants.

### Étape 1 : Créer un compte EmailJS

1. Allez sur [EmailJS.com](https://www.emailjs.com/)
2. Créez un compte gratuit
3. Vérifiez votre adresse email

### Étape 2 : Configurer le service email

1. Dans votre dashboard EmailJS, allez dans "Email Services"
2. Ajoutez un nouveau service email (Gmail, Outlook, etc.)
3. Suivez les instructions pour connecter votre compte email

### Étape 3 : Créer les templates d'email

1. Allez dans "Email Templates"
2. Créez un nouveau template avec les variables suivantes :

**Template pour la confirmation client :**
- **Nom du template :** `template_booking_confirmation`
- **Variables disponibles :**
  - `to_email` - Email du client
  - `to_name` - Nom complet du client
  - `client_name` - Prénom du client
  - `service_name` - Nom du service
  - `booking_date` - Date de la réservation
  - `booking_time` - Heure de la réservation
  - `booking_duration` - Durée du service
  - `booking_price` - Prix du service
  - `booking_address` - Adresse de la prestation
  - `booking_phone` - Téléphone du client
  - `booking_message` - Message du client
  - `booking_id` - ID de la réservation
  - `company_name` - Zen Réunion
  - `company_email` - contact@zenreunion.re
  - `company_phone` - +262 692 12 34 56

**Template pour la notification propriétaire :**
- **Nom du template :** `template_owner_notification`
- **Variables disponibles :**
  - `to_email` - Email du propriétaire
  - `subject` - Sujet de l'email
  - `client_name` - Nom complet du client
  - `client_email` - Email du client
  - `client_phone` - Téléphone du client
  - `service_name` - Nom du service
  - `booking_date` - Date de la réservation
  - `booking_time` - Heure de la réservation
  - `booking_price` - Prix du service
  - `booking_address` - Adresse de la prestation
  - `booking_message` - Message du client
  - `booking_id` - ID de la réservation

### Étape 4 : Récupérer vos identifiants

1. Allez dans "Account" → "API Keys"
2. Copiez votre **Public Key**
3. Allez dans "Email Services" et copiez votre **Service ID**
4. Allez dans "Email Templates" et copiez vos **Template IDs**

### Étape 5 : Mettre à jour la configuration

Dans le fichier `js/email-service.js`, remplacez les valeurs par défaut :

```javascript
const EMAILJS_CONFIG = {
    SERVICE_ID: 'votre_service_id_ici', // Remplacez par votre Service ID
    TEMPLATE_ID: 'votre_template_id_ici', // Remplacez par votre Template ID
    PUBLIC_KEY: 'votre_public_key_ici' // Remplacez par votre Public Key
};
```

## 🔧 Test du système

Une fois configuré, le système fonctionnera comme suit :

1. **Envoi automatique** : Lorsqu'une réservation est confirmée, un email est envoyé automatiquement au client
2. **Notification propriétaire** : Une notification est envoyée au propriétaire du site
3. **Système de secours** : Si EmailJS échoue, un bouton s'affiche pour ouvrir le client email avec le message pré-rempli

## 🛠️ Dépannage

### Problèmes courants :

1. **EmailJS non initialisé** : Vérifiez que votre Public Key est correcte
2. **Template non trouvé** : Vérifiez que le Template ID correspond exactement
3. **Service non connecté** : Vérifiez que votre service email est bien connecté dans EmailJS

### Logs de débogage :

Ouvrez la console du navigateur (F12) pour voir les logs :
- ✅ "Email envoyé automatiquement avec succès"
- ⚠️ "EmailJS a échoué, utilisation du système de secours"
- ❌ "Erreur lors de l'envoi automatique"

## 📋 Fonctionnalités implémentées

- ✅ Pop-up de confirmation avec détails de la réservation
- ✅ Envoi automatique d'email de confirmation au client
- ✅ Notification automatique au propriétaire
- ✅ Système de secours avec email pré-rempli
- ✅ Affichage du statut d'envoi dans la modal
- ✅ Validation des emails avant envoi

## 💡 Bonnes pratiques

1. **Testez toujours** avec une adresse email réelle
2. **Vérifiez les spams** si les emails n'arrivent pas
3. **Gardez vos identifiants EmailJS sécurisés**
4. **Mettez à jour les templates** selon vos besoins

Le système est maintenant prêt à envoyer des emails automatiques de confirmation de réservation !
