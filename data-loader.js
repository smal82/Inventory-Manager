// data-loader.js - Caricamento Dati dal Server

function loadAllData() {
    loadProducts();
    loadCategories();
    loadSuppliers();
    loadMovements();
    loadStats();
}

function loadProducts() {
    $.ajax({
        url: API_URL + '?action=getProducts',
        method: 'GET',
        success: function(data) {
            products = data;
            renderProducts();
            populateProductSelects();
        },
        error: function(xhr) {
            console.error('Errore caricamento prodotti:', xhr);
        }
    });
}

function loadCategories() {
    $.ajax({
        url: API_URL + '?action=getCategories',
        method: 'GET',
        success: function(data) {
            categories = data;
            renderCategories();
            populateCategorySelects();
        },
        error: function(xhr) {
            console.error('Errore caricamento categorie:', xhr);
        }
    });
}

function loadSuppliers() {
    $.ajax({
        url: API_URL + '?action=getSuppliers',
        method: 'GET',
        success: function(data) {
            suppliers = data;
            renderSuppliers();
            populateSupplierSelects();
        },
        error: function(xhr) {
            console.error('Errore caricamento fornitori:', xhr);
        }
    });
}

function loadMovements() {
    $.ajax({
        url: API_URL + '?action=getMovements',
        method: 'GET',
        success: function(data) {
            movements = data;
            renderMovements();
        },
        error: function(xhr) {
            console.error('Errore caricamento movimenti:', xhr);
        }
    });
}

function loadStats() {
    $.ajax({
        url: API_URL + '?action=getStats',
        method: 'GET',
        success: function(data) {
            $('#totalProducts').text(data.total_products);
            $('#totalValue').text('€' + formatNumber(data.total_value));
            $('#lowStock').text(data.low_stock);
            $('#outOfStock').text(data.out_of_stock);
        },
        error: function(xhr) {
            console.error('Errore caricamento statistiche:', xhr);
        }
    });
}