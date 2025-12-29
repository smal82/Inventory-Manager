// delete.js - Gestione Eliminazioni con SweetAlert2

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