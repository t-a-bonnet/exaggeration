document.addEventListener('DOMContentLoaded', () => {
    const textDisplayA = document.getElementById('text-display-a');
    const textDisplayB = document.getElementById('text-display-b');
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');

    let currentRow = 0;
    let dataA = [];
    let dataB = [];
    let columnIndexA = -1;
    let columnIndexB = -1;

    // Function to load the CSV data
    async function loadCSV() {
        try {
            const response = await fetch('Appen data 16.8.2024.csv');
            const text = await response.text();

            const rows = text.trim().split('\n'); // Trim and split into rows
            if (rows.length < 2) {
                console.error('Not enough rows in CSV file.');
                textDisplayA.value = 'No data available.';
                textDisplayB.value = 'No data available.';
                return;
            }

            const header = rows[0].split(','); // Extract the header row
            columnIndexA = header.indexOf('speaker_a_task_1'); // Find the index of the 'speaker_a_task_1' column
            columnIndexB = header.indexOf('speaker_b_task_1'); // Find the index of the 'speaker_b_task_1' column

            if (columnIndexA === -1 || columnIndexB === -1) {
                console.error('Required columns not found');
                textDisplayA.value = 'Column "speaker_a_task_1" not found.';
                textDisplayB.value = 'Column "speaker_b_task_1" not found.';
                return;
            }

            dataA = rows.slice(1) // Skip the header row
                .map(row => {
                    const columns = row.split(',');
                    return columns[columnIndexA] || ''; // Use the columnIndexA to get the 'speaker_a_task_1' column value
                })
                .filter(text => text.trim() !== ''); // Remove any empty rows

            dataB = rows.slice(1) // Skip the header row
                .map(row => {
                    const columns = row.split(',');
                    return columns[columnIndexB] || ''; // Use the columnIndexB to get the 'speaker_b_task_1' column value
                })
                .filter(text => text.trim() !== ''); // Remove any empty rows

            if (dataA.length > 0 && dataB.length > 0) {
                showRow(currentRow);
            } else {
                console.error('No data available.');
                textDisplayA.value = 'No data available.';
                textDisplayB.value = 'No data available.';
            }
        } catch (error) {
            console.error('Error loading CSV:', error);
            textDisplayA.value = 'Error loading CSV data.';
            textDisplayB.value = 'Error loading CSV data.';
        }
    }

    // Function to display a specific row
    function showRow(index) {
        if (dataA.length === 0 || dataB.length === 0) return;
        textDisplayA.value = dataA[index] || ''; // Set textarea value instead of textContent
        textDisplayB.value = dataB[index] || ''; // Set textarea value instead of textContent
        nextButton.disabled = dataA.length <= 1; // Disable button if only one row
    }

    // Function to show the next row
    function showNextRow() {
        if (dataA.length === 0 || dataB.length === 0) return;
        currentRow = (currentRow + 1) % dataA.length;
        showRow(currentRow);
    }

    // Function to submit changes
    async function submitChanges() {
        const updatedTextA = textDisplayA.value; // Get value from textarea A
        const updatedTextB = textDisplayB.value; // Get value from textarea B

        // Disable submit button to prevent multiple submissions
        submitButton.disabled = true;

        try {
            const responseA = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow, // Pass zero-based index
                    text: updatedTextA,
                    column: 'speaker_a_task_1'
                })
            });

            const resultA = await responseA.json();
            if (!resultA.success) {
                alert('Error updating column "speaker_a_task_1": ' + resultA.message);
            }

            const responseB = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow, // Pass zero-based index
                    text: updatedTextB,
                    column: 'speaker_b_task_1'
                })
            });

            const resultB = await responseB.json();
            if (!resultB.success) {
                alert('Error updating column "speaker_b_task_1": ' + resultB.message);
            } else {
                alert('Changes saved successfully!');
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