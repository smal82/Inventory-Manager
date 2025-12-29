<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory Manager - Visualizzazione</title>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <!-- CSS Personalizzato -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    
    <div class="container">
        <!-- Header -->
        <header>
            <h1>
                <i class="fas fa-boxes"></i> 
                Inventory Manager
            </h1>
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="6" style="text-align: center; padding: 30px;">
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="5" style="text-align: center; padding: 30px;">
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
                </div>
                
                <div style="overflow-x: auto;">
                    <table id="categoriesTable">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Descrizione</th>
                                <th>Prodotti</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="3" style="text-align: center; padding: 30px;">
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
                </div>
                
                <div style="overflow-x: auto;">
                    <table id="suppliersTable">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Telefono</th>
                                <th>Indirizzo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="4" style="text-align: center; padding: 30px;">
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

    <!-- JavaScript -->
    <script>
        window.IS_ADMIN_MODE = false;
    </script>
    <script src="app.js"></script>
    <script src="data-loader.js"></script>
    <script src="render.js"></script>
    <script src="forms.js"></script>
</body>
</html>