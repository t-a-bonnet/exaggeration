const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define the CSV file path
const csvFilePath = path.join(__dirname, 'data.csv');

// Create a CSV writer
const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' }
    ],
    append: true
});

// Endpoint to handle form submission
app.post('/submit', (req, res) => {
    const { name, email } = req.body;

    csvWriter.writeRecords([{ name, email }])
        .then(() => {
            res.send('Data saved successfully!');
        })
        .catch(error => {
            res.status(500).send('Error saving data.');
            console.error(error);
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});