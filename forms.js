// forms.js - Gestione Salvataggio Forms

function setupEventListeners() {
    // Filtri prodotti
    $('#searchProduct').on('input', filterProducts);
    $('#filterCategory').on('change', filterProducts);
    $('#filterStock').on('change', filterProducts);

    // Forms
    $('#productForm').on('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });

    $('#movementForm').on('submit', function(e) {
        e.preventDefault();
        saveMovement();
    });

    $('#categoryForm').on('submit', function(e) {
        e.preventDefault();
        saveCategory();
    });

    $('#supplierForm').on('submit', function(e) {
        e.preventDefault();
        saveSupplier();
    });

    // Profilo (solo in admin)
    if (window.IS_ADMIN_MODE) {
        $('#profileForm').on('submit', function(e) {
            e.preventDefault();
            saveProfile();
        });

        $('#passwordForm').on('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }
}

// ========== SALVATAGGIO PRODOTTI ==========
function saveProduct() {
    const id = $('#productId').val();
    const productData = {
        id: id,
        name: $('#productName').val(),
        sku: $('#productSku').val(),
        description: $('#productDescription').val(),
        category_id: $('#productCategory').val() || null,
        supplier_id: $('#productSupplier').val() || null,
        quantity: parseInt($('#productQuantity').val()) || 0,
        min_quantity: parseInt($('#productMinQuantity').val()) || 10,
        price: parseFloat($('#productPrice').val()) || 0,
        cost: parseFloat($('#productCost').val()) || 0
    };

    const action = id ? 'updateProduct' : 'addProduct';
    
    $.ajax({
        url: API_URL + '?action=' + action,
        method: 'POST',
        data: JSON.stringify(productData),
        contentType: 'application/json',
        success: function(response) {
            closeModal('productModal');
            loadAllData();
            Swal.fire({
                icon: 'success',
                title: 'Successo!',
                text: id ? 'Prodotto aggiornato!' : 'Prodotto aggiunto!',
                timer: 2000,
                showConfirmButton: false
            });
        },
        error: function(xhr) {
            console.error('Errore salvataggio prodotto:', xhr);
            Swal.fire({
                icon: 'error',
                title: 'Errore',
                text: 'Errore salvataggio prodotto',
                confirmButtonColor: '#667eea'
            });
        }
    });
}

// ========== SALVATAGGIO MOVIMENTI ==========
function saveMovement() {
    const id = $('#movementId').val();
    const movementData = {
        id: id,
        product_id: parseInt($('#movementProduct').val()),
        type: $('#movementType').val(),
        quantity: parseInt($('#movementQuantity').val()),
        notes: $('#movementNotes').val()
    };

    if (!movementData.product_id || !movementData.quantity) {
        Swal.fire({
            icon: 'error',
            title: 'Errore',
            text: 'Compila tutti i campi obbligatori',
            confirmButtonColor: '#667eea'
        });
        return;
    }

    const action = id ? 'updateMovement' : 'addMovement';
    
    $.ajax({
        url: API_URL + '?action=' + action,
        method: 'POST',
        data: JSON.stringify(movementData),
        contentType: 'application/json',
        success: function(response) {
            closeModal('movementModal');
            loadAllData();
            Swal.fire({
                icon: 'success',
                title: 'Successo!',
                text: id ? 'Movimento aggiornato!' : 'Movimento registrato!',
                timer: 2000,
                showConfirmButton: false
            });
        },
        error: function(xhr) {
            console.error('Errore salvataggio movimento:', xhr);
            const errorMsg = xhr.responseJSON?.error || 'Errore registrazione movimento';
            Swal.fire({
                icon: 'error',
                title: 'Errore',
                text: errorMsg,
                confirmButtonColor: '#667eea'
            });
        }
    });
}

// ========== SALVATAGGIO CATEGORIE ==========
function saveCategory() {
    const id = $('#categoryId').val();
    const categoryData = {
        id: id,
        name: $('#categoryName').val(),
        description: $('#categoryDescription').val()
    };

    const action = id ? 'updateCategory' : 'addCategory';

    $.ajax({
        url: API_URL + '?action=' + action,
        method: 'POST',
        data: JSON.stringify(categoryData),
        contentType: 'application/json',
        success: function(response) {
            closeModal('categoryModal');
            loadCategories();
            Swal.fire({
                icon: 'success',
                title: 'Successo!',
                text: id ? 'Categoria aggiornata!' : 'Categoria aggiunta!',
                timer: 2000,
                showConfirmButton: false
            });
        },
        error: function(xhr) {
            console.error('Errore salvataggio categoria:', xhr);
            Swal.fire({
                icon: 'error',
                title: 'Errore',
                text: 'Errore salvataggio categoria',
                confirmButtonColor: '#667eea'
            });
        }
    });
}

// ========== SALVATAGGIO FORNITORI ==========
function saveSupplier() {
    const id = $('#supplierId').val();
    const supplierData = {
        id: id,
        name: $('#supplierName').val(),
        email: $('#supplierEmail').val(),
        phone: $('#supplierPhone').val(),
        address: $('#supplierAddress').val()
    };

    const action = id ? 'updateSupplier' : 'addSupplier';

    $.ajax({
        url: API_URL + '?action=' + action,
        method: 'POST',
        data: JSON.stringify(supplierData),
        contentType: 'application/json',
        success: function(response) {
            closeModal('supplierModal');
            loadSuppliers();
            Swal.fire({
                icon: 'success',
                title: 'Successo!',
                text: id ? 'Fornitore aggiornato!' : 'Fornitore aggiunto!',
                timer: 2000,
                showConfirmButton: false
            });
        },
        error: function(xhr) {
            console.error('Errore salvataggio fornitore:', xhr);
            Swal.fire({
                icon: 'error',
                title: 'Errore',
                text: 'Errore salvataggio fornitore',
                confirmButtonColor: '#667eea'
            });
        }
    });
}

// ========== FILTRI ==========
function filterProducts() {
    const search = $('#searchProduct').val().toLowerCase();
    const categoryFilter = $('#filterCategory').val();
    const stockFilter = $('#filterStock').val();

    $('#productsTable tbody tr').each(function() {
        const row = $(this);
        const text = row.text().toLowerCase();
        let show = true;

        if (search && !text.includes(search)) {
            show = false;
        }

        if (categoryFilter) {
            const categoryName = categories.find(c => c.id == categoryFilter)?.name || '';
            if (!row.find('td:eq(2)').text().includes(categoryName)) {
                show = false;
            }
        }

        if (stockFilter === 'low' && !row.hasClass('low-stock')) {
            show = false;
        }

        if (stockFilter === 'out' && !row.hasClass('out-of-stock')) {
            show = false;
        }

        row.toggle(show);
    });
}