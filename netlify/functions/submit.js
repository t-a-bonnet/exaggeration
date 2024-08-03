import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export async function handler(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let name, email;
    try {
        const body = JSON.parse(event.body);
        name = body.name;
        email = body.email;

        console.log('Received data:', { name, email });

        const content = `Name,Email\n${name},${email}\n`;
        const repo = 'exaggeration';
        const path = 'data.csv';
        const owner = 't-a-bonnet';

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
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error saving data.', error: error.message }),
        };
    }
}