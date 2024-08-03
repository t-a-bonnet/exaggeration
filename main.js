import axios from 'axios';
import * as d3 from 'd3';

// Replace with your repository details
const GITHUB_REPO_OWNER = 't-a-bonnet';
const GITHUB_REPO_NAME = 'exaggeration';
const GITHUB_CSV_PATH = 'main/sampled_climate_data.csv'; // Adjust if necessary

// Fetch the CSV file from GitHub
const loadData = async () => {
    try {
        const response = await axios.get(`https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_CSV_PATH}`, {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`, // Ensure this token is set in Netlify
                'Accept': 'text/csv'
            }
        });
        const data = response.data;
        const parsedData = d3.csvParse(data);
        return parsedData;
    } catch (error) {
        console.error('Error fetching the CSV file:', error);
        return [];
    }
};

const updateText = (data, index) => {
    const textElement = document.getElementById('text');
    textElement.textContent = data[index].body_parent || 'No data available';
};

const init = async () => {
    const data = await loadData();
    let index = 0;

    if (data.length === 0) {
        document.getElementById('text').textContent = 'Failed to load data.';
        return;
    }

    updateText(data, index);

    document.getElementById('prev').addEventListener('click', () => {
        if (index > 0) {
            index -= 1;
            updateText(data, index);
        }
    });

    document.getElementById('next').addEventListener('click', () => {
        if (index < data.length - 1) {
            index += 1;
            updateText(data, index);
        }
    });
};

init();