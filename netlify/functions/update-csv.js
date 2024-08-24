const axios = require('axios');
const { Buffer } = require('buffer');

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 't-a-bonnet';
const REPO_NAME = 'exaggeration';
const FILE_PATH = 'Appen data 16.8.2024.csv';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

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

function formatCSV(rows) {
    return rows.map(row =>
        row.map(field => {
            let escapedField = field.replace(/"/g, '""');
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
        const { id, updates } = JSON.parse(event.body);

        if (typeof id !== 'number' || !Array.isArray(updates)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Invalid input' })
            };
        }

        const { data: fileData } = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        const fileContentResponse = await axios.get(fileData.download_url);
        const fileContent = fileContentResponse.data;

        const rows = parseCSV(fileContent.trim());
        if (rows.length < 2) {
            console.error('Not enough rows in CSV file.');
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Not enough rows in CSV file' })
            };
        }

        const header = rows[0];
        const dataRows = rows.slice(1);

        if (id < 0 || id >= dataRows.length) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Row index out of bounds' })
            };
        }

        updates.forEach(update => {
            if (typeof update.column !== 'string' || typeof update.value !== 'string') {
                throw new Error('Invalid update format');
            }
            const columnIndex = header.indexOf(update.column);
            if (columnIndex === -1) {
                throw new Error(`Column "${update.column}" not found`);
            }
            dataRows[id][columnIndex] = update.value;
        });

        const updatedContent = formatCSV([header, ...dataRows]);

        await axios.put(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Update Appen data 16.8.2024.csv',
            content: Buffer.from(updatedContent).toString('base64'),
            sha: fileData.sha
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