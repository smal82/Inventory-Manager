<?php
session_start();

// Verifica login
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Inventory Manager</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Menu Responsive -->
    <nav class="admin-menu">
        <div class="menu-container">
            <div class="menu-logo">
                <i class="fas fa-boxes"></i>
                <span>Inventory Manager</span>
            </div>
            
            <button class="menu-toggle" onclick="toggleMenu()">
                <i class="fas fa-bars"></i>
            </button>
            
            <div class="menu-items" id="menuItems">
                <a href="index.php" class="menu-item" target="_blank">
                    <i class="fas fa-eye"></i> Visualizza
                </a>
                <a href="#" class="menu-item" onclick="openProfileModal(); return false;">
                    <i class="fas fa-user-circle"></i> Account
                </a>
                <a href="logout.php" class="menu-logout">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </div>
    </nav>
    
    <div class="container admin-container">
        <!-- Header -->
        <header>
            <h1>
                <i class="fas fa-boxes"></i> 
                Inventory Manager
            </h1>
            <button class="btn btn-primary" onclick="openAddProductModal()">
                <i class="fas fa-plus"></i> Aggiungi Prodotto
            </button>
        </header>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card" style="color: #667eea;">
                <i class="fas fa-box"></i>
                <h3>Totale Prodotti</h3>
                <div class="value" id="totalProducts">0</div>
            </div>
            <div class="stat-card" style="color: #11998e;">
                <i class="fas fa-layer-group"></i>
                <h3>Valore Magazzino</h3>
                <div class="value" id="totalValue">€0</div>
            </div>
            <div class="stat-card" style="color: #f093fb;">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Scorte Basse</h3>
                <div class="value" id="lowStock">0</div>
            </div>
            <div class="stat-card" style="color: #eb3349;">
                <i class="fas fa-ban"></i>
                <h3>Esauriti</h3>
                <div class="value" id="outOfStock">0</div>
            </div>
        </div>

        <!-- Main Card with Tabs -->
        <div class="card">
            <!-- Tabs Navigation -->
            <div class="tabs">
                <button class="tab tab-products active" onclick="switchTab('products')">
                    <i class="fas fa-box"></i> Prodotti
                </button>
                <button class="tab tab-movements" onclick="switchTab('movements')">
                    <i class="fas fa-exchange-alt"></i> Movimenti
                </button>
                <button class="tab tab-categories" onclick="switchTab('categories')">
                    <i class="fas fa-tags"></i> Categorie
                </button>
                <button class="tab tab-suppliers" onclick="switchTab('suppliers')">
                    <i class="fas fa-truck"></i> Fornitori
                </button>
            </div>

            <!-- Tab: Prodotti -->
            <div id="productsTab" class="tab-content active products-section">
                <div class="card-header">
                    <h2>Elenco Prodotti</h2>
                </div>
                
                <!-- Search Bar -->
                <div class="search-bar">
                    <input type="text" id="searchProduct" placeholder="🔍 Cerca per nome o SKU...">
                    <select id="filterCategory">
                        <option value="">Tutte le categorie</option>
                    </select>
                    <select id="filterStock">
                        <option value="">Tutti gli stock</option>
                        <option value="low">Scorte basse</option>
                        <option value="out">Esauriti</option>
                    </select>
                </div>
                
                <!-- Products Table -->
                <div style="overflow-x: auto;">
                    <table id="productsTable">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Quantità</th>
                                <th>Prezzo</th>
                                <th>Valore</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="7" style="text-align: center; padding: 30px;">
                                    <i class="fas fa-spinner fa-spin" style="font-size: 2em; color: #667eea;"></i>
                                    <p style="margin-top: 10px;">Caricamento prodotti...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Tab: Movimenti -->
            <div id="movementsTab" class="tab-content movements-section">
                <div class="card-header">
                    <h2>Storico Movimenti</h2>
                    <button class="btn btn-success btn-sm" onclick="openAddMovementModal()">
                        <i class="fas fa-plus"></i> Nuovo Movimento
                    </button>
                </div>
                
                <div style="overflow-x: auto;">
                    <table id="movementsTable">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Prodotto</th>
                                <th>Tipo</th>
                                <th>Quantità</th>
                                <th>Note</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="6" style="text-align: center; padding: 30px;">
                                    <i class="fas fa-spinner fa-spin" style="font-size: 2em; color: #11998e;"></i>
                                    <p style="margin-top: 10px;">Caricamento movimenti...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Tab: Categorie -->
            <div id="categoriesTab" class="tab-content categories-section">
                <div class="card-header">
                    <h2>Categorie</h2>
                    <button class="btn btn-primary btn-sm" onclick="openAddCategoryModal()">
                        <i class="fas fa-plus"></i> Nuova Categoria
                    </button>
                </div>
                
                <div style="overflow-x: auto;">
                    <table id="categoriesTable">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Descrizione</th>
                                <th>Prodotti</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="4" style="text-align: center; padding: 30px;">
                                    <i class="fas fa-spinner fa-spin" style="font-size: 2em; color: #f093fb;"></i>
                                    <p style="margin-top: 10px;">Caricamento categorie...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Tab: Fornitori -->
            <div id="suppliersTab" class="tab-content suppliers-section">
                <div class="card-header">
                    <h2>Fornitori</h2>
                    <button class="btn btn-primary btn-sm" onclick="openAddSupplierModal()">
                        <i class="fas fa-plus"></i> Nuovo Fornitore
                    </button>
                </div>
                
                <div style="overflow-x: auto;">
                    <table id="suppliersTable">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Telefono</th>
                                <th>Indirizzo</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="5" style="text-align: center; padding: 30px;">
                                    <i class="fas fa-spinner fa-spin" style="font-size: 2em; color: #fa709a;"></i>
                                    <p style="margin-top: 10px;">Caricamento fornitori...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- ========== MODALS ========== -->

    <!-- Modal: Profilo Utente -->
    <div id="profileModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('profileModal')">&times;</span>
            <h2>Gestione Account</h2>
            
            <div class="profile-tabs">
                <button class="profile-tab active" onclick="switchProfileTab('info')">
                    <i class="fas fa-user"></i> Informazioni
                </button>
                <button class="profile-tab" onclick="switchProfileTab('password')">
                    <i class="fas fa-key"></i> Cambia Password
                </button>
            </div>
            
            <!-- Tab Info -->
            <div id="profileInfoTab" class="profile-tab-content active">
                <form id="profileForm">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" id="profileUsername" disabled>
                    </div>
                    
                    <div class="form-group">
                        <label>Nome Completo</label>
                        <input type="text" id="profileFullName" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="profileEmail">
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Salva Modifiche
                    </button>
                </form>
            </div>
            
            <!-- Tab Password -->
            <div id="profilePasswordTab" class="profile-tab-content">
                <form id="passwordForm">
                    <div class="form-group">
                        <label>Password Attuale *</label>
                        <input type="password" id="currentPassword" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Nuova Password *</label>
                        <input type="password" id="newPassword" required minlength="6">
                    </div>
                    
                    <div class="form-group">
                        <label>Conferma Nuova Password *</label>
                        <input type="password" id="confirmPassword" required minlength="6">
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-key"></i> Cambia Password
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal: Aggiungi/Modifica Prodotto -->
    <div id="productModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('productModal')">&times;</span>
            <h2 id="productModalTitle">Aggiungi Prodotto</h2>
            
            <form id="productForm">
                <input type="hidden" id="productId">
                
                <div class="form-group">
                    <label>Nome Prodotto *</label>
                    <input type="text" id="productName" required placeholder="Es: Mouse Wireless">
                </div>
                
                <div class="form-group">
                    <label>SKU *</label>
                    <input type="text" id="productSku" required placeholder="Es: EL-001">
                </div>
                
                <div class="form-group">
                    <label>Descrizione</label>
                    <textarea id="productDescription" rows="3" placeholder="Descrizione del prodotto..."></textarea>
                </div>
                
                <div class="form-group">
                    <label>Categoria</label>
                    <select id="productCategory">
                        <option value="">Seleziona categoria</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Fornitore</label>
                    <select id="productSupplier">
                        <option value="">Seleziona fornitore</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Quantità</label>
                    <input type="number" id="productQuantity" value="0" min="0">
                </div>
                
                <div class="form-group">
                    <label>Quantità Minima (Alert)</label>
                    <input type="number" id="productMinQuantity" value="10" min="0">
                </div>
                
                <div class="form-group">
                    <label>Prezzo Vendita (€)</label>
                    <input type="number" step="0.01" id="productPrice" placeholder="0.00" min="0">
                </div>
                
                <div class="form-group">
                    <label>Costo (€)</label>
                    <input type="number" step="0.01" id="productCost" placeholder="0.00" min="0">
                </div>
                
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Salva Prodotto
                </button>
            </form>
        </div>
    </div>

    <!-- Modal: Nuovo/Modifica Movimento -->
    <div id="movementModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('movementModal')">&times;</span>
            <h2 id="movementModalTitle">Nuovo Movimento</h2>
            
            <form id="movementForm">
                <input type="hidden" id="movementId">
                
                <div class="form-group">
                    <label>Prodotto *</label>
                    <select id="movementProduct" required>
                        <option value="">Seleziona prodotto</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Tipo *</label>
                    <select id="movementType" required>
                        <option value="in">📥 Entrata (Carico)</option>
                        <option value="out">📤 Uscita (Scarico)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Quantità *</label>
                    <input type="number" id="movementQuantity" required min="1" placeholder="Es: 10">
                </div>
                
                <div class="form-group">
                    <label>Note</label>
                    <textarea id="movementNotes" rows="3" placeholder="Note sul movimento..."></textarea>
                </div>
                
                <button type="submit" class="btn btn-success">
                    <i class="fas fa-save"></i> Salva Movimento
                </button>
            </form>
        </div>
    </div>

    <!-- Modal: Nuova/Modifica Categoria -->
    <div id="categoryModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('categoryModal')">&times;</span>
            <h2 id="categoryModalTitle">Nuova Categoria</h2>
            
            <form id="categoryForm">
                <input type="hidden" id="categoryId">
                
                <div class="form-group">
                    <label>Nome *</label>
                    <input type="text" id="categoryName" required placeholder="Es: Elettronica">
                </div>
                
                <div class="form-group">
                    <label>Descrizione</label>
                    <textarea id="categoryDescription" rows="3" placeholder="Descrizione della categoria..."></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Salva Categoria
                </button>
            </form>
        </div>
    </div>

    <!-- Modal: Nuovo/Modifica Fornitore -->
    <div id="supplierModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('supplierModal')">&times;</span>
            <h2 id="supplierModalTitle">Nuovo Fornitore</h2>
            
            <form id="supplierForm">
                <input type="hidden" id="supplierId">
                
                <div class="form-group">
                    <label>Nome *</label>
                    <input type="text" id="supplierName" required placeholder="Es: Tech Supply Co.">
                </div>
                
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="supplierEmail" placeholder="info@fornitore.com">
                </div>
                
                <div class="form-group">
                    <label>Telefono</label>
                    <input type="tel" id="supplierPhone" placeholder="+39 02 1234567">
                </div>
                
                <div class="form-group">
                    <label>Indirizzo</label>
                    <textarea id="supplierAddress" rows="3" placeholder="Via, Città, CAP"></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Salva Fornitore
                </button>
            </form>
        </div>
    </div>

    <!-- JavaScript -->
    <script>
        window.IS_ADMIN_MODE = true;
    </script>
    <script src="app.js"></script>
    <script src="data-loader.js"></script>
    <script src="render.js"></script>
    <script src="modals.js"></script>
    <script src="forms.js"></script>
    <script src="delete.js"></script>
    <script src="profile.js"></script>
</body>
</html>