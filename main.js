import axios from 'axios';

const textBox = document.getElementById('text-box');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');

let currentIndex = 0;
let csvData = [];
let headers = [];
let bodyParentIndex = -1;

async function fetchCSV() {
    try {
        const response = await axios.get('/data');
        const rows = response.data.trim().split('\n').map(row => row.split(','));

        headers = rows[0];
        bodyParentIndex = headers.indexOf('body_parent');
        
        if (bodyParentIndex === -1) {
            throw new Error('body_parent column not found');
        }

        csvData = rows.slice(1);
        displayRow(currentIndex);
    } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
    }
}

function displayRow(index) {
    if (index >= 0 && index < csvData.length) {
        textBox.value = csvData[index][bodyParentIndex] || '';
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
        csvData[currentIndex][bodyParentIndex] = textBox.value;
        const csvString = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
        await axios.post('/update', { csvString });
        alert('Changes saved!');
    } catch (error) {
        console.error('Error saving CSV data:', error);
    }
});

fetchCSV();