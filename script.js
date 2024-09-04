let athletes = {};
let arrivals = []; // Lista de chegadas

function appendNumber(number) {
    const display = document.getElementById('display');
    display.value += number;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function registerAthlete() {
    const display = document.getElementById('display');
    const athleteID = display.value.trim();

    // Imprime o valor que está sendo tentado registrar no console
    console.log(`Tentando registrar o ID: ${athleteID}`);

    if (athleteID === '' || !athletes[athleteID]) {
        alert('Atleta não encontrado ou número inválido.');
        return;
    }

    const athlete = athletes[athleteID];
    const currentTime = new Date().toLocaleTimeString();

    // Adiciona o atleta à lista de chegadas
    arrivals.push({
        id: athleteID,
        name: athlete.name,
        category: athlete.category,
        time: currentTime
    });

    // Persiste a lista de chegadas no localStorage
    localStorage.setItem('arrivals', JSON.stringify(arrivals));

    const tableBody = document.querySelector('#logTable tbody');
    const newRow = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = athleteID;

    const nameCell = document.createElement('td');
    nameCell.textContent = athlete.name;

    const categoryCell = document.createElement('td');
    categoryCell.textContent = athlete.category;

    const timeCell = document.createElement('td');
    timeCell.textContent = currentTime;

    newRow.appendChild(idCell);
    newRow.appendChild(nameCell);
    newRow.appendChild(categoryCell);
    newRow.appendChild(timeCell);

    tableBody.appendChild(newRow);

    clearDisplay();
}

function loadCSV(event) {
    const input = event.target;
    const reader = new FileReader();

    reader.onload = function() {
        const lines = reader.result.split('\n');
        lines.forEach(line => {
            const [id, name, category] = line.split(';').map(item => item.trim());
            if (id && name && category) {
                athletes[id] = {
                    name: name,
                    category: category
                };
            }
        });

        // Imprime a lista completa de atletas no console após o processamento do arquivo CSV
        console.log('Lista completa de atletas carregados:', athletes);

        alert('Arquivo CSV carregado com sucesso!');
    };

    reader.readAsText(input.files[0]);
}
