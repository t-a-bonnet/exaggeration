const axios = require('axios');
const { Buffer } = require('buffer');

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 't-a-bonnet';
const REPO_NAME = 'exaggeration';
const FILE_PATH = 'data.csv';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { name, email } = JSON.parse(event.body);

    try {
        // Fetch the current content of the CSV file
        const { data: fileData } = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        // Decode the current content
        const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf8').trim();

        // Check if the file is empty or has no headers
        let newContent;
        if (decodedContent === '') {
            // If the file is empty, add headers and the new data
            newContent = `Name,Email\n${name},${email}\n`;
        } else {
            // Split content by lines
            const lines = decodedContent.split('\n');
            
            // Check if headers are already present
            const headers = lines[0];
            if (headers !== 'Name,Email') {
                // Add headers if not present
                newContent = `Name,Email\n${decodedContent}\n${name},${email}`;
            } else {
                // Append the new data under the existing headers
                newContent = `${decodedContent}\n${name},${email}`;
            }
        }

        // Update the CSV file with the new content
        await axios.put(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Add new submission',
            content: Buffer.from(newContent).toString('base64'),
            sha: fileData.sha
        }, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Data saved successfully!' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error saving data.', error: error.message })
        };
    }
};