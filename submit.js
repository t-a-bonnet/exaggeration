const axios = require('axios');
const { Buffer } = require('buffer');
const XLSX = require('xlsx');

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 't-a-bonnet';
const REPO_NAME = 'exaggeration';
const FILE_PATH = 'data.xlsx';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { name, email } = JSON.parse(event.body);

    try {
        // Fetch the current content of the Excel file
        const { data: fileData } = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        // Decode the current content
        const decodedContent = Buffer.from(fileData.content, 'base64');

        // Read the workbook
        const workbook = XLSX.read(decodedContent, { type: 'buffer' });
        let worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert the worksheet to JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Check if headers are already present
        const headers = data[0];
        if (headers.join(',') !== 'Name,Email') {
            // Add headers if not present
            data.unshift(['Name', 'Email']);
        }

        // Add new data
        data.push([name, email]);

        // Create a new worksheet
        worksheet = XLSX.utils.aoa_to_sheet(data);

        // Create a new workbook and add the worksheet
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'Sheet1');

        // Write the new workbook to a buffer
        const newBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'buffer' });

        // Update the Excel file with the new content
        await axios.put(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Add new submission',
            content: Buffer.from(newBuffer).toString('base64'),
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