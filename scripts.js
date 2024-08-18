document.addEventListener('DOMContentLoaded', () => {
    const textDisplayA = document.getElementById('text-display-a');
    const textDisplayB = document.getElementById('text-display-b');
    const textDisplayATask2 = document.getElementById('text-display-a-task-2');
    const textDisplayBTask2 = document.getElementById('text-display-b-task-2');
    const statusSelect = document.getElementById('status-select');
    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    const goButton = document.getElementById('go-button');
    const rowInput = document.getElementById('row-input');
    const submitButton = document.getElementById('submit-button');

    let currentRow = 0;
    let dataA = [];
    let dataB = [];
    let dataATask2 = [];
    let dataBTask2 = [];
    let statusData = [];
    let columnIndexA = -1;
    let columnIndexB = -1;
    let columnIndexATask2 = -1;
    let columnIndexBTask2 = -1;
    let statusColumnIndex = -1;

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
                textDisplayATask2.value = 'No data available.';
                textDisplayBTask2.value = 'No data available.';
                return;
            }

            const header = rows[0].split(','); // Extract the header row
            columnIndexA = header.indexOf('speaker_a_task_1'); // Find the index of the 'speaker_a_task_1' column
            columnIndexB = header.indexOf('speaker_b_task_1'); // Find the index of the 'speaker_b_task_1' column
            columnIndexATask2 = header.indexOf('speaker_a_task_2'); // Find the index of the 'speaker_a_task_2' column
            columnIndexBTask2 = header.indexOf('speaker_b_task_2'); // Find the index of the 'speaker_b_task_2' column
            statusColumnIndex = header.indexOf('status'); // Find the index of the 'status' column

            if (columnIndexA === -1 || columnIndexB === -1 || columnIndexATask2 === -1 || columnIndexBTask2 === -1 || statusColumnIndex === -1) {
                console.error('Required columns not found');
                textDisplayA.value = 'Required columns not found.';
                textDisplayB.value = 'Required columns not found.';
                textDisplayATask2.value = 'Required columns not found.';
                textDisplayBTask2.value = 'Required columns not found.';
                return;
            }

            dataA = rows.slice(1) // Skip the header row
                .map(row => {
                    const columns = row.split(',');
                    return columns[columnIndexA] || ''; // Use the columnIndexA to get the 'speaker_a_task_1' column value
                });

            dataB = rows.slice(1) // Skip the header row
                .map(row => {
                    const columns = row.split(',');
                    return columns[columnIndexB] || ''; // Use the columnIndexB to get the 'speaker_b_task_1' column value
                });

            dataATask2 = rows.slice(1) // Skip the header row
                .map(row => {
                    const columns = row.split(',');
                    return columns[columnIndexATask2] || ''; // Use the columnIndexATask2 to get the 'speaker_a_task_2' column value
                });

            dataBTask2 = rows.slice(1) // Skip the header row
                .map(row => {
                    const columns = row.split(',');
                    return columns[columnIndexBTask2] || ''; // Use the columnIndexBTask2 to get the 'speaker_b_task_2' column value
                });

            statusData = rows.slice(1) // Skip the header row
                .map(row => {
                    const columns = row.split(',');
                    return columns[statusColumnIndex] || ''; // Use the statusColumnIndex to get the 'status' column value
                });

            if (dataA.length > 0 && dataB.length > 0 && dataATask2.length > 0 && dataBTask2.length > 0 && statusData.length > 0) {
                showRow(currentRow);
            } else {
                console.error('No data available.');
                textDisplayA.value = 'No data available.';
                textDisplayB.value = 'No data available.';
                textDisplayATask2.value = 'No data available.';
                textDisplayBTask2.value = 'No data available.';
            }
        } catch (error) {
            console.error('Error loading CSV:', error);
            textDisplayA.value = 'Error loading CSV data.';
            textDisplayB.value = 'Error loading CSV data.';
            textDisplayATask2.value = 'Error loading CSV data.';
            textDisplayBTask2.value = 'Error loading CSV data.';
        }
    }

    // Function to display a specific row
    function showRow(index) {
        if (dataA.length === 0 || dataB.length === 0 || dataATask2.length === 0 || dataBTask2.length === 0 || statusData.length === 0) return;
        textDisplayA.value = dataA[index] || ''; // Set textarea value instead of textContent
        textDisplayB.value = dataB[index] || ''; // Set textarea value instead of textContent
        textDisplayATask2.value = dataATask2[index] || ''; // Set textarea value instead of textContent
        textDisplayBTask2.value = dataBTask2[index] || ''; // Set textarea value instead of textContent
        statusSelect.value = statusData[index] || 'Incomplete'; // Set the status select value
        previousButton.disabled = index === 0; // Disable previous button if at the first row
        nextButton.disabled = index === dataA.length - 1; // Disable next button if at the last row
    }

    // Function to show the previous row
    function showPreviousRow() {
        if (currentRow > 0) {
            currentRow -= 1;
            showRow(currentRow);
        }
    }

    // Function to show the next row
    function showNextRow() {
        if (currentRow < dataA.length - 1) {
            currentRow += 1;
            showRow(currentRow);
        }
    }

    // Function to jump to a specific row
    function goToRow() {
        const rowNumber = parseInt(rowInput.value, 10);
        if (isNaN(rowNumber) || rowNumber < 1 || rowNumber > dataA.length) {
            alert(`Please enter a valid row number between 1 and ${dataA.length}.`);
            return;
        }
        currentRow = rowNumber - 1; // Convert to zero-based index
        showRow(currentRow);
    }

    // Function to submit changes
    async function submitChanges() {
        const updatedTextA = textDisplayA.value; // Get value from textarea A
        const updatedTextB = textDisplayB.value; // Get value from textarea B
        const updatedTextATask2 = textDisplayATask2.value; // Get value from textarea A Task 2
        const updatedTextBTask2 = textDisplayBTask2.value; // Get value from textarea B Task 2
        const updatedStatus = statusSelect.value; // Get value from status select
    
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
            }
    
            const responseATask2 = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow, // Pass zero-based index
                    text: updatedTextATask2,
                    column: 'speaker_a_task_2'
                })
            });
    
            const resultATask2 = await responseATask2.json();
            if (!resultATask2.success) {
                alert('Error updating column "speaker_a_task_2": ' + resultATask2.message);
            }
    
            const responseBTask2 = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow, // Pass zero-based index
                    text: updatedTextBTask2,
                    column: 'speaker_b_task_2'
                })
            });
    
            const resultBTask2 = await responseBTask2.json();
            if (!resultBTask2.success) {
                alert('Error updating column "speaker_b_task_2": ' + resultBTask2.message);
            }
    
            const responseStatus = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow, // Pass zero-based index
                    text: updatedStatus,
                    column: 'status'
                })
            });
    
            const resultStatus = await responseStatus.json();
            if (!resultStatus.success) {
                alert('Error updating column "status": ' + resultStatus.message);
            }
    
            // Update the local data arrays after successful submission
            if (resultA.success) dataA[currentRow] = updatedTextA;
            if (resultB.success) dataB[currentRow] = updatedTextB;
            if (resultATask2.success) dataATask2[currentRow] = updatedTextATask2;
            if (resultBTask2.success) dataBTask2[currentRow] = updatedTextBTask2;
            if (resultStatus.success) statusData[currentRow] = updatedStatus;
    
            // Notify the user of successful submission
            alert('Changes successfully submitted!');
    
        } catch (error) {
            console.error('Error submitting changes:', error);
            alert('Error submitting changes: ' + error.message);
        } finally {
            // Re-enable submit button after submission is complete
            submitButton.disabled = false;
        }
    }

    // Event listeners
    previousButton.addEventListener('click', showPreviousRow);
    nextButton.addEventListener('click', showNextRow);
    goButton.addEventListener('click', goToRow);
    submitButton.addEventListener('click', submitChanges);

    // Load the CSV data on page load
    loadCSV();
});