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
        loadAthletes(); // Carregar atletas ao inicializar o DB
    };

    request.onerror = function(event) {
        console.error('Erro ao abrir IndexedDB:', event.target.errorCode);
    };
}

// Carrega atletas e os exibe na tabela
function loadAthletes() {
    const transaction = db.transaction(['athletes']);
    const objectStore = transaction.objectStore('athletes');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const athletes = event.target.result;
        const tableBody = document.querySelector('#athletesTable tbody');
        tableBody.innerHTML = ''; // Limpar tabela antes de adicionar novos dados
        athletes.forEach(athlete => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${athlete.id}</td>
                <td>${athlete.name}</td>
                <td>${athlete.category}</td>
                <td>
                    <button onclick="editAthlete('${athlete.id}')">Editar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    request.onerror = function(event) {
        console.error('Erro ao carregar atletas:', event.target.errorCode);
    };
}

// Função para editar um atleta
function editAthlete(id) {
    const transaction = db.transaction(['athletes']);
    const objectStore = transaction.objectStore('athletes');
    const request = objectStore.get(id);

    request.onsuccess = function(event) {
        const athlete = event.target.result;
        if (athlete) {
            document.getElementById('editID').value = athlete.id;
            document.getElementById('editName').value = athlete.name;
            document.getElementById('editCategory').value = athlete.category;
            document.getElementById('editForm').style.display = 'block';
        }
    };

    request.onerror = function(event) {
        console.error('Erro ao recuperar atleta:', event.target.errorCode);
    };
}

// Atualiza um atleta
function updateAthlete() {
    const id = document.getElementById('editID').value;
    const name = document.getElementById('editName').value;
    const category = document.getElementById('editCategory').value;

    const transaction = db.transaction(['athletes'], 'readwrite');
    const objectStore = transaction.objectStore('athletes');
    const request = objectStore.put({ id, name, category });

    request.onsuccess = function() {
        console.log('Atleta atualizado com sucesso.');
        loadAthletes(); // Atualizar a tabela
        cancelEdit();
    };

    request.onerror = function(event) {
        console.error('Erro ao atualizar atleta:', event.target.errorCode);
    };
}

// Cancela a edição
function cancelEdit() {
    document.getElementById('editForm').style.display = 'none';
}

function loadCSV(event) {
    const input = event.target;
    const reader = new FileReader();

    reader.onload = function() {
        const lines = reader.result.split('\n');
        processCSVLines(lines);
    };

    reader.readAsText(input.files[0]);
}

function loadCSVFromText() {
    const csvText = document.getElementById('csvText').value;
    const lines = csvText.split('\n');
    processCSVLines(lines);
}

function processCSVLines(lines) {
    const transaction = db.transaction(['athletes'], 'readwrite');
    const objectStore = transaction.objectStore('athletes');

    lines.forEach(line => {
        const [id, name, category] = line.split(',').map(item => item.trim());
        if (id && name && category) {
            objectStore.put({ id, name, category });
        }
    });

    transaction.oncomplete = function() {
        console.log('Atletas carregados com sucesso.');
        loadAthletes(); // Atualizar tabela após carga
        alert('Atletas carregados com sucesso!');
    };

    transaction.onerror = function(event) {
        console.error('Erro ao carregar atletas:', event.target.errorCode);
    };
}

document.addEventListener('DOMContentLoaded', initDB);
