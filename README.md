# Inventory Manager 📦
![PHP](https://img.shields.io/badge/PHP-8.x-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow) ![MySQL](https://img.shields.io/badge/MySQL-Database-orange) ![CSS](https://img.shields.io/badge/CSS3-Styling-blueviolet) ![Status](https://img.shields.io/badge/Status-Active-success)

## 🧠 Panoramica del progetto
Inventory Manager è una web application progettata per la gestione completa di un magazzino tramite browser. L’applicazione è costruita attorno a quattro elementi fondamentali, ovvero prodotti, categorie, fornitori e movimenti, che rappresentano il nucleo logico dell’intero sistema. Tutte le funzionalità ruotano attorno a questi componenti e alle relazioni che li collegano.

## 🛠️ Stack tecnologico
Il backend è sviluppato in PHP e gestisce la logica applicativa, la persistenza dei dati e la sicurezza delle operazioni. Il frontend utilizza JavaScript per la gestione dinamica dell’interfaccia e delle chiamate asincrone, mentre MySQL viene impiegato come database relazionale per organizzare e collegare i dati del magazzino. CSS definisce l’aspetto grafico e la struttura dell’interfaccia.

## 📦 Gestione dei prodotti
I prodotti rappresentano l’elemento centrale del magazzino. Ogni prodotto viene memorizzato nel database con le informazioni principali necessarie alla sua identificazione e gestione operativa. L’interfaccia consente la visualizzazione dinamica dell’elenco prodotti e l’interazione con essi tramite operazioni gestite lato backend. Le modifiche ai prodotti vengono propagate in tempo reale all’interfaccia attraverso chiamate asincrone.

## 🗂️ Gestione delle categorie
Le categorie vengono utilizzate per organizzare e classificare i prodotti in modo strutturato. Ogni prodotto è associato a una categoria, permettendo una suddivisione logica del magazzino e una consultazione più ordinata dei dati. La gestione delle categorie avviene tramite il backend e viene riflessa immediatamente nel frontend, mantenendo la coerenza tra struttura e contenuti.

## 🏭 Gestione dei fornitori
I fornitori rappresentano le entità da cui provengono i prodotti. Il sistema consente di associare ogni prodotto a un fornitore specifico, creando un collegamento diretto tra articoli e origine. Questo approccio permette di tracciare in modo chiaro la provenienza dei prodotti e di mantenere un database coerente delle relazioni commerciali.

## 🔄 Gestione dei movimenti di magazzino
I movimenti costituiscono il meccanismo attraverso cui viene tracciata ogni variazione di quantità all’interno del magazzino. Ogni carico o scarico viene registrato come movimento e collegato al prodotto interessato. Questo sistema consente di mantenere uno storico delle operazioni e di calcolare lo stato attuale delle giacenze in modo dinamico e affidabile.

## 🔐 Autenticazione e sicurezza
L’accesso all’applicazione è protetto da un sistema di autenticazione che gestisce le sessioni lato server. Solo gli utenti autenticati possono interagire con le funzionalità di gestione del magazzino, riducendo il rischio di accessi non autorizzati e garantendo la protezione dei dati.

## 🔄 API e comunicazione asincrona
La comunicazione tra frontend e backend avviene tramite un’API interna che gestisce tutte le operazioni di lettura e scrittura dei dati. Le richieste asincrone consentono di aggiornare i contenuti senza ricaricare la pagina, migliorando l’esperienza utente e mantenendo l’interfaccia sempre sincronizzata con il database.

## 🗂️ Struttura e organizzazione del codice
Il progetto è organizzato in modo modulare, con file separati per configurazione, autenticazione, API e gestione dell’interfaccia. Questa struttura rende il codice facilmente leggibile per uno sviluppatore e semplifica l’aggiunta di nuove funzionalità senza impatti sulle parti esistenti.

## ⚙️ Configurazione dell’ambiente
Per utilizzare Inventory Manager è necessario configurare la connessione al database MySQL tramite il file di configurazione dedicato. Una volta completata questa operazione, l’applicazione è pronta all’uso in un ambiente web con supporto PHP.

## 🚀 Estendibilità e sviluppo futuro
L’architettura dell’applicazione consente di introdurre facilmente funzionalità avanzate come reportistica, gestione dei ruoli utente, statistiche sui movimenti o integrazioni con sistemi esterni. Il progetto è pensato come base tecnica solida per evoluzioni future.

## 📌 Stato del progetto
Inventory Manager è un progetto attivo e funzionante, utilizzabile sia come applicazione reale sia come base di partenza per ulteriori sviluppi personalizzati.
