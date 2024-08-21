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
    const robertaPredsDisplay = document.getElementById('roberta-preds');
    const llamaPredsDisplay = document.getElementById('llama-preds');
    const gemmaPredsDisplay = document.getElementById('gemma-preds');
    const maskedWordDisplay = document.getElementById('masked-word');

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
    let maskedWords = [];

    // Mapping object for headers
    const expectedHeaders = [
        'speaker_a_task_1',
        'speaker_b_task_1',
        'speaker_a_task_2',
        'speaker_b_task_2',
        'speaker_a_task_3',
        'speaker_b_task_3',
        'status',
        'roberta_preds',
        'llama_preds',
        'gemma_preds',
        'masked_word'
    ];

    let columnIndices = {};

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

    // Function to map header names to their indices
    function getHeaderIndices(headerRow) {
        const indices = {};
        expectedHeaders.forEach(header => {
            const index = headerRow.indexOf(header);
            if (index !== -1) {
                indices[header] = index;
            } else {
                console.warn(`Header "${header}" not found.`);
            }
        });
        return indices;
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
                maskedWordDisplay.value = 'No data available.';
                return;
            }

            const header = rows[0];
            console.log('Header:', header); // Debugging header

            // Get column indices from header row
            columnIndices = getHeaderIndices(header);

            // Check for missing required columns
            if (Object.keys(columnIndices).length < expectedHeaders.length) {
                console.error('Not all required columns were found.');
                textDisplayA.value = 'Required columns not found.';
                textDisplayB.value = 'Required columns not found.';
                textDisplayATask2.value = 'Required columns not found.';
                textDisplayBTask2.value = 'Required columns not found.';
                textDisplayATask3.value = 'Required columns not found.';
                textDisplayBTask3.value = 'Required columns not found.';
                return;
            }

            // Extract data based on column indices
            dataA = rows.slice(1).map(row => row[columnIndices['speaker_a_task_1']] || '');
            dataB = rows.slice(1).map(row => row[columnIndices['speaker_b_task_1']] || '');
            dataATask2 = rows.slice(1).map(row => row[columnIndices['speaker_a_task_2']] || '');
            dataBTask2 = rows.slice(1).map(row => row[columnIndices['speaker_b_task_2']] || '');
            dataATask3 = rows.slice(1).map(row => row[columnIndices['speaker_a_task_3']] || '');
            dataBTask3 = rows.slice(1).map(row => row[columnIndices['speaker_b_task_3']] || '');
            statusData = rows.slice(1).map(row => row[columnIndices['status']] || '');
            robertaPreds = rows.slice(1).map(row => row[columnIndices['roberta_preds']] || '');
            llamaPreds = rows.slice(1).map(row => row[columnIndices['llama_preds']] || '');
            gemmaPreds = rows.slice(1).map(row => row[columnIndices['gemma_preds']] || '');
            maskedWords = rows.slice(1).map(row => row[columnIndices['masked_word']] || '');

            try {
                showRow(currentRow);
            } catch (err) {
                throw new Error('Error displaying row: ' + err.message);
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
            maskedWordDisplay.value = 'Error loading CSV data.';
        }
    }

    // Function to display a specific row
    function showRow(index) {
        if (dataA.length === 0 || dataB.length === 0 || dataATask2.length === 0 || dataBTask2.length === 0 || dataATask3.length === 0 || dataBTask3.length === 0 || statusData.length === 0) return;
        textDisplayA.value = dataA[index] || '';
        textDisplayB.value = dataB[index] || '';
        textDisplayATask2.value = dataATask2[index] || '';
        textDisplayBTask2.value = dataBTask2[index] || '';
        textDisplayATask3.value = dataATask3[index] || '';
        textDisplayBTask3.value = dataBTask3[index] || '';
        statusSelect.value = statusData[index] || 'Incomplete';
        robertaPredsDisplay.textContent = robertaPreds[index] || 'No data';
        llamaPredsDisplay.textContent = llamaPreds[index] || 'No data';
        gemmaPredsDisplay.textContent = gemmaPreds[index] || 'No data';
        maskedWordDisplay.value = maskedWords[index] || 'No data'; // Display the masked word

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

    // Function to go to a specific row based on input
    function goToRow() {
        const rowNumber = parseInt(rowInput.value, 10);
        if (rowNumber >= 0 && rowNumber < dataA.length) {
            currentRow = rowNumber;
            showRow(currentRow);
        } else {
            alert('Row number out of range.');
        }
    }

    // Event listeners for buttons
    previousButton.addEventListener('click', showPreviousRow);
    nextButton.addEventListener('click', showNextRow);
    goButton.addEventListener('click', goToRow);

    // Load CSV data when the document is ready
    loadCSV();
});