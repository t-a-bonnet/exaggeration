document.addEventListener('DOMContentLoaded', () => {
    const textDisplay = document.getElementById('text-display');
    const nextButton = document.getElementById('next-button');

    let currentRow = 0;
    let data = [];

    function loadCSV() {
        fetch('sampled_climate_data.csv')
            .then(response => response.text())
            .then(text => {
                const rows = text.split('\n').slice(1); // Skip header row
                data = rows.map(row => {
                    const columns = row.split(',');
                    return columns[0]; // Assuming the text is in the first column
                }).filter(text => text.trim() !== ''); // Remove any empty rows
                showRow(currentRow);
            })
            .catch(error => console.error('Error loading CSV:', error));
    }

    function showRow(index) {
        if (data.length === 0) return;
        textDisplay.textContent = data[index];
    }

    function showNextRow() {
        if (data.length === 0) return;
        currentRow = (currentRow + 1) % data.length;
        showRow(currentRow);
    }

    nextButton.addEventListener('click', showNextRow);

    loadCSV();
});