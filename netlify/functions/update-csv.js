const axios = require('axios');
const { Buffer } = require('buffer');

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 't-a-bonnet';
const REPO_NAME = 'exaggeration';
const FILE_PATH = 'Appen data 16.8.2024.csv';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Function to parse CSV text correctly, handling commas within quotes
function parseCSV(text) {
    const rows = [];
    const re = /"(?:[^"]|"")*"|[^,]+/g;
    let matches;

    text.split('\n').forEach(line => {
        const row = [];
        while ((matches = re.exec(line)) !== null) {
            row.push(matches[0].replace(/^"(.*)"$/, '$1').replace(/""/g, '"'));
        }
        rows.push(row);
    });

    return rows;
}

// Function to format CSV text with proper escaping and quoting
function formatCSV(rows) {
    return rows.map(row =>
        row.map(field => {
            // Escape double quotes
            let escapedField = field.replace(/"/g, '""');

            // Enclose fields containing commas, quotes, or new lines in double quotes
            if (escapedField.includes(',') || escapedField.includes('"') || escapedField.includes('\n')) {
                escapedField = `"${escapedField}"`;
            }

            return escapedField;
        }).join(',')
    ).join('\n');
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
        };
    }

    try {
        const { id, text, column } = JSON.parse(event.body);

        if (typeof id !== 'number' || typeof text !== 'string' || typeof column !== 'string') {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Invalid input' })
            };
        }

        // Step 1: Fetch the file metadata to get the SHA
        const { data: fileData } = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        // Step 2: Fetch the raw content of the file using the download URL
        const fileContentResponse = await axios.get(fileData.download_url);
        const fileContent = fileContentResponse.data;

        const rows = parseCSV(fileContent.trim()); // Parse CSV content
        if (rows.length < 2) {
            console.error('Not enough rows in CSV file.');
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Not enough rows in CSV file' })
            };
        }

        const header = rows[0]; // Extract the header row
        const columnIndex = header.indexOf(column); // Find the index of the specified column

        if (columnIndex === -1) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: `Column "${column}" not found` })
            };
        }

        const dataRows = rows.slice(1); // Skip the header row

        if (id < 0 || id >= dataRows.length) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Row index out of bounds' })
            };
        }

        // Update the specified column with the new text
        dataRows[id][columnIndex] = text;

        // Convert rows back to CSV format
        const updatedContent = formatCSV([header, ...dataRows]);

        // Step 3: Update the file on GitHub
        await axios.put(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Update Appen data 16.8.2024.csv',
            content: Buffer.from(updatedContent).toString('base64'),
            sha: fileData.sha // Required SHA for the update
        }, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message })
        };
    }
};