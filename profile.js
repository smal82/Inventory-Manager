// profile.js - Gestione Profilo Utente Admin

function loadProfile() {
    $.ajax({
        url: API_URL + '?action=getProfile',
        method: 'GET',
        success: function(data) {
            $('#profileUsername').val(data.username);
            $('#profileFullName').val(data.full_name || '');
            $('#profileEmail').val(data.email || '');
        },
        error: function(xhr) {
            console.error('Errore caricamento profilo:', xhr);
            Swal.fire({
                icon: 'error',
                title: 'Errore',
                text: 'Impossibile caricare il profilo',
                confirmButtonColor: '#667eea'
            });
        }
    });
}

function saveProfile() {
    const profileData = {
        full_name: $('#profileFullName').val(),
        email: $('#profileEmail').val()
    };

    $.ajax({
        url: API_URL + '?action=updateProfile',
        method: 'POST',
        data: JSON.stringify(profileData),
        contentType: 'application/json',
        success: function(response) {
            Swal.fire({
                icon: 'success',
                title: 'Successo!',
                text: 'Profilo aggiornato correttamente',
                timer: 2000,
                showConfirmButton: false
            });
        },
        error: function(xhr) {
            console.error('Errore aggiornamento profilo:', xhr);
            Swal.fire({
                icon: 'error',
                title: 'Errore',
                text: 'Errore aggiornamento profilo',
                confirmButtonColor: '#667eea'
            });
        }
    });
}

function changePassword() {
    const currentPassword = $('#currentPassword').val();
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();

    // Validazione
    if (newPassword !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Errore',
            text: 'Le password non coincidono',
            confirmButtonColor: '#667eea'
        });
        return;
    }

    if (newPassword.length < 6) {
        Swal.fire({
            icon: 'error',
            title: 'Errore',
            text: 'La password deve essere almeno di 6 caratteri',
            confirmButtonColor: '#667eea'
        });
        return;
    }

    const passwordData = {
        current_password: currentPassword,
        new_password: newPassword
    };

    $.ajax({
        url: API_URL + '?action=changePassword',
        method: 'POST',
        data: JSON.stringify(passwordData),
        contentType: 'application/json',
        success: function(response) {
            $('#passwordForm')[0].reset();
            Swal.fire({
                icon: 'success',
                title: 'Successo!',
                text: 'Password cambiata correttamente',
                timer: 2000,
                showConfirmButton: false
            });
        },
        error: function(xhr) {
            console.error('Errore cambio password:', xhr);
            const errorMsg = xhr.responseJSON?.error || 'Errore cambio password';
            Swal.fire({
                icon: 'error',
                title: 'Errore',
                text: errorMsg,
                confirmButtonColor: '#667eea'
            });
        }
    });
}