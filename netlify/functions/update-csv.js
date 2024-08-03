const axios = require('axios');
const { Buffer } = require('buffer');

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 't-a-bonnet';
const REPO_NAME = 'exaggeration';
const FILE_PATH = 'sampled_climate_data.csv';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
        };
    }

    try {
        const { id, text } = JSON.parse(event.body);

        if (typeof id !== 'number' || typeof text !== 'string') {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Invalid input' })
            };
        }

        // Step 1: Fetch the current file content from GitHub
        const response = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3.raw'
            }
        });

        const fileContent = Buffer.from(response.data, 'base64').toString('utf8');
        console.log('File Content:', fileContent); // Log the entire file content

        const rows = fileContent.trim().split('\n'); // Split into rows
        if (rows.length < 2) {
            console.error('Not enough rows in CSV file.');
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Not enough rows in CSV file' })
            };
        }

        const header = rows[0].split(','); // Extract the header row
        const columnIndex = header.indexOf('body_parent'); // Find the index of the 'body_parent' column

        console.log('Header:', header); // Log the header row
        console.log('Column Index of body_parent:', columnIndex); // Log the column index

        if (columnIndex === -1) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Column "body_parent" not found' })
            };
        }

        const dataRows = rows.slice(1); // Skip the header row
        const parsedRows = dataRows.map(row => row.split(','));
        console.log('Parsed Rows:', parsedRows); // Log the parsed rows

        if (id < 0 || id >= parsedRows.length) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Row index out of bounds' })
            };
        }

        parsedRows[id][columnIndex] = text; // Update the row

        // Convert rows back to CSV format
        const updatedContent = [header, ...parsedRows].map(row => row.join(',')).join('\n');

        // Step 3: Get the SHA of the current file (needed for updating)
        const { data: fileData } = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        // Step 4: Update the file on GitHub
        await axios.put(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Update sampled_climate_data.csv',
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