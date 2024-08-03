import axios from 'axios';
import { Buffer } from 'buffer'; // Import Buffer if needed, depending on your runtime environment

const owner = 't-b-bonnet';  // Replace with your GitHub username
const repo = 'exaggeration'; // Replace with your repository name
const path = 'sampled_climate_data.csv'; // Path to your CSV file
const token = process.env.GITHUB_TOKEN; // Ensure this token is set in your environment variables
console.log('GITHUB_TOKEN:', token);
const githubApiBase = 'https://api.github.com';

export async function handler(event) {
    try {
        // Parse and validate input
        const { id, text } = JSON.parse(event.body);
        const idString = id ? id.toString().trim() : '';
        const textString = text ? text.toString().trim() : '';

        if (!idString || !textString) {
            console.error('Invalid input:', { id: idString, text: textString });
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Invalid input: id and text must be non-empty strings' })
            };
        }

        // Get the file content and SHA
        const { data: fileData } = await axios.get(`${githubApiBase}/repos/${owner}/${repo}/contents/${path}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json' // Ensure correct header is set
            }
        });

        if (!fileData.content || !fileData.sha) {
            throw new Error('File content or SHA is missing');
        }

        // Decode and process the file content
        const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const rows = currentContent.trim().split('\n');

        if (rows.length < 2) {
            throw new Error('CSV file does not contain enough rows');
        }

        const header = rows[0];
        const dataRows = rows.slice(1);

        // Find and update the row with the matching id
        let updated = false;
        const updatedRows = dataRows.map(row => {
            const columns = row.split(',');
            if (columns[0] === idString) {
                updated = true;
                return [idString, textString, ...columns.slice(2)].join(','); // Ensure other columns are preserved
            }
            return row;
        });

        if (!updated) {
            console.error('ID not found:', idString);
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'ID not found' })
            };
        }

        // Prepare updated content and encode it
        const updatedContent = [header, ...updatedRows].join('\n');
        const updatedContentBase64 = Buffer.from(updatedContent).toString('base64');

        // Update the file on GitHub
        await axios.put(`${githubApiBase}/repos/${owner}/${repo}/contents/${path}`, {
            message: 'Update CSV file via API',
            content: updatedContentBase64,
            sha: fileData.sha
        }, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json' // Ensure correct header is set
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'File updated successfully' })
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message })
        };
    }
}