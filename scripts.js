document.addEventListener('DOMContentLoaded', () => {
    const textDisplay = document.getElementById('text-display');
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');

    let currentRow = 0;
    let data = [];
    let columnIndex = -1; // To store the index of the 'body_parent' column

    function loadCSV() {
        fetch('sampled_climate_data.csv')
            .then(response => response.text())
            .then(text => {
                const rows = text.trim().split('\n'); // Trim and split into rows
                if (rows.length < 2) {
                    console.error('Not enough rows in CSV file.');
                    return;
                }
                
                const header = rows[0].split(','); // Extract the header row
                columnIndex = header.indexOf('body_parent'); // Find the index of the 'body_parent' column

                if (columnIndex === -1) {
                    console.error('Column "body_parent" not found');
                    return;
                }

                // Process the data rows, skipping the header row
                data = rows.slice(1) // Skip the header row
                    .map(row => {
                        const columns = row.split(',');
                        return columns[columnIndex] || ''; // Use the columnIndex to get the 'body_parent' column value
                    })
                    .filter(text => text.trim() !== ''); // Remove any empty rows
                
                if (data.length > 0) {
                    showRow(currentRow);
                } else {
                    console.error('No data available.');
                }
            })
            .catch(error => console.error('Error loading CSV:', error));
    }

    function showRow(index) {
        if (data.length === 0) return;
        textDisplay.value = data[index]; // Set textarea value instead of textContent
    }

    function showNextRow() {
        if (data.length === 0) return;
        currentRow = (currentRow + 1) % data.length;
        showRow(currentRow);
    }

    function submitChanges() {
        const updatedText = textDisplay.value; // Get value from textarea
        fetch('/.netlify/functions/update-csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                row: currentRow, // Pass zero-based index, adjusted for no header
                text: updatedText
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Changes saved successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error submitting changes:', error));
    }

    nextButton.addEventListener('click', showNextRow);
    submitButton.addEventListener('click', submitChanges);

    loadCSV();
});