const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Papa = require('papaparse');
const { Buffer } = require('buffer');

const app = express();
const port = 3000;

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 't-a-bonnet';
const REPO_NAME = 'exaggeration';
const FILE_PATH = 'sampled_climate_data.csv';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

app.post('/update-csv', async (req, res) => {
    const { row, text } = req.body;

    try {
        // Fetch the current content of the CSV file from GitHub
        const { data: fileData } = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        // Decode the current content
        const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf8');

        // Parse the CSV data
        const parsedData = Papa.parse(decodedContent, { header: false });
        let data = parsedData.data;

        // Find the header and column index
        const header = data[0];
        const columnIndex = header.indexOf('body_parent');

        if (columnIndex === -1) {
            return res.status(400).send('Column "body_parent" not found');
        }

        // Update the row data
        if (row >= 1 && row < data.length) {
            data[row][columnIndex] = text;
        } else {
            return res.status(400).send('Invalid row index');
        }

        // Convert data back to CSV
        const updatedContent = Papa.unparse(data);

        // Update the CSV file with the new content
        await axios.put(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Update CSV file',
            content: Buffer.from(updatedContent).toString('base64'),
            sha: fileData.sha
        }, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error saving data');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});