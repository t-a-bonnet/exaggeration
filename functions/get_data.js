const axios = require('axios');
const csvParser = require('csv-parser');

exports.handler = async function(event, context) {
    const url = 'https://raw.githubusercontent.com/t-a-bonnet/exaggeration/main/sampled_climate_data.csv';

    try {
        const response = await axios.get(url);
        const csvData = [];
        require('stream').Readable.from(response.data)
            .pipe(csvParser())
            .on('data', (data) => csvData.push(data))
            .on('end', () => {
                console.log('CSV Data:', csvData); // Log the data to verify it
                return {
                    statusCode: 200,
                    body: JSON.stringify(csvData),
                };
            });
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data from GitHub' }),
        };
    }
};