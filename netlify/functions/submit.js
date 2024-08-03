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
        // Fetch the current content of the XLSX file
        const { data: fileData } = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            },
            responseType: 'arraybuffer'
        });

        // Decode the current content
        const workbook = XLSX.read(fileData, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert the worksheet to JSON
        let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Check if the file is empty or has headers
        if (data.length === 0) {
            // If the file is empty, add headers and the new data
            data = [['Name', 'Email'], [name, email]];
        } else {
            // Add new data under existing headers
            data.push([name, email]);
        }

        // Create a new worksheet and workbook
        const newWorksheet = XLSX.utils.aoa_to_sheet(data);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
        
        // Write the workbook to a buffer
        const newFileData = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
        
        // Update the XLSX file with the new content
        await axios.put(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: 'Add new submission',
            content: Buffer.from(newFileData).toString('base64'),
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