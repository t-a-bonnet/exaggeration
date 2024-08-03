const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = 't-a-bonnet';
const repo = 'exaggeration';
const path = 'sampled_climate_data.csv';

exports.handler = async (event) => {
    try {
        // Parse the JSON body
        const { row, text } = JSON.parse(event.body);
        if (typeof row !== 'number' || typeof text !== 'string') {
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
        const rows = currentContent.split('\n');
        rows[row + 1] = text;

        const updatedContent = rows.join('\n');

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
};