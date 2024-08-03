// netlify-functions/update-csv.js
import axios from 'axios';

export async function handler(event) {
    const { csvString } = JSON.parse(event.body);
    const GITHUB_UPDATE_URL = 'https://api.github.com/repos/t-a-bonnet/exaggeration/contents/sampled_climate_data.csv';
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    try {
        const response = await axios.get(GITHUB_UPDATE_URL, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        const sha = response.data.sha;

        await axios.put(GITHUB_UPDATE_URL, {
            message: 'Update CSV file',
            content: Buffer.from(csvString).toString('base64'),
            sha: sha
        }, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            statusCode: 200,
            body: 'CSV updated successfully'
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error updating CSV file: ${error.message}`
        };
    }
}