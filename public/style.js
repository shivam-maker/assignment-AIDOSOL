// Simulated user credentials (for demo purposes)
const credentials = { username: 'user', password: 'password' };

// Handle Login
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username === credentials.username && password === credentials.password) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'block';
        fetchExcelData(); // Fetch data after login
    } else {
        document.getElementById('login-message').textContent = 'Invalid login credentials';
    }
});

// Fetch Excel Data from Backend
function fetchExcelData() {
    fetch('/api/excelData')
        .then(response => response.json())
        .then(data => {
            renderChart(data);
            populateTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Render FusionChart
function renderChart(data) {
    const chartData = data.map(item => ({ label: item.Label, value: item.Value }));

    new FusionCharts({
        type: 'column2d',
        renderAt: 'chart-container',
        width: '700',
        height: '400',
        dataFormat: 'json',
        dataSource: {
            chart: {
                caption: "Sales Data",
                xAxisName: "Month",
                yAxisName: "Value",
                theme: "fusion"
            },
            data: chartData
        }
    }).render();
}

// Populate a table with Excel data (for editing)
function populateTable(data) {
    const table = document.getElementById('data-table');
    table.innerHTML = ''; // Clear previous data
    data.forEach((row, index) => {
        const newRow = table.insertRow();
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);

        // Create input elements for editable data
        const inputLabel = document.createElement('input');
        inputLabel.type = 'text';
        inputLabel.value = row.Label;
        inputLabel.addEventListener('change', () => {
            row.Label = inputLabel.value;
        });

        const inputValue = document.createElement('input');
        inputValue.type = 'number';
        inputValue.value = row.Value;
        inputValue.addEventListener('change', () => {
            row.Value = parseInt(inputValue.value, 10);
        });

        cell1.appendChild(inputLabel);
        cell2.appendChild(inputValue);
    });
}

// Update Excel Data
document.getElementById('update-chart').addEventListener('click', function () {
    const table = document.getElementById('data-table');
    const updatedData = [];

    // Read data from table inputs
    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const label = row.cells[0].getElementsByTagName('input')[0].value;
        const value = row.cells[1].getElementsByTagName('input')[0].value;
        updatedData.push({ Label: label, Value: parseInt(value, 10) });
    }

    // Send updated data to backend to update Excel file
    fetch('/api/updateExcel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            renderChart(updatedData); // Re-render chart with updated data
        })
        .catch(error => console.error('Error updating data:', error));
});