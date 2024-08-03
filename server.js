import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/data', async (req, res) => {
    try {
        const filePath = path.resolve('sampled_climate_data.csv');
        const data = await fs.readFile(filePath, 'utf8');
        res.send(data);
    } catch (error) {
        res.status(500).send('Error reading CSV file');
    }
});

app.post('/update', async (req, res) => {
    try {
        const { csvString } = req.body;
        const filePath = path.resolve('sampled_climate_data.csv');
        await fs.writeFile(filePath, csvString, 'utf8');
        res.send('CSV updated successfully');
    } catch (error) {
        res.status(500).send('Error writing CSV file');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});