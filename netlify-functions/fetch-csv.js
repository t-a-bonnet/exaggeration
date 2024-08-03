// netlify-functions/fetch-csv.js
import axios from 'axios';
import { Buffer } from 'buffer';
import { parse } from 'csv-parse/sync';

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 't-a-bonnet';
const REPO_NAME = 'exaggeration';
const FILE_PATH = 'sampled_climate_data.csv';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function handler(event) {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Fetch the CSV file from GitHub
        const { data: fileData } = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        // Decode the base64 content
        const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf-8');

        // Parse CSV content
        const records = parse(decodedContent, {
            columns: true,
            skip_empty_lines: true
        });

        return {
            statusCode: 200,
            body: JSON.stringify(records)
        };
    } catch (error) {
        console.error('Error fetching CSV:', error);
        return {
            statusCode: 500,
            body: 'Error fetching CSV file'
        };
    }
}