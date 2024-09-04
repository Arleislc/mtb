// Função para recuperar e exibir os dados ordenados
function displayOrderedArrivals() {
    // Recupera a lista de chegadas do localStorage
    const arrivals = JSON.parse(localStorage.getItem('arrivals')) || [];

    // Ordena os atletas pela hora de chegada
    arrivals.sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.time}Z`);
        const timeB = new Date(`1970-01-01T${b.time}Z`);
        return timeA - timeB;
    });

    const tableBody = document.querySelector('#arrivalTable tbody');

    arrivals.forEach((athlete, index) => {
        const newRow = document.createElement('tr');

        const positionCell = document.createElement('td');
        positionCell.textContent = index + 1;

        const idCell = document.createElement('td');
        idCell.textContent = athlete.id;

        const nameCell = document.createElement('td');
        nameCell.textContent = athlete.name;

        const categoryCell = document.createElement('td');
        categoryCell.textContent = athlete.category;

        const timeCell = document.createElement('td');
        timeCell.textContent = athlete.time;

        newRow.appendChild(positionCell);
        newRow.appendChild(idCell);
        newRow.appendChild(nameCell);
        newRow.appendChild(categoryCell);
        newRow.appendChild(timeCell);

        tableBody.appendChild(newRow);
    });
}

// Chama a função para exibir os atletas ordenados por ordem de chegada
displayOrderedArrivals();
