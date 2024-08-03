const axios = require('axios');
const { createObjectCsvWriter } = require('csv-writer');

exports.handler = async function(event, context) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const owner = 't-a-bonnet';
    const repo = 'exaggeration';
    const path = 'sampled_climate_data.csv';

    try {
        const data = JSON.parse(event.body).data;
        const csvWriter = createObjectCsvWriter({
            path: '/tmp/sampled_climate_data.csv',
            header: Object.keys(data[0]).map(key => ({ id: key, title: key }))
        });

        await csvWriter.writeRecords(data);

        const csvContent = require('fs').readFileSync('/tmp/sampled_climate_data.csv', 'utf8');
        const shaRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        const sha = shaRes.data.sha;

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
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update CSV file on GitHub' }),
        };
    }
};