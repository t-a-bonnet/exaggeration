import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = 't-b-bonnet';  // Replace with your GitHub username
const repo = 'exaggeration'; // Replace with your repository name
const path = 'sampled_climate_data.csv'; // Path to your CSV file

export async function handler(event) {
    try {
        // Parse and validate input
        const { id, text } = JSON.parse(event.body);
        const idString = id.toString();
        const textString = text.toString();

        if (!idString || !textString) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Invalid input: id and text must be non-empty strings' })
            };
        }

        // Get the file content and SHA
        const { data: fileData } = await octokit.repos.getContent({
            owner,
            repo,
            path
        });

        if (!fileData.content) {
            throw new Error('File content is missing');
        }

        // Decode and process the file content
        const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const rows = currentContent.trim().split('\n');

        // Extract header and rows
        const header = rows[0];
        const dataRows = rows.slice(1);

        // Find and update the row with the matching id
        let updated = false;
        const updatedRows = dataRows.map(row => {
            const columns = row.split(',');
            if (columns[0] === idString) {
                updated = true;
                return [idString, textString].join(','); // Update the row
            }
            return row;
        });

        if (!updated) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'ID not found' })
            };
        }

        // Prepare updated content and encode it
        const updatedContent = [header, ...updatedRows].join('\n');
        const updatedContentBase64 = Buffer.from(updatedContent).toString('base64');

        // Update the file on GitHub
        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: 'Update CSV file via API',
            content: updatedContentBase64,
            sha: fileData.sha
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'File updated successfully' })
        };
    } catch (error) {
        console.error('Error:', error); // Log the error for debugging
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message })
        };
    }
}