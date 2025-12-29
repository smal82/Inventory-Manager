// render.js - Rendering delle Tabelle

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
            ? '<i class="fas fa-arrow-down" style="color: green; margin-right: 10px;"></i>' 
            : '<i class="fas fa-arrow-up" style="color: red; margin-right: 10px;"></i>';
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