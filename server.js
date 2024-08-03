import express from 'express';
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'data', 'sampled_climate_data.csv');

app.use(express.static('public'));
app.use(express.json());

app.get('/data/sampled_climate_data.csv', (req, res) => {
    res.sendFile(dataFilePath);
});

app.post('/update-csv', (req, res) => {
    const { id, text } = req.body;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ success: false, message: 'Error reading file' });
        }

        const rows = data.trim().split('\n');

        if (rows.length < 2) {
            return res.status(400).json({ success: false, message: 'CSV file does not contain enough rows' });
        }

        const header = rows[0];
        const dataRows = rows.slice(1);

        let updated = false;
        const updatedRows = dataRows.map((row, index) => {
            if (index === id) {
                updated = true;
                const columns = row.split(',');
                columns[1] = text; // Assuming text is updated in the second column
                return columns.join(',');
            }
            return row;
        });

        if (!updated) {
            return res.status(400).json({ success: false, message: 'ID not found' });
        }

        const updatedContent = [header, ...updatedRows].join('\n');

        fs.writeFile(dataFilePath, updatedContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ success: false, message: 'Error writing file' });
            }
            res.json({ success: true, message: 'File updated successfully' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});