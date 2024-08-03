import axios from 'axios';

const textBox = document.getElementById('text-box');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');

let currentIndex = 0;
let csvData = [];
let headers = [];

async function fetchCSV() {
    try {
        const response = await axios.get('/data');
        const rows = response.data.split('\n').map(row => row.split(','));
        headers = rows[0];
        csvData = rows.slice(1);
        displayRow(currentIndex);
    } catch (error) {
        console.error('Error fetching CSV data:', error);
    }
}

function displayRow(index) {
    if (index >= 0 && index < csvData.length) {
        textBox.value = csvData[index][headers.indexOf('body_parent')] || '';
    }
}

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayRow(currentIndex);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < csvData.length - 1) {
        currentIndex++;
        displayRow(currentIndex);
    }
});

submitBtn.addEventListener('click', async () => {
    try {
        csvData[currentIndex][headers.indexOf('body_parent')] = textBox.value;
        const csvString = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
        await axios.post('/update', { csvString });
        alert('Changes saved!');
    } catch (error) {
        console.error('Error saving CSV data:', error);
    }
});

fetchCSV();