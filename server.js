const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

let csvData = [];
const csvFilePath = 'sampled_climate_data.csv';

// Read CSV file
function readCSV() {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                csvData = results;
                resolve(results);
            })
            .on('error', (error) => reject(error));
    });
}

// Write CSV file
function writeCSV(data) {
    const writer = csvWriter({
        path: csvFilePath,
        header: Object.keys(data[0]).map(key => ({id: key, title: key}))
    });

    return writer.writeRecords(data);
}

app.get('/data', async (req, res) => {
    try {
        const data = await readCSV();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read CSV file' });
    }
});

app.post('/data', async (req, res) => {
    try {
        const newData = req.body;
        await writeCSV(newData);
        res.status(200).json({ message: 'CSV file updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to write CSV file' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});