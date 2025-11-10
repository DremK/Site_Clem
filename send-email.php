<?php
// ========================================
// SCRIPT PHP POUR L'ENVOI D'EMAILS
// ========================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
    exit;
}

// Récupérer les données JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Données JSON invalides']);
    exit;
}

// Valider les données requises
$required = ['to_email', 'to_name', 'service_name', 'booking_date', 'booking_time'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Champ manquant: $field"]);
        exit;
    }
}

try {
    // Configuration de l'email
    $to = $data['to_email'];
    $subject = "[Zen Réunion] Confirmation de votre réservation #" . ($data['booking_id'] ?? 'N/A');
    
    // Construire le message HTML
    $message = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6B9D, #FF5589); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-item { margin: 10px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Zen Réunion</h1>
                <p>Votre réservation est confirmée !</p>
            </div>
            <div class='content'>
                <h2>Bonjour {$data['to_name']},</h2>
                <p>Votre réservation a bien été enregistrée ! Voici le récapitulatif :</p>
                
                <div class='details'>
                    <h3>📅 Détails de votre réservation</h3>
                    <div class='detail-item'><strong>Service :</strong> {$data['service_name']}</div>
                    <div class='detail-item'><strong>Date :</strong> {$data['booking_date']}</div>
                    <div class='detail-item'><strong>Heure :</strong> {$data['booking_time']}</div>
                    <div class='detail-item'><strong>Durée :</strong> {$data['booking_duration']}</div>
                    <div class='detail-item'><strong>Prix :</strong> {$data['booking_price']}</div>
                    <div class='detail-item'><strong>Adresse :</strong> {$data['booking_address']}</div>
                    " . (!empty($data['booking_message']) ? "<div class='detail-item'><strong>Message :</strong> {$data['booking_message']}</div>" : "") . "
                </div>
                
                <p><strong>Important :</strong> Nous vous attendons à l'adresse indiquée. Pour toute modification ou annulation, merci de nous contacter au plus tard 24h avant votre rendez-vous.</p>
                
                <div class='footer'>
                    <p>Cordialement,<br>L'équipe Zen Réunion</p>
                    <p>📧 contact@zenreunion.re<br>📞 +262 692 12 34 56</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // En-têtes de l'email
    $headers = [
        'From: Zen Réunion <contact@zenreunion.re>',
        'Reply-To: contact@zenreunion.re',
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    // Envoyer l'email
    $mailSent = mail($to, $subject, $message, implode("\r\n", $headers));
    
    if ($mailSent) {
        // Envoyer également une notification au propriétaire
        $ownerSubject = "Nouvelle réservation - {$data['service_name']}";
        $ownerMessage = "
        Nouvelle réservation reçue :
        
        Client: {$data['to_name']}
        Email: {$data['to_email']}
        Téléphone: {$data['booking_phone']}
        
        Service: {$data['service_name']}
        Date: {$data['booking_date']}
        Heure: {$data['booking_time']}
        Prix: {$data['booking_price']}
        
        Adresse: {$data['booking_address']}
        " . (!empty($data['booking_message']) ? "Message: {$data['booking_message']}" : "");
        
        mail('contact@zenreunion.re', $ownerSubject, $ownerMessage);
        
        echo json_encode(['success' => true, 'message' => 'Email envoyé avec succès']);
    } else {
        throw new Exception('Erreur lors de l\'envoi de l\'email');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
