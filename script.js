// script.js - Inventory Manager JavaScript

// Configurazione API
const API_URL = 'api.php';

// Variabili globali
let products = [];
let categories = [];
let suppliers = [];
let movements = [];

// Funzione per formattare numeri in italiano (1.233,00)
function formatNumber(num, decimals = 2) {
    if (num === null || num === undefined || isNaN(num)) return '0,00';
    
    // Converti in numero e arrotonda
    num = parseFloat(num).toFixed(decimals);
    
    // Separa parte intera e decimale
    let parts = num.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] || '00';
    
    // Aggiungi separatore migliaia
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Ritorna formato italiano
    return integerPart + ',' + decimalPart;
}

// Inizializzazione app
$(document).ready(function() {
    loadAllData();
    setupEventListeners();
});

// ========== CARICAMENTO DATI ==========

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
            showNotification('Errore caricamento prodotti', 'danger');
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

// ========== RENDER FUNCTIONS ==========

function renderProducts() {
    const tbody = $('#productsTable tbody');
    tbody.empty();

    if (products.length === 0) {
        tbody.append('<tr><td colspan="' + (window.IS_ADMIN_MODE ? '7' : '6') + '" style="text-align: center;">Nessun prodotto trovato</td></tr>');
        return;
    }

    products.forEach(product => {
        const value = product.quantity * product.cost;
        
        let statusClass = '';
        let statusBadge = '<span class="badge badge-success">OK</span>';
        
        if (product.quantity == 0) {
            statusClass = 'out-of-stock';
            statusBadge = '<span class="badge badge-danger">Esaurito</span>';
        } else if (product.quantity <= product.min_quantity) {
            statusClass = 'low-stock';
            statusBadge = '<span class="badge badge-warning">Scorte basse</span>';
        }

        let actionsHtml = '';
        if (window.IS_ADMIN_MODE) {
            actionsHtml = `
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        }

        tbody.append(`
            <tr class="${statusClass}">
                <td><strong>${product.sku}</strong></td>
                <td>${product.name}</td>
                <td>${product.category_name || '-'}</td>
                <td>${formatNumber(product.quantity, 0)} ${statusBadge}</td>
                <td>€${formatNumber(product.price)}</td>
                <td>€${formatNumber(value)}</td>
                ${actionsHtml}
            </tr>
        `);
    });
}

function renderMovements() {
    const tbody = $('#movementsTable tbody');
    tbody.empty();

    if (movements.length === 0) {
        tbody.append('<tr><td colspan="' + (window.IS_ADMIN_MODE ? '6' : '5') + '" style="text-align: center;">Nessun movimento registrato</td></tr>');
        return;
    }

    movements.forEach(movement => {
        const typeIcon = movement.type === 'in' 
            ? '<i class="fas fa-arrow-down" style="color: green;"></i>' 
            : '<i class="fas fa-arrow-up" style="color: red;"></i>';
        const typeText = movement.type === 'in' ? 'Entrata' : 'Uscita';
        const date = new Date(movement.created_at).toLocaleString('it-IT');

        let actionsHtml = '';
        if (window.IS_ADMIN_MODE) {
            actionsHtml = `
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editMovement(${movement.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMovement(${movement.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        }

        tbody.append(`
            <tr>
                <td>${date}</td>
                <td>${movement.product_name} (${movement.sku})</td>
                <td>${typeIcon} ${typeText}</td>
                <td><strong>${formatNumber(movement.quantity, 0)}</strong></td>
                <td>${movement.notes || '-'}</td>
                ${actionsHtml}
            </tr>
        `);
    });
}

function renderCategories() {
    const tbody = $('#categoriesTable tbody');
    tbody.empty();

    if (categories.length === 0) {
        tbody.append('<tr><td colspan="' + (window.IS_ADMIN_MODE ? '4' : '3') + '" style="text-align: center;">Nessuna categoria trovata</td></tr>');
        return;
    }

    categories.forEach(category => {
        let actionsHtml = '';
        if (window.IS_ADMIN_MODE) {
            actionsHtml = `
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editCategory(${category.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        }

        tbody.append(`
            <tr>
                <td><strong>${category.name}</strong></td>
                <td>${category.description || '-'}</td>
                <td><span class="badge badge-success">${category.product_count || 0}</span></td>
                ${actionsHtml}
            </tr>
        `);
    });
}

function renderSuppliers() {
    const tbody = $('#suppliersTable tbody');
    tbody.empty();

    if (suppliers.length === 0) {
        tbody.append('<tr><td colspan="' + (window.IS_ADMIN_MODE ? '5' : '4') + '" style="text-align: center;">Nessun fornitore trovato</td></tr>');
        return;
    }

    suppliers.forEach(supplier => {
        let actionsHtml = '';
        if (window.IS_ADMIN_MODE) {
            actionsHtml = `
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editSupplier(${supplier.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${supplier.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        }

        tbody.append(`
            <tr>
                <td><strong>${supplier.name}</strong></td>
                <td>${supplier.email || '-'}</td>
                <td>${supplier.phone || '-'}</td>
                <td>${supplier.address || '-'}</td>
                ${actionsHtml}
            </tr>
        `);
    });
}

// ========== POPOLAMENTO SELECT ==========

function populateCategorySelects() {
    const categorySelects = $('#productCategory, #filterCategory');
    categorySelects.empty();
    $('#filterCategory').append('<option value="">Tutte le categorie</option>');
    $('#productCategory').append('<option value="">Seleziona categoria</option>');
    
    categories.forEach(cat => {
        categorySelects.append(`<option value="${cat.id}">${cat.name}</option>`);
    });
}

function populateSupplierSelects() {
    const supplierSelect = $('#productSupplier');
    supplierSelect.empty().append('<option value="">Seleziona fornitore</option>');
    suppliers.forEach(sup => {
        supplierSelect.append(`<option value="${sup.id}">${sup.name}</option>`);
    });
}

function populateProductSelects() {
    const productSelect = $('#movementProduct');
    productSelect.empty().append('<option value="">Seleziona prodotto</option>');
    products.forEach(prod => {
        productSelect.append(`<option value="${prod.id}">${prod.name} (${prod.sku})</option>`);
    });
}

// ========== EVENT LISTENERS ==========

function setupEventListeners() {
    $('#searchProduct').on('input', filterProducts);
    $('#filterCategory').on('change', filterProducts);
    $('#filterStock').on('change', filterProducts);

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

    // Chiudi modal cliccando fuori
    $(window).on('click', function(e) {
        if ($(e.target).hasClass('modal')) {
            $(e.target).css('display', 'none');
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

// ========== TAB SWITCHING ==========

function switchTab(tabName) {
    $('.tab').removeClass('active');
    $('.tab-content').removeClass('active');
    
    $(`.tab-${tabName}`).addClass('active');
    $(`#${tabName}Tab`).addClass('active');
}

// ========== MODAL FUNCTIONS ==========

function openAddProductModal() {
    $('#productModalTitle').text('Aggiungi Prodotto');
    $('#productForm')[0].reset();
    $('#productId').val('');
    $('#productModal').css('display', 'flex');
}

function editProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;

    $('#productModalTitle').text('Modifica Prodotto');
    $('#productId').val(product.id);
    $('#productName').val(product.name);
    $('#productSku').val(product.sku);
    $('#productDescription').val(product.description || '');
    $('#productCategory').val(product.category_id || '');
    $('#productSupplier').val(product.supplier_id || '');
    $('#productQuantity').val(product.quantity);
    $('#productMinQuantity').val(product.min_quantity);
    $('#productPrice').val(product.price);
    $('#productCost').val(product.cost);
    
    $('#productModal').css('display', 'flex');
}

function openAddMovementModal() {
    $('#movementModalTitle').text('Nuovo Movimento');
    $('#movementForm')[0].reset();
    $('#movementId').val('');
    $('#movementModal').css('display', 'flex');
}

function editMovement(id) {
    const movement = movements.find(m => m.id == id);
    if (!movement) return;

    $('#movementModalTitle').text('Modifica Movimento');
    $('#movementId').val(movement.id);
    $('#movementProduct').val(movement.product_id);
    $('#movementType').val(movement.type);
    $('#movementQuantity').val(movement.quantity);
    $('#movementNotes').val(movement.notes || '');
    
    $('#movementModal').css('display', 'flex');
}

function openAddCategoryModal() {
    $('#categoryModalTitle').text('Nuova Categoria');
    $('#categoryForm')[0].reset();
    $('#categoryId').val('');
    $('#categoryModal').css('display', 'flex');
}

function editCategory(id) {
    const category = categories.find(c => c.id == id);
    if (!category) return;

    $('#categoryModalTitle').text('Modifica Categoria');
    $('#categoryId').val(category.id);
    $('#categoryName').val(category.name);
    $('#categoryDescription').val(category.description || '');
    
    $('#categoryModal').css('display', 'flex');
}

function openAddSupplierModal() {
    $('#supplierModalTitle').text('Nuovo Fornitore');
    $('#supplierForm')[0].reset();
    $('#supplierId').val('');
    $('#supplierModal').css('display', 'flex');
}

function editSupplier(id) {
    const supplier = suppliers.find(s => s.id == id);
    if (!supplier) return;

    $('#supplierModalTitle').text('Modifica Fornitore');
    $('#supplierId').val(supplier.id);
    $('#supplierName').val(supplier.name);
    $('#supplierEmail').val(supplier.email || '');
    $('#supplierPhone').val(supplier.phone || '');
    $('#supplierAddress').val(supplier.address || '');
    
    $('#supplierModal').css('display', 'flex');
}

function closeModal(modalId) {
    $('#' + modalId).css('display', 'none');
}

// ========== SAVE FUNCTIONS ==========

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

// ========== DELETE FUNCTIONS ==========

function deleteProduct(id) {
    Swal.fire({
        title: 'Sei sicuro?',
        text: "Questa azione eliminerà il prodotto definitivamente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#eb3349',
        cancelButtonColor: '#999',
        confirmButtonText: 'Sì, elimina!',
        cancelButtonText: 'Annulla'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: API_URL + '?action=deleteProduct&id=' + id,
                method: 'GET',
                success: function(response) {
                    loadAllData();
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminato!',
                        text: 'Prodotto eliminato con successo',
                        timer: 2000,
                        showConfirmButton: false
                    });
                },
                error: function(xhr) {
                    console.error('Errore eliminazione prodotto:', xhr);
                    Swal.fire({
                        icon: 'error',
                        title: 'Errore',
                        text: 'Errore eliminazione prodotto',
                        confirmButtonColor: '#667eea'
                    });
                }
            });
        }
    });
}

function deleteMovement(id) {
    Swal.fire({
        title: 'Sei sicuro?',
        text: "Questa azione eliminerà il movimento definitivamente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#eb3349',
        cancelButtonColor: '#999',
        confirmButtonText: 'Sì, elimina!',
        cancelButtonText: 'Annulla'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: API_URL + '?action=deleteMovement&id=' + id,
                method: 'GET',
                success: function(response) {
                    loadAllData();
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminato!',
                        text: 'Movimento eliminato con successo',
                        timer: 2000,
                        showConfirmButton: false
                    });
                },
                error: function(xhr) {
                    console.error('Errore eliminazione movimento:', xhr);
                    Swal.fire({
                        icon: 'error',
                        title: 'Errore',
                        text: 'Errore eliminazione movimento',
                        confirmButtonColor: '#667eea'
                    });
                }
            });
        }
    });
}

function deleteCategory(id) {
    Swal.fire({
        title: 'Sei sicuro?',
        text: "Questa azione eliminerà la categoria definitivamente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#eb3349',
        cancelButtonColor: '#999',
        confirmButtonText: 'Sì, elimina!',
        cancelButtonText: 'Annulla'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: API_URL + '?action=deleteCategory&id=' + id,
                method: 'GET',
                success: function(response) {
                    loadCategories();
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminato!',
                        text: 'Categoria eliminata con successo',
                        timer: 2000,
                        showConfirmButton: false
                    });
                },
                error: function(xhr) {
                    console.error('Errore eliminazione categoria:', xhr);
                    Swal.fire({
                        icon: 'error',
                        title: 'Errore',
                        text: 'Errore eliminazione categoria',
                        confirmButtonColor: '#667eea'
                    });
                }
            });
        }
    });
}

function deleteSupplier(id) {
    Swal.fire({
        title: 'Sei sicuro?',
        text: "Questa azione eliminerà il fornitore definitivamente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#eb3349',
        cancelButtonColor: '#999',
        confirmButtonText: 'Sì, elimina!',
        cancelButtonText: 'Annulla'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: API_URL + '?action=deleteSupplier&id=' + id,
                method: 'GET',
                success: function(response) {
                    loadSuppliers();
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminato!',
                        text: 'Fornitore eliminato con successo',
                        timer: 2000,
                        showConfirmButton: false
                    });
                },
                error: function(xhr) {
                    console.error('Errore eliminazione fornitore:', xhr);
                    Swal.fire({
                        icon: 'error',
                        title: 'Errore',
                        text: 'Errore eliminazione fornitore',
                        confirmButtonColor: '#667eea'
                    });
                }
            });
        }
    });
}

// ========== NOTIFICHE ==========

function showNotification(message, type) {
    const colors = {
        'success': '#11998e',
        'danger': '#eb3349',
        'warning': '#f093fb'
    };
    
    const color = colors[type] || colors['success'];
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    const notification = $(`
        <div style="position: fixed; top: 20px; right: 20px; background: ${color}; color: white; 
                    padding: 15px 25px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    z-index: 10000; animation: slideInRight 0.3s ease;">
            <i class="fas ${icon}"></i> ${message}
        </div>
    `);
    
    $('body').append(notification);
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 3000);
}

// Aggiungi animazione slide-in
$('<style>').text(`
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`).appendTo('head');