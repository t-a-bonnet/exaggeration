import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const owner = 't-a-bonnet';  // Replace with your GitHub username
const repo = 'exaggeration'; // Replace with your repository name
const filePath = 'sampled_climate_data.csv'; // Path to your CSV file
const token = process.env.GITHUB_TOKEN;

app.post('/update-csv', async (req, res) => {
    const { id, text } = req.body;
    const idString = id.toString();
    const textString = text.toString();

    if (!idString || !textString) {
        return res.status(400).json({ success: false, message: 'Invalid input: id and text must be non-empty strings' });
    }

    try {
        // Fetch the file content and SHA
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API response error: ${response.statusText}`);
        }

        const fileData = await response.json();

        if (!fileData.content) {
            throw new Error('File content is missing');
        }

        // Decode and process the file content
        const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const rows = currentContent.trim().split('\n');

        if (rows.length < 2) {
            throw new Error('CSV file does not contain enough rows');
        }

        const header = rows[0].split(','); // Extract header row
        console.log('Header:', header); // Log header row to debug

        // Find the index of the 'body_parent' column by header name
        const columnIndex = header.indexOf('body_parent');
        if (columnIndex === -1) {
            throw new Error('Column "body_parent" not found');
        }

        const dataRows = rows.slice(1);

        // Find and update the row with the matching id
        let updated = false;
        const updatedRows = dataRows.map(row => {
            const columns = row.split(',');
            if (columns[0] === idString) {
                updated = true;
                // Update the specific column by index
                columns[columnIndex] = textString;
                return columns.join(',');
            }
            return row;
        });

        if (!updated) {
            return res.status(400).json({ success: false, message: 'ID not found' });
        }

        // Prepare updated content and encode it
        const updatedContent = [header.join(','), ...updatedRows].join('\n');
        const updatedContentBase64 = Buffer.from(updatedContent).toString('base64');

        // Update the file on GitHub
        await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update CSV file via API',
                content: updatedContentBase64,
                sha: fileData.sha
            })
        });

        return res.status(200).json({ success: true, message: 'File updated successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});