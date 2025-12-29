# Inventory Manager 📦
![PHP](https://img.shields.io/badge/PHP-8.x-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow) ![MySQL](https://img.shields.io/badge/MySQL-Database-orange) ![CSS](https://img.shields.io/badge/CSS3-Styling-blueviolet) ![Status](https://img.shields.io/badge/Status-Active-success)

## 🧠 Panoramica del progetto
Inventory Manager è una web application progettata per la gestione completa di un magazzino tramite browser. L’applicazione è costruita attorno a quattro elementi fondamentali, ovvero prodotti, categorie, fornitori e movimenti, che rappresentano il nucleo logico dell’intero sistema. Tutte le funzionalità ruotano attorno a questi componenti e alle relazioni che li collegano.

## 🛠️ Stack tecnologico
Il backend è sviluppato in PHP e gestisce la logica applicativa, la persistenza dei dati e la sicurezza delle operazioni. Il frontend utilizza JavaScript per la gestione dinamica dell’interfaccia e delle chiamate asincrone, mentre MySQL viene impiegato come database relazionale per organizzare e collegare i dati del magazzino. CSS definisce l’aspetto grafico e la struttura dell’interfaccia.

## 📦 Gestione dei prodotti
I prodotti rappresentano l’elemento centrale del magazzino e costituiscono il punto di riferimento per tutte le altre entità del sistema. Ogni prodotto viene memorizzato nel database con le informazioni necessarie alla sua identificazione ed è collegato logicamente a una categoria e a un fornitore. Le operazioni sui prodotti vengono gestite lato backend e riflesse dinamicamente nel frontend tramite chiamate asincrone.

## 🗂️ Gestione delle categorie
Le categorie permettono di organizzare i prodotti in modo strutturato e coerente. Ogni prodotto è associato a una categoria, consentendo una classificazione ordinata del magazzino e una migliore leggibilità dei dati. La gestione delle categorie è centralizzata nel backend e ogni modifica viene immediatamente resa disponibile nell’interfaccia utente.

## 🏭 Gestione dei fornitori
I fornitori rappresentano l’origine dei prodotti presenti in magazzino. Il sistema consente di associare ciascun prodotto a un fornitore specifico, creando un collegamento stabile tra articolo e provenienza. Questo modello facilita la tracciabilità e mantiene coerente la struttura dei dati relazionali.

## 🔄 Gestione dei movimenti di magazzino
I movimenti sono il cuore operativo dell’applicazione e rappresentano ogni variazione delle quantità in magazzino. Ogni operazione di carico o scarico viene registrata come movimento e collegata al prodotto di riferimento. Questo approccio consente di mantenere uno storico completo delle operazioni e di ricostruire in qualsiasi momento l’andamento delle giacenze.

## 🔐 Autenticazione e sicurezza
L’accesso all’applicazione è protetto da un sistema di autenticazione basato su sessioni PHP. Solo gli utenti autenticati possono accedere alle funzionalità amministrative e di gestione del magazzino. La gestione delle sessioni avviene lato server per garantire il controllo degli accessi e la protezione dei dati.

## 🔄 API e comunicazione asincrona
Il frontend comunica con il backend tramite un’API interna che gestisce tutte le operazioni di lettura e scrittura sul database. Le chiamate asincrone permettono di aggiornare i contenuti senza ricaricare la pagina, mantenendo l’interfaccia sincronizzata con lo stato reale del magazzino.

## 🗂️ Struttura e organizzazione del codice
Il progetto è organizzato in modo modulare, con una chiara separazione tra file di configurazione, logica applicativa, gestione dell’autenticazione e script frontend. Questa struttura rende il codice facilmente comprensibile per uno sviluppatore e semplifica la manutenzione e l’estensione del progetto.

## 🌐 Demo online
È disponibile una demo pubblica dell’applicazione, pensata esclusivamente per scopi dimostrativi e di test. La demo consente di esplorare tutte le funzionalità principali del sistema e di accedere all’area amministrativa per valutarne il comportamento reale.

La demo pubblica è accessibile all’indirizzo https://smal.netsons.org/magazzino/.  
L’area di amministrazione è disponibile all’indirizzo https://smal.netsons.org/magazzino/admin.php.

Le credenziali fornite sono esclusivamente di test e non devono essere considerate sicure per ambienti di produzione. Nome utente admin e password admin123 sono pubbliche e utilizzabili solo a fini dimostrativi.

## 🔁 Flusso dati interno
Il flusso dei dati all’interno dell’applicazione è basato sulla relazione tra prodotti e movimenti. I prodotti rappresentano l’entità statica del sistema, mentre i movimenti rappresentano le variazioni dinamiche delle quantità. Ogni movimento è sempre associato a un singolo prodotto e indica un incremento o una diminuzione della giacenza.

La giacenza corrente di un prodotto non viene gestita come valore isolato, ma deriva logicamente dall’insieme dei movimenti registrati nel tempo. Questo approccio garantisce coerenza dei dati, tracciabilità delle operazioni e possibilità di analisi storica. Categorie e fornitori fungono da elementi di classificazione e relazione, senza influire direttamente sul calcolo delle quantità.

## ⚙️ Configurazione dell’ambiente
Per utilizzare Inventory Manager in locale o su un proprio server è necessario configurare la connessione al database MySQL tramite il file di configurazione dedicato. Una volta completata questa operazione, l’applicazione è immediatamente utilizzabile in un ambiente web con supporto PHP.

## 🚀 Estendibilità e sviluppo futuro
L’architettura modulare del progetto consente l’introduzione di funzionalità avanzate come reportistica sulle giacenze, statistiche sui movimenti, gestione dei ruoli utente o integrazioni con sistemi esterni. Inventory Manager è pensato come base tecnica solida per evoluzioni future.

## 📌 Stato del progetto
Inventory Manager è un progetto attivo e funzionante, utilizzabile sia come applicazione reale sia come base di partenza per sviluppi personalizzati.
