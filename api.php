<?php
// api.php - Backend API per Inventory Manager
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Configurazione database
require_once 'db_config.php';

// Connessione al database
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch(PDOException $e) {
    die(json_encode(['error' => 'Connessione database fallita: ' . $e->getMessage()]));
}

// Gestione richieste
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch($action) {
        // ========== AUTENTICAZIONE ==========
        case 'login':
            session_start();
            $data = json_decode(file_get_contents('php://input'), true);
            $username = $data['username'] ?? '';
            $password = $data['password'] ?? '';
            
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_id'] = $user['id'];
                $_SESSION['admin_username'] = $user['username'];
                $_SESSION['admin_name'] = $user['full_name'];
                
                // Aggiorna ultimo login
                $stmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
                $stmt->execute([$user['id']]);
                
                echo json_encode(['success' => true, 'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'full_name' => $user['full_name'],
                    'email' => $user['email']
                ]]);
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'error' => 'Credenziali non valide']);
            }
            break;
            
        case 'getProfile':
            session_start();
            if (!isset($_SESSION['admin_logged_in'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Non autorizzato']);
                break;
            }
            
            $stmt = $pdo->prepare("SELECT id, username, email, full_name, created_at, last_login FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['admin_id']]);
            echo json_encode($stmt->fetch());
            break;
            
        case 'updateProfile':
            session_start();
            if (!isset($_SESSION['admin_logged_in'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Non autorizzato']);
                break;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE users SET email = ?, full_name = ? WHERE id = ?");
            $stmt->execute([
                $data['email'],
                $data['full_name'],
                $_SESSION['admin_id']
            ]);
            
            $_SESSION['admin_name'] = $data['full_name'];
            echo json_encode(['success' => true]);
            break;
            
        case 'changePassword':
            session_start();
            if (!isset($_SESSION['admin_logged_in'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Non autorizzato']);
                break;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Verifica password attuale
            $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['admin_id']]);
            $user = $stmt->fetch();
            
            if (!password_verify($data['current_password'], $user['password'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Password attuale non corretta']);
                break;
            }
            
            // Aggiorna password
            $newPasswordHash = password_hash($data['new_password'], PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->execute([$newPasswordHash, $_SESSION['admin_id']]);
            
            echo json_encode(['success' => true]);
            break;
        
        // ========== PRODOTTI ==========
        case 'getProducts':
            $stmt = $pdo->query("
                SELECT p.*, c.name as category_name, s.name as supplier_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN suppliers s ON p.supplier_id = s.id
                ORDER BY p.name
            ");
            echo json_encode($stmt->fetchAll());
            break;

        case 'getProduct':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode($stmt->fetch());
            break;

        case 'addProduct':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("
                INSERT INTO products (name, sku, description, category_id, supplier_id, 
                                     quantity, min_quantity, price, cost)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['name'],
                $data['sku'],
                $data['description'] ?? null,
                $data['category_id'] ?? null,
                $data['supplier_id'] ?? null,
                $data['quantity'] ?? 0,
                $data['min_quantity'] ?? 10,
                $data['price'] ?? 0,
                $data['cost'] ?? 0
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;

        case 'updateProduct':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("
                UPDATE products 
                SET name = ?, sku = ?, description = ?, category_id = ?, 
                    supplier_id = ?, quantity = ?, min_quantity = ?, price = ?, cost = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $data['name'],
                $data['sku'],
                $data['description'] ?? null,
                $data['category_id'] ?? null,
                $data['supplier_id'] ?? null,
                $data['quantity'] ?? 0,
                $data['min_quantity'] ?? 10,
                $data['price'] ?? 0,
                $data['cost'] ?? 0,
                $data['id']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'deleteProduct':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
            break;

        // ========== MOVIMENTI ==========
        case 'getMovements':
            $limit = $_GET['limit'] ?? 100;
            $stmt = $pdo->prepare("
                SELECT m.*, p.name as product_name, p.sku
                FROM movements m
                JOIN products p ON m.product_id = p.id
                ORDER BY m.created_at DESC
                LIMIT ?
            ");
            $stmt->execute([$limit]);
            echo json_encode($stmt->fetchAll());
            break;

        case 'addMovement':
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Inizia transazione
            $pdo->beginTransaction();
            
            try {
                // Inserisci movimento
                $stmt = $pdo->prepare("
                    INSERT INTO movements (product_id, type, quantity, notes)
                    VALUES (?, ?, ?, ?)
                ");
                $stmt->execute([
                    $data['product_id'],
                    $data['type'],
                    $data['quantity'],
                    $data['notes'] ?? null
                ]);

                // Aggiorna quantità prodotto
                $updateQty = $data['type'] === 'in' ? '+' : '-';
                $stmt = $pdo->prepare("
                    UPDATE products 
                    SET quantity = quantity $updateQty ? 
                    WHERE id = ?
                ");
                $stmt->execute([$data['quantity'], $data['product_id']]);

                // Verifica che la quantità non sia negativa
                $stmt = $pdo->prepare("SELECT quantity FROM products WHERE id = ?");
                $stmt->execute([$data['product_id']]);
                $qty = $stmt->fetchColumn();
                
                if ($qty < 0) {
                    throw new Exception('Quantità insufficiente in magazzino');
                }

                $pdo->commit();
                echo json_encode(['success' => true]);
            } catch(Exception $e) {
                $pdo->rollBack();
                throw $e;
            }
            break;

        case 'updateMovement':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("
                UPDATE movements 
                SET product_id = ?, type = ?, quantity = ?, notes = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $data['product_id'],
                $data['type'],
                $data['quantity'],
                $data['notes'] ?? null,
                $data['id']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'deleteMovement':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("DELETE FROM movements WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
            break;

        // ========== CATEGORIE ==========
        case 'getCategories':
            $stmt = $pdo->query("
                SELECT c.*, COUNT(p.id) as product_count
                FROM categories c
                LEFT JOIN products p ON c.id = p.category_id
                GROUP BY c.id
                ORDER BY c.name
            ");
            echo json_encode($stmt->fetchAll());
            break;

        case 'addCategory':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("
                INSERT INTO categories (name, description)
                VALUES (?, ?)
            ");
            $stmt->execute([$data['name'], $data['description'] ?? null]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;

        case 'updateCategory':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("
                UPDATE categories 
                SET name = ?, description = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $data['name'],
                $data['description'] ?? null,
                $data['id']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'deleteCategory':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
            break;

        // ========== FORNITORI ==========
        case 'getSuppliers':
            $stmt = $pdo->query("
                SELECT s.*, COUNT(p.id) as product_count
                FROM suppliers s
                LEFT JOIN products p ON s.id = p.supplier_id
                GROUP BY s.id
                ORDER BY s.name
            ");
            echo json_encode($stmt->fetchAll());
            break;

        case 'updateSupplier':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("
                UPDATE suppliers 
                SET name = ?, email = ?, phone = ?, address = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $data['name'],
                $data['email'] ?? null,
                $data['phone'] ?? null,
                $data['address'] ?? null,
                $data['id']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'addSupplier':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("
                INSERT INTO suppliers (name, email, phone, address)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['name'],
                $data['email'] ?? null,
                $data['phone'] ?? null,
                $data['address'] ?? null
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;

        case 'deleteSupplier':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("DELETE FROM suppliers WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
            break;

        // ========== STATISTICHE ==========
        case 'getStats':
            $stats = [];
            
            // Totale prodotti
            $stmt = $pdo->query("SELECT COUNT(*) FROM products");
            $stats['total_products'] = $stmt->fetchColumn();
            
            // Valore magazzino
            $stmt = $pdo->query("SELECT SUM(quantity * cost) FROM products");
            $stats['total_value'] = round($stmt->fetchColumn(), 2);
            
            // Scorte basse
            $stmt = $pdo->query("
                SELECT COUNT(*) FROM products 
                WHERE quantity > 0 AND quantity <= min_quantity
            ");
            $stats['low_stock'] = $stmt->fetchColumn();
            
            // Esauriti
            $stmt = $pdo->query("SELECT COUNT(*) FROM products WHERE quantity = 0");
            $stats['out_of_stock'] = $stmt->fetchColumn();
            
            echo json_encode($stats);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Azione non valida']);
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>