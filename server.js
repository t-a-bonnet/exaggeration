import express from 'express';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const port = 3000;

const GITHUB_CSV_URL = 'https://raw.githubusercontent.com/t-a-bonnet/exaggeration/main/sampled_climate_data.csv';

app.use(express.static('public'));
app.use(express.json());

// Fetch CSV from GitHub
app.get('/data', async (req, res) => {
    try {
        const response = await axios.get(GITHUB_CSV_URL);
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error fetching CSV file');
    }
});

// Update CSV on GitHub (if necessary)
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