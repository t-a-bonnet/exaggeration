const axios = require('axios');
const { Buffer } = require('buffer');

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 't-a-bonnet';
const REPO_NAME = 'exaggeration';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const BRANCH = 'dev'; // Specify the branch here

// Function to parse CSV text, handling commas within quotes
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

// Function to format CSV text with escaping and quoting
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
        const { updates, fileName } = JSON.parse(event.body);

        if (!fileName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'fileName is required' })
            };
        }

        if (!Array.isArray(updates) || updates.some(update => 
            typeof update.id !== 'number' || 
            typeof update.text !== 'string' || 
            typeof update.column !== 'string'
        )) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Invalid input' })
            };
        }

        // Fetch the file metadata to get the SHA from the specified branch
        const { data: fileData } = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}?ref=${BRANCH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        // Fetch the raw content of the file using the download URL
        const fileContentResponse = await axios.get(fileData.download_url);
        const fileContent = fileContentResponse.data;

        const rows = parseCSV(fileContent.trim());
        if (rows.length < 2) {
            console.error('No rows in CSV file.');
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'No rows in CSV file' })
            };
        }

        const header = rows[0]; // Extract the header row
        const dataRows = rows.slice(1); // Skip the header row

        // Create a mapping of column names to their indices
        const columnIndices = {};
        header.forEach((col, index) => {
            columnIndices[col] = index;
        });

        // Process update
        updates.forEach(({ id, column, text }) => {
            const columnIndex = columnIndices[column];
            if (columnIndex === undefined) {
                throw new Error(`Column "${column}" not found`);
            }

            if (id < 0 || id >= dataRows.length) {
                throw new Error('Row index out of bounds');
            }

            // Update the specified column with the new text
            dataRows[id][columnIndex] = text;
        });

        // Convert rows back to CSV format
        const updatedContent = formatCSV([header, ...dataRows]);

        // Update the CSV on GitHub
        await axios.put(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}`, {
            message: `Update ${fileName}`,
            content: Buffer.from(updatedContent).toString('base64'),
            sha: fileData.sha, // Required SHA for the update
            branch: BRANCH // Specify the branch here
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