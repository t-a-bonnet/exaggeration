import fetch from 'node-fetch';

const owner = 't-a-bonnet';  // Correct GitHub username
const repo = 'exaggeration'; // Correct repository name
const path = 'sampled_climate_data.csv'; // Correct path to your CSV file
const token = process.env.GITHUB_TOKEN;

const githubApiBase = 'https://api.github.com';

export async function handler(event) {
    try {
        // Parse and validate input
        const { id, text } = JSON.parse(event.body);
        const idString = id.toString();
        const textString = text.toString();

        if (!idString || !textString) {
            console.error('Invalid input:', { id: idString, text: textString });
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Invalid input: id and text must be non-empty strings' })
            };
        }

        // Log the GitHub API request URL
        const fileUrl = `${githubApiBase}/repos/${owner}/${repo}/contents/${path}`;
        console.log(`Fetching file from: ${fileUrl}`);

        // Get the file content and SHA
        const response = await fetch(fileUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API response error: ${response.status} ${response.statusText}`);
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

        const header = rows[0];
        const dataRows = rows.slice(1);

        // Find and update the row with the matching id
        let updated = false;
        const updatedRows = dataRows.map(row => {
            const columns = row.split(',');
            if (columns[0] === idString) {
                updated = true;
                return [idString, textString].concat(columns.slice(2)).join(',');
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
        const updateResponse = await fetch(`${githubApiBase}/repos/${owner}/${repo}/contents/${path}`, {
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

        if (!updateResponse.ok) {
            throw new Error(`GitHub API response error: ${updateResponse.status} ${updateResponse.statusText}`);
        }

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