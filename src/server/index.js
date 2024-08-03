document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    let csvData = [];

    async function fetchCSV() {
        const response = await fetch('/data/sampled_climate_data.csv');
        const text = await response.text();
        csvData = parseCSV(text);
        displayRow(currentIndex);
    }

    function parseCSV(text) {
        const rows = text.split('\n').map(row => row.split(','));
        const header = rows[0];
        const data = rows.slice(1);
        return data.map(row => {
            let obj = {};
            header.forEach((key, i) => obj[key] = row[i]);
            return obj;
        });
    }

    function displayRow(index) {
        if (index >= 0 && index < csvData.length) {
            document.getElementById('textArea').value = csvData[index].body_parent;
        }
    }

    function saveRow(index, text) {
        if (index >= 0 && index < csvData.length) {
            csvData[index].body_parent = text;
            // Note: You need a server-side script to handle saving the data to the CSV file.
        }
    }

    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentIndex > 0) {
            saveRow(currentIndex, document.getElementById('textArea').value);
            currentIndex--;
            displayRow(currentIndex);
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentIndex < csvData.length - 1) {
            saveRow(currentIndex, document.getElementById('textArea').value);
            currentIndex++;
            displayRow(currentIndex);
        }
    });

    document.getElementById('submitBtn').addEventListener('click', () => {
        saveRow(currentIndex, document.getElementById('textArea').value);
        // Here you should call a function to submit the updated data to your server
    });

    fetchCSV();
});