// netlify-functions/fetch-csv.js
import axios from 'axios';

export async function handler(event) {
    const GITHUB_CSV_URL = 'https://raw.githubusercontent.com/t-a-bonnet/exaggeration/main/sampled_climate_data.csv';
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    try {
        const response = await axios.get(GITHUB_CSV_URL, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        });
        return {
            statusCode: 200,
            body: response.data
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error fetching CSV file: ${error.message}`
        };
    }
}