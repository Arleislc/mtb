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
        tableBody.appendChild(newRow);
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

initDB();
