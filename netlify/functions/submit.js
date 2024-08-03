const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { name, email } = JSON.parse(event.body);

    const content = `Name,Email\n${name},${email}\n`;
    const repo = 'exaggeration';
    const path = 'data.csv';
    const owner = 't-a-bonnet';

    try {
        const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path,
        });

        const decodedContent = Buffer.from(data.content, 'base64').toString('utf8');
        const newContent = decodedContent + `${name},${email}\n`;

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: 'Add new submission',
            content: Buffer.from(newContent).toString('base64'),
            sha: data.sha,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Data saved successfully!' }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error saving data.' }),
        };
    }
};