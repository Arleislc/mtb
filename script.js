let db;

// Inicializa IndexedDB
function initDB() {
    const request = indexedDB.open('athletesDB', 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        const objectStore = db.createObjectStore('athletes', { keyPath: 'id' });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('category', 'category', { unique: false });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        loadRecords(); // Carregar registros ao inicializar o DB
    };

    request.onerror = function(event) {
        console.error('Erro ao abrir IndexedDB:', event.target.errorCode);
    };
}

// Adiciona ou atualiza um atleta no banco de dados
function saveAthlete(id, name, category) {
    const transaction = db.transaction(['athletes'], 'readwrite');
    const objectStore = transaction.objectStore('athletes');
    const request = objectStore.put({ id, name, category });

    request.onsuccess = function() {
        console.log('Atleta salvo com sucesso.');
    };

    request.onerror = function(event) {
        console.error('Erro ao salvar atleta:', event.target.errorCode);
    };
}

// Registra um atleta e salva a chegada
function registerAthlete() {
    const display = document.getElementById('display');
    const athleteID = display.value.trim();
    if (athleteID === '') {
        alert('Número inválido.');
        return;
    }

    const transaction = db.transaction(['athletes']);
    const objectStore = transaction.objectStore('athletes');
    const request = objectStore.get(athleteID);

    request.onsuccess = function(event) {
        const athlete = event.target.result;
        if (!athlete) {
            alert('Atleta não encontrado.');
            return;
        }

        const currentTime = new Date().toLocaleTimeString();
        const tableBody = document.querySelector('#logTable tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td>${athleteID}</td><td>${athlete.name}</td><td>${athlete.category}</td><td>${currentTime}</td>`;
        tableBody.insertBefore(newRow, tableBody.firstChild); // Adiciona na parte superior
        clearDisplay();
    };

    request.onerror = function(event) {
        console.error('Erro ao recuperar atleta:', event.target.errorCode);
    };
}

function appendNumber(number) {
    const display = document.getElementById('display');
    display.value += number;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function loadRecords() {
    const transaction = db.transaction(['athletes']);
    const objectStore = transaction.objectStore('athletes');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const athletes = event.target.result;
        const tableBody = document.querySelector('#logTable tbody');
        tableBody.innerHTML = ''; // Limpar tabela antes de adicionar novos dados

        // Ordenar atletas por horário de chegada
        athletes.sort((a, b) => new Date(b.arrivalTime) - new Date(a.arrivalTime));
        athletes.forEach(athlete => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${athlete.id}</td>
                <td>${athlete.name}</td>
                <td>${athlete.category}</td>
                <td>${athlete.arrivalTime || 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });
    };

    request.onerror = function(event) {
        console.error('Erro ao carregar registros:', event.target.errorCode);
    };
}

document.addEventListener('DOMContentLoaded', initDB);
