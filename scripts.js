document.addEventListener('DOMContentLoaded', () => {
    const textDisplayA = document.getElementById('text-display-a');
    const textDisplayB = document.getElementById('text-display-b');
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');

    let currentRow = 0;
    let data = [];
    let columnIndexA = -1; // To store the index of the 'speaker_a_task_1' column
    let columnIndexB = -1; // To store the index of the 'speaker_b_task_1' column

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
                console.error('One or both columns not found');
                textDisplayA.value = 'Column "speaker_a_task_1" not found.';
                textDisplayB.value = 'Column "speaker_b_task_1" not found.';
                return;
            }

            data = rows.slice(1) // Skip the header row
                .map(row => {
                    const columns = row.split(',');
                    return {
                        speakerA: columns[columnIndexA] || '', // Use the columnIndexA to get the 'speaker_a_task_1' column value
                        speakerB: columns[columnIndexB] || ''  // Use the columnIndexB to get the 'speaker_b_task_1' column value
                    };
                })
                .filter(row => row.speakerA.trim() !== '' || row.speakerB.trim() !== ''); // Remove any empty rows

            if (data.length > 0) {
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
        if (data.length === 0) return;
        textDisplayA.value = data[index].speakerA; // Set textarea A value
        textDisplayB.value = data[index].speakerB; // Set textarea B value
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
        const updatedTextA = textDisplayA.value; // Get value from textarea A
        const updatedTextB = textDisplayB.value; // Get value from textarea B

        // Disable submit button to prevent multiple submissions
        submitButton.disabled = true;

        try {
            const response = await fetch('/.netlify/functions/update-csv', { // Adjusted URL for Netlify
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow, // Pass zero-based index
                    textA: updatedTextA,
                    textB: updatedTextB
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