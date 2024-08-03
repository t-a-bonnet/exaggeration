const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

app.post('/update-csv', (req, res) => {
    const { row, text } = req.body;

    // Path to your CSV file
    const csvFilePath = path.join(__dirname, 'sampled_climate_data.csv');

    fs.readFile(csvFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading CSV file:', err);
            return res.status(500).send('Error reading CSV file');
        }

        const rows = data.trim().split('\n');
        if (row >= rows.length - 1) {
            return res.status(400).send('Invalid row index');
        }

        const header = rows[0];
        const columns = rows[row + 1].split(',');

        // Update the column data
        columns[0] = text; // Assuming 'body_parent' is the first column
        rows[row + 1] = columns.join(',');

        // Write back the updated data to the CSV file
        const updatedData = rows.join('\n');
        fs.writeFile(csvFilePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing CSV file:', err);
                return res.status(500).send('Error writing CSV file');
            }

            res.json({ success: true });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});