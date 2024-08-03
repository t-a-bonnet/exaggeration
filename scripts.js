document.addEventListener('DOMContentLoaded', () => {
    const textDisplay = document.getElementById('text-display');
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');
    const messageArea = document.getElementById('message'); // Message area

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

                // Process the data rows
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
        textDisplay.value = data[index];
    }

    function showNextRow() {
        if (data.length === 0) return;
        currentRow = (currentRow + 1) % data.length;
        showRow(currentRow);
    }

    function submitChanges() {
        const updatedText = textDisplay.value;
        // Replace the current row data with the updated text
        data[currentRow] = updatedText;

        // Send the updated data to the server
        fetch('update_csv.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                row: currentRow,
                text: updatedText
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageArea.textContent = 'CSV updated successfully!';
                messageArea.style.color = 'green'; // Success message color
            } else {
                messageArea.textContent = 'Failed to update CSV: ' + (data.message || 'Unknown error');
                messageArea.style.color = 'red'; // Error message color
            }
        })
        .catch(error => {
            messageArea.textContent = 'Error updating CSV: ' + error.message;
            messageArea.style.color = 'red'; // Error message color
        });
    }

    nextButton.addEventListener('click', showNextRow);
    submitButton.addEventListener('click', submitChanges);

    loadCSV();
});