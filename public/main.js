import axios from 'axios';

// Select HTML elements
const textBox = document.getElementById('text-box');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');

let currentIndex = 0;
let csvData = [];
let headers = [];
let bodyParentIndex = -1;

// Fetch CSV data from Netlify Function
async function fetchCSV() {
    try {
        const response = await axios.get('/.netlify/functions/fetch-csv');
        csvData = response.data;
        
        // Extract headers
        if (csvData.length > 0) {
            headers = Object.keys(csvData[0]);
            bodyParentIndex = headers.indexOf('body_parent');
            if (bodyParentIndex === -1) {
                throw new Error('body_parent column not found');
            }

            displayRow(currentIndex);
        } else {
            throw new Error('No data found');
        }
    } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
    }
}

// Display a row of the CSV in the text box
function displayRow(index) {
    if (index >= 0 && index < csvData.length) {
        textBox.value = csvData[index][headers[bodyParentIndex]] || '';
    }
}

// Navigate to the previous row
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayRow(currentIndex);
    }
});

// Navigate to the next row
nextBtn.addEventListener('click', () => {
    if (currentIndex < csvData.length - 1) {
        currentIndex++;
        displayRow(currentIndex);
    }
});

// Submit edited text to Netlify Function
submitBtn.addEventListener('click', async () => {
    try {
        csvData[currentIndex][headers[bodyParentIndex]] = textBox.value;
        const csvString = stringify(csvData, { header: true });
        await axios.post('/.netlify/functions/update-csv', { csvString });
        alert('Changes saved!');
    } catch (error) {
        console.error('Error saving CSV data:', error);
    }
});

// Initial data fetch
fetchCSV();