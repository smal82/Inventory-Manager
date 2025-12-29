// app.js - Script Principale e Configurazione

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
    
    num = parseFloat(num).toFixed(decimals);
    let parts = num.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] || '00';
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return integerPart + ',' + decimalPart;
}

// Funzione per chiudere modal
function closeModal(modalId) {
    $('#' + modalId).css('display', 'none');
}

// Funzione per cambiare tab
function switchTab(tabName) {
    $('.tab').removeClass('active');
    $('.tab-content').removeClass('active');
    
    $(`.tab-${tabName}`).addClass('active');
    $(`#${tabName}Tab`).addClass('active');
}

// Menu responsive toggle
function toggleMenu() {
    $('#menuItems').toggleClass('active');
}

// Chiudi modal cliccando fuori
$(window).on('click', function(e) {
    if ($(e.target).hasClass('modal')) {
        $(e.target).css('display', 'none');
    }
});

// Inizializzazione app
$(document).ready(function() {
    loadAllData();
    setupEventListeners();
});