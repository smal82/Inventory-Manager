// modals.js - Gestione Apertura/Chiusura Modals

// ========== PRODOTTI ==========
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

// ========== MOVIMENTI ==========
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

// ========== CATEGORIE ==========
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

// ========== FORNITORI ==========
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

// ========== PROFILO UTENTE ==========
function openProfileModal() {
    loadProfile();
    $('#profileModal').css('display', 'flex');
}

function switchProfileTab(tabName) {
    $('.profile-tab').removeClass('active');
    $('.profile-tab-content').removeClass('active');
    
    $(`.profile-tab:contains('${tabName === 'info' ? 'Informazioni' : 'Cambia Password'}')`).addClass('active');
    $(`#profile${tabName === 'info' ? 'Info' : 'Password'}Tab`).addClass('active');
}