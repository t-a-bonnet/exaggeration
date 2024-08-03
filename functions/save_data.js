const axios = require('axios');
const { parse, stringify } = require('csv');

exports.handler = async function(event, context) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const owner = 't-a-bonnet';
    const repo = 'exaggeration';
    const path = 'sampled_climate_data.csv';

    try {
        const data = JSON.parse(event.body).data;

        // Convert JSON data back to CSV
        const csvContent = await new Promise((resolve, reject) => {
            stringify(data, { header: true }, (err, output) => {
                if (err) reject(err);
                resolve(output);
            });
        });

        // Get the current SHA of the file to update it
        const shaRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        const sha = shaRes.data.sha;

        // Update the CSV file on GitHub
        await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            message: 'Update CSV file',
            content: Buffer.from(csvContent).toString('base64'),
            sha,
        }, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'CSV file updated successfully' }),
        };
    } catch (error) {
        console.error('Error saving data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update CSV file on GitHub' }),
        };
    }
};