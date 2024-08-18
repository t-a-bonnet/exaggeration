document.addEventListener('DOMContentLoaded', () => {
    const textDisplayA = document.getElementById('text-display-a');
    const textDisplayB = document.getElementById('text-display-b');
    const textDisplayATask2 = document.getElementById('text-display-a-task-2');
    const textDisplayBTask2 = document.getElementById('text-display-b-task-2');
    const textDisplayATask3 = document.getElementById('text-display-a-task-3');
    const textDisplayBTask3 = document.getElementById('text-display-b-task-3');
    const statusSelect = document.getElementById('status-select');
    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    const goButton = document.getElementById('go-button');
    const rowInput = document.getElementById('row-input');
    const submitButton = document.getElementById('submit-button');
    
    // New elements for predictions
    const robertaPredsDisplay = document.getElementById('roberta-preds');
    const llamaPredsDisplay = document.getElementById('llama-preds');
    const gemmaPredsDisplay = document.getElementById('gemma-preds');

    let currentRow = 0;
    let dataA = [];
    let dataB = [];
    let dataATask2 = [];
    let dataBTask2 = [];
    let dataATask3 = [];
    let dataBTask3 = [];
    let statusData = [];
    let robertaPreds = [];
    let llamaPreds = [];
    let gemmaPreds = [];

    let columnIndexA;
    let columnIndexB;
    let columnIndexATask2;
    let columnIndexBTask2;
    let columnIndexATask3;
    let columnIndexBTask3;
    let statusColumnIndex;
    let robertaPredsColumnIndex;
    let llamaPredsColumnIndex;
    let gemmaPredsColumnIndex;

    // Function to parse CSV text correctly, handling commas within quotes
    function parseCSV(text) {
        const rows = [];
        const re = /"(?:[^"]|"")*"|[^,]+/g;
        let matches;
        
        text.split('\n').forEach(line => {
            const row = [];
            while ((matches = re.exec(line)) !== null) {
                row.push(matches[0].replace(/^"(.*)"$/, '$1').replace(/""/g, '"'));
            }
            rows.push(row);
        });
        
        return rows;
    }

    // Function to load the CSV data
    async function loadCSV() {
        try {
            const response = await fetch('Appen data 16.8.2024.csv');
            const text = await response.text();

            const rows = parseCSV(text); // Use the new parseCSV function
            if (rows.length < 2) {
                console.error('Not enough rows in CSV file.');
                textDisplayA.value = 'No data available.';
                textDisplayB.value = 'No data available.';
                textDisplayATask2.value = 'No data available.';
                textDisplayBTask2.value = 'No data available.';
                textDisplayATask3.value = 'No data available.';
                textDisplayBTask3.value = 'No data available.';
                robertaPredsDisplay.textContent = 'No data available.';
                llamaPredsDisplay.textContent = 'No data available.';
                gemmaPredsDisplay.textContent = 'No data available.';
                return;
            }

            const header = rows[0];
            columnIndexA = header.indexOf('speaker_a_task_1');
            columnIndexB = header.indexOf('speaker_b_task_1');
            columnIndexATask2 = header.indexOf('speaker_a_task_2');
            columnIndexBTask2 = header.indexOf('speaker_b_task_2');
            columnIndexATask3 = header.indexOf('speaker_a_task_3');
            columnIndexBTask3 = header.indexOf('speaker_b_task_3');
            statusColumnIndex = header.indexOf('status');
            robertaPredsColumnIndex = header.indexOf('roberta_preds');
            llamaPredsColumnIndex = header.indexOf('llama_preds');
            gemmaPredsColumnIndex = header.indexOf('gemma_preds');

            if (columnIndexA === undefined || columnIndexB === undefined || columnIndexATask2 === undefined || columnIndexBTask2 === undefined || columnIndexATask3 === undefined || columnIndexBTask3 === undefined) {
                console.error('Required columns not found');
                textDisplayA.value = 'Required columns not found.';
                textDisplayB.value = 'Required columns not found.';
                textDisplayATask2.value = 'Required columns not found.';
                textDisplayBTask2.value = 'Required columns not found.';
                textDisplayATask3.value = 'Required columns not found.';
                textDisplayBTask3.value = 'Required columns not found.';
                robertaPredsDisplay.textContent = 'Required columns not found.';
                llamaPredsDisplay.textContent = 'Required columns not found.';
                gemmaPredsDisplay.textContent = 'Required columns not found.';
                return;
            }

            dataA = rows.slice(1).map(row => row[columnIndexA] || '');
            dataB = rows.slice(1).map(row => row[columnIndexB] || '');
            dataATask2 = rows.slice(1).map(row => row[columnIndexATask2] || '');
            dataBTask2 = rows.slice(1).map(row => row[columnIndexBTask2] || '');
            dataATask3 = rows.slice(1).map(row => row[columnIndexATask3] || '');
            dataBTask3 = rows.slice(1).map(row => row[columnIndexBTask3] || '');
            statusData = rows.slice(1).map(row => row[statusColumnIndex] || '');
            robertaPreds = rows.slice(1).map(row => row[robertaPredsColumnIndex] || '');
            llamaPreds = rows.slice(1).map(row => row[llamaPredsColumnIndex] || '');
            gemmaPreds = rows.slice(1).map(row => row[gemmaPredsColumnIndex] || '');

            if (dataA.length > 0 && dataB.length > 0 && dataATask2.length > 0 && dataBTask2.length > 0 && dataATask3.length > 0 && dataBTask3.length > 0 && statusData.length > 0 && robertaPreds.length > 0 && llamaPreds.length > 0 && gemmaPreds.length > 0) {
                showRow(currentRow);
            } else {
                console.error('No data available.');
                textDisplayA.value = 'No data available.';
                textDisplayB.value = 'No data available.';
                textDisplayATask2.value = 'No data available.';
                textDisplayBTask2.value = 'No data available.';
                textDisplayATask3.value = 'No data available.';
                textDisplayBTask3.value = 'No data available.';
                robertaPredsDisplay.textContent = 'No data available.';
                llamaPredsDisplay.textContent = 'No data available.';
                gemmaPredsDisplay.textContent = 'No data available.';
            }
        } catch (error) {
            console.error('Error loading CSV:', error);
            textDisplayA.value = 'Error loading CSV data.';
            textDisplayB.value = 'Error loading CSV data.';
            textDisplayATask2.value = 'Error loading CSV data.';
            textDisplayBTask2.value = 'Error loading CSV data.';
            textDisplayATask3.value = 'Error loading CSV data.';
            textDisplayBTask3.value = 'Error loading CSV data.';
            robertaPredsDisplay.textContent = 'Error loading CSV data.';
            llamaPredsDisplay.textContent = 'Error loading CSV data.';
            gemmaPredsDisplay.textContent = 'Error loading CSV data.';
        }
    }

    // Function to display a specific row
    function showRow(index) {
        if (dataA.length === 0 || dataB.length === 0 || dataATask2.length === 0 || dataBTask2.length === 0 || dataATask3.length === 0 || dataBTask3.length === 0 || statusData.length === 0 || robertaPreds.length === 0 || llamaPreds.length === 0 || gemmaPreds.length === 0) return;
        textDisplayA.value = dataA[index] || '';
        textDisplayB.value = dataB[index] || '';
        textDisplayATask2.value = dataATask2[index] || '';
        textDisplayBTask2.value = dataBTask2[index] || '';
        textDisplayATask3.value = dataATask3[index] || '';
        textDisplayBTask3.value = dataBTask3[index] || '';
        statusSelect.value = statusData[index] || 'Incomplete';
        
        // Display predictions
        robertaPredsDisplay.textContent = robertaPreds[index] || 'No data';
        llamaPredsDisplay.textContent = llamaPreds[index] || 'No data';
        gemmaPredsDisplay.textContent = gemmaPreds[index] || 'No data';

        // Update button states
        previousButton.disabled = index === 0;
        nextButton.disabled = index === dataA.length - 1;
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
        currentRow = rowNumber - 1;
        showRow(currentRow);
    }

    // Function to submit changes
    async function submitChanges() {
        const updatedTextA = textDisplayA.value;
        const updatedTextB = textDisplayB.value;
        const updatedTextATask2 = textDisplayATask2.value;
        const updatedTextBTask2 = textDisplayBTask2.value;
        const updatedTextATask3 = textDisplayATask3.value;
        const updatedTextBTask3 = textDisplayBTask3.value;
        const updatedStatus = statusSelect.value;

        submitButton.disabled = true;

        try {
            // Submit updates for each column
            const responses = await Promise.all([
                fetch('/.netlify/functions/update-csv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: currentRow, text: updatedTextA, column: 'speaker_a_task_1' })
                }),
                fetch('/.netlify/functions/update-csv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: currentRow, text: updatedTextB, column: 'speaker_b_task_1' })
                }),
                fetch('/.netlify/functions/update-csv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: currentRow, text: updatedTextATask2, column: 'speaker_a_task_2' })
                }),
                fetch('/.netlify/functions/update-csv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: currentRow, text: updatedTextBTask2, column: 'speaker_b_task_2' })
                }),
                fetch('/.netlify/functions/update-csv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: currentRow, text: updatedTextATask3, column: 'speaker_a_task_3' })
                }),
                fetch('/.netlify/functions/update-csv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: currentRow, text: updatedTextBTask3, column: 'speaker_b_task_3' })
                }),
                fetch('/.netlify/functions/update-csv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: currentRow, text: updatedStatus, column: 'status' })
                })
            ]);

            const results = await Promise.all(responses.map(res => res.json()));
            const success = results.every(result => result.success);

            if (!success) {
                alert('Error updating some columns.');
            }

            // Update local data arrays
            if (results[0].success) dataA[currentRow] = updatedTextA;
            if (results[1].success) dataB[currentRow] = updatedTextB;
            if (results[2].success) dataATask2[currentRow] = updatedTextATask2;
            if (results[3].success) dataBTask2[currentRow] = updatedTextBTask2;
            if (results[4].success) dataATask3[currentRow] = updatedTextATask3;
            if (results[5].success) dataBTask3[currentRow] = updatedTextBTask3;
            if (results[6].success) statusData[currentRow] = updatedStatus;

            alert('Changes successfully submitted!');
        } catch (error) {
            console.error('Error submitting changes:', error);
            alert('Error submitting changes: ' + error.message);
        } finally {
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