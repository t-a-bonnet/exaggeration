import axios from 'axios';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

export async function handler(event, context) {
    const url = 'https://raw.githubusercontent.com/t-a-bonnet/exaggeration/main/sampled_climate_data.csv';

    try {
        const response = await axios.get(url, { responseType: 'stream' });
        const csvData = [];

        await new Promise((resolve, reject) => {
            Readable.from(response.data)
                .pipe(csvParser())
                .on('data', (data) => {
                    console.log('Row Data:', data); // Log each row to check data
                    csvData.push(data);
                })
                .on('end', () => resolve())
                .on('error', (error) => reject(error));
        });

        return {
            statusCode: 200,
            body: JSON.stringify(csvData),
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data from GitHub' }),
        };
    }
};