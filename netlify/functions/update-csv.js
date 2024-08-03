import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = 't-b-bonnet';  // Replace with your GitHub username
const repo = 'exaggeration';          // Replace with your repository name
const path = 'sampled_climate_data.csv'; // Path to your CSV file

export async function handler(event) {
    try {
        let { id, text } = JSON.parse(event.body);
        id = id.toString();
        text = text.toString();
        if (typeof id !== 'string' || typeof text !== 'string') {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Invalid input' })
            };
        }

        // Get the file content and SHA
        const { data: fileData } = await octokit.repos.getContent({
            owner,
            repo,
            path
        });

        const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const rows = currentContent.trim().split('\n');

        // Extract header and rows
        const header = rows[0];
        const dataRows = rows.slice(1);

        // Find the row with the matching id
        let updated = false;
        const updatedRows = dataRows.map(row => {
            const columns = row.split(',');
            if (columns[0] === id) { // Check if id matches
                updated = true;
                return [id, text].join(','); // Update the row
            }
            return row;
        });

        if (!updated) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'ID not found' })
            };
        }

        const updatedContent = [header, ...updatedRows].join('\n');

        // Update the file on GitHub
        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: 'Update CSV file via API',
            content: Buffer.from(updatedContent).toString('base64'),
            sha: fileData.sha
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'File updated successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: error.message })
        };
    }
}