const axios = require('axios');
const { Buffer } = require('buffer');

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 't-a-bonnet';
const REPO_NAME = 'exaggeration';
const FILE_PATH = 'data.csv';
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
        const rows = fileContent.trim().split('\n').map(row => row.split(','));

        // Step 2: Update the specified row
        if (id < 0 || id >= rows.length - 1) { // -1 to exclude header row
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Row index out of bounds' })
            };
        }

        // Assuming the 'body_parent' column exists in the CSV
        const header = rows[0];
        const columnIndex = header.indexOf('body_parent');

        if (columnIndex === -1) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Column "body_parent" not found' })
            };
        }

        rows[id + 1][columnIndex] = text; // Update the row

        // Convert rows back to CSV format
        const updatedContent = rows.map(row => row.join(',')).join('\n');

        // Step 3: Get the SHA of the current file (needed for updating)
        const { data: fileData } = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        // Step 4: Update the file on GitHub
        await axios.put(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Update data.csv',
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
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Internal Server Error' })
        };
    }
};