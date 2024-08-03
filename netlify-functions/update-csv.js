// netlify-functions/update-csv.js
import axios from 'axios';
import { Buffer } from 'buffer';
import { stringify } from 'csv-stringify/sync';

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 't-a-bonnet';
const REPO_NAME = 'exaggeration';
const FILE_PATH = 'sampled_climate_data.csv';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { csvString } = JSON.parse(event.body);

    try {
        // Fetch the current content of the CSV file
        const { data: fileData } = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        // Update the CSV file
        await axios.put(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Update CSV file',
            content: Buffer.from(csvString).toString('base64'),
            sha: fileData.sha
        }, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            statusCode: 200,
            body: 'CSV updated successfully'
        };
    } catch (error) {
        console.error('Error updating CSV:', error);
        return {
            statusCode: 500,
            body: 'Error updating CSV file'
        };
    }
}