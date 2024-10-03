
const express = require('express');
const XLSX = require('xlsx');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to read Excel file
function readExcelFile() {
    const workbook = XLSX.readFile('data.xlsx'); // Path to your Excel file
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}

// Function to write data to Excel file
function writeExcelFile(data) {
    const workbook = XLSX.readFile('data.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[sheetName] = worksheet;
    XLSX.writeFile(workbook, 'data.xlsx');
}

// Route to serve index.html at root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API to get Excel data
app.get('/api/excelData', (req, res) => {
    const data = readExcelFile();
    res.json(data);
});

// API to update Excel data
app.post('/api/updateExcel', (req, res) => {
    const updatedData = req.body;
    writeExcelFile(updatedData);
    res.send({ message: 'Excel data updated successfully!' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
