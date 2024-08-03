document.addEventListener('DOMContentLoaded', () => {
    const textDisplay = document.getElementById('text-display');
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');

    let currentRow = 0;
    let data = [];
    let columnIndex = -1; // To store the index of the 'body_parent' column

    // Function to load the CSV data
    async function loadCSV() {
        try {
            const response = await fetch('/data/sampled_climate_data.csv');
            const text = await response.text();

            const rows = text.trim().split('\n'); // Trim and split into rows
            if (rows.length < 2) {
                console.error('Not enough rows in CSV file.');
                textDisplay.value = 'No data available.';
                return;
            }

            const header = rows[0].split(','); // Extract the header row
            columnIndex = header.indexOf('body_parent'); // Find the index of the 'body_parent' column

            if (columnIndex === -1) {
                console.error('Column "body_parent" not found');
                textDisplay.value = 'Column "body_parent" not found.';
                return;
            }

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
                textDisplay.value = 'No data available.';
            }
        } catch (error) {
            console.error('Error loading CSV:', error);
            textDisplay.value = 'Error loading CSV data.';
        }
    }

    // Function to display a specific row
    function showRow(index) {
        if (data.length === 0) return;
        textDisplay.value = data[index]; // Set textarea value instead of textContent
        nextButton.disabled = data.length <= 1; // Disable button if only one row
    }

    // Function to show the next row
    function showNextRow() {
        if (data.length === 0) return;
        currentRow = (currentRow + 1) % data.length;
        showRow(currentRow);
    }

    // Function to submit changes
    async function submitChanges() {
        const updatedText = textDisplay.value; // Get value from textarea

        // Disable submit button to prevent multiple submissions
        submitButton.disabled = true;

        try {
            const response = await fetch('/update-csv', { // Adjusted URL for local server
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow, // Pass zero-based index
                    text: updatedText
                })
            });

            const result = await response.json();
            if (result.success) {
                alert('Changes saved successfully!');
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error submitting changes:', error);
            alert('Error submitting changes.');
        } finally {
            // Re-enable the submit button
            submitButton.disabled = false;
        }
    }

    nextButton.addEventListener('click', showNextRow);
    submitButton.addEventListener('click', submitChanges);

    loadCSV();
});