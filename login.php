<?php
session_start();

// Se già loggato, redirect ad admin
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: admin.php');
    exit;
}

// Configurazione database
require_once 'db_config.php';

// Gestione login
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id'] = $user['id'];
            $_SESSION['admin_username'] = $user['username'];
            $_SESSION['admin_name'] = $user['full_name'];
            
            // Aggiorna ultimo login
            $stmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
            $stmt->execute([$user['id']]);
            
            header('Location: admin.php');
            exit;
        } else {
            $error = 'Credenziali non valide!';
        }
    } catch(PDOException $e) {
        $error = 'Errore di connessione al database';
    }
}
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Inventory Manager</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <i class="fas fa-lock" style="font-size: 3em; color: #667eea; margin-bottom: 20px;"></i>
            <h1>Area Amministrazione</h1>
            <p style="color: #666; margin-bottom: 30px;">Accedi per gestire il magazzino</p>
            
            <?php if ($error): ?>
                <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
                    <i class="fas fa-exclamation-circle"></i> <?php echo $error; ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="">
                <div class="form-group">
                    <label><i class="fas fa-user"></i> Username</label>
                    <input type="text" name="username" required autofocus placeholder="Inserisci username">
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-key"></i> Password</label>
                    <input type="password" name="password" required placeholder="Inserisci password">
                </div>
                
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-sign-in-alt"></i> Accedi
                </button>
                
                <a href="index.php" class="btn btn-success" style="margin-top: 10px;">
                    <i class="fas fa-eye"></i> Visualizzazione Pubblica
                </a>
            </form>
            
            <p style="margin-top: 20px; font-size: 0.9em; color: #999;">
                <i class="fas fa-info-circle"></i> Credenziali di default:<br>
                <strong>admin</strong> / <strong>admin123</strong>
            </p>
        </div>
    </div>
</body>
</html>