document.addEventListener('DOMContentLoaded', () => {
    const originalTextDisplayA = document.getElementById('original-a');
    const originalTextDisplayB = document.getElementById('original-b');
    const textDisplayA = document.getElementById('text-display-a');
    const textDisplayB = document.getElementById('text-display-b');
    const textDisplayATask2 = document.getElementById('text-display-a-task-2');
    const textDisplayBTask2 = document.getElementById('text-display-b-task-2');
    const textDisplayATask3 = document.getElementById('text-display-a-task-3');
    const textDisplayBTask3 = document.getElementById('text-display-b-task-3');
    const statusSelect = document.getElementById('status-select');
    const caseSelect = document.getElementById('case-select');
    const turnMaskedSelect = document.getElementById('turn-masked-select');
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
    let originalA = [];
    let originalB = [];
    let dataA = [];
    let dataB = [];
    let dataATask2 = [];
    let dataBTask2 = [];
    let dataATask3 = [];
    let dataBTask3 = [];
    let statusData = [];
    let caseData = [];
    let turnMaskedData = [];
    let robertaPreds = [];
    let llamaPreds = [];
    let gemmaPreds = [];
    let maskedWords = [];

    let columnIndexOriginalA;
    let columnIndexOriginalB;
    let columnIndexA;
    let columnIndexB;
    let columnIndexATask2;
    let columnIndexBTask2;
    let columnIndexATask3;
    let columnIndexBTask3;
    let statusColumnIndex;
    let caseColumnIndex;
    let turnMaskedColumnIndex;
    let robertaPredsColumnIndex;
    let llamaPredsColumnIndex;
    let gemmaPredsColumnIndex;
    let maskedWordColumnIndex;

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
                originalTextDisplayA.value = 'No data available.';
                originalTextDisplayB.value = 'No data available.';
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
            columnIndexOriginalA = header.indexOf('speaker_a_original');
            columnIndexOriginalB = header.indexOf('speaker_b_original');
            columnIndexA = header.indexOf('speaker_a_task_1');
            columnIndexB = header.indexOf('speaker_b_task_1');
            columnIndexATask2 = header.indexOf('speaker_a_task_2');
            columnIndexBTask2 = header.indexOf('speaker_b_task_2');
            columnIndexATask3 = header.indexOf('speaker_a_task_3');
            columnIndexBTask3 = header.indexOf('speaker_b_task_3');
            statusColumnIndex = header.indexOf('status');
            caseColumnIndex = header.indexOf('case');
            turnMaskedColumnIndex = header.indexOf('turn_masked');
            robertaPredsColumnIndex = header.indexOf('roberta_preds');
            llamaPredsColumnIndex = header.indexOf('llama_preds');
            gemmaPredsColumnIndex = header.indexOf('gemma_preds');
            maskedWordColumnIndex = header.indexOf('masked_word');

            if (columnIndexA === undefined || columnIndexB === undefined || columnIndexATask2 === undefined || columnIndexBTask2 === undefined || columnIndexATask3 === undefined || columnIndexBTask3 === undefined || statusColumnIndex === undefined || caseColumnIndex === undefined || turnMaskedColumnIndex === undefined) {
                console.error('Required columns not found');
                originalTextDisplayA.value = 'Required columns not found.';
                originalTextDisplayB.value = 'Required columns not found.';
                textDisplayA.value = 'Required columns not found.';
                textDisplayB.value = 'Required columns not found.';
                textDisplayATask2.value = 'Required columns not found.';
                textDisplayBTask2.value = 'Required columns not found.';
                textDisplayATask3.value = 'Required columns not found.';
                textDisplayBTask3.value = 'Required columns not found.';
                robertaPredsDisplay.textContent = 'Required columns not found.';
                llamaPredsDisplay.textContent = 'Required columns not found.';
                gemmaPredsDisplay.textContent = 'Required columns not found.';
                maskedWordDisplay.value = 'Required columns not found.';
                return;
            }

            originalA = rows.slice(1).map(row => row[columnIndexOriginalA] || '');
            originalB = rows.slice(1).map(row => row[columnIndexOriginalB] || '');
            dataA = rows.slice(1).map(row => row[columnIndexA] || '');
            dataB = rows.slice(1).map(row => row[columnIndexB] || '');
            dataATask2 = rows.slice(1).map(row => row[columnIndexATask2] || '');
            dataBTask2 = rows.slice(1).map(row => row[columnIndexBTask2] || '');
            dataATask3 = rows.slice(1).map(row => row[columnIndexATask3] || '');
            dataBTask3 = rows.slice(1).map(row => row[columnIndexBTask3] || '');
            statusData = rows.slice(1).map(row => row[statusColumnIndex] || 'Incomplete');
            caseData = rows.slice(1).map(row => row[caseColumnIndex] || 'Select case');
            turnMaskedData = rows.slice(1).map(row => row[turnMaskedColumnIndex] || 'Select turn masked');
            robertaPreds = rows.slice(1).map(row => row[robertaPredsColumnIndex] || '');
            llamaPreds = rows.slice(1).map(row => row[llamaPredsColumnIndex] || '');
            gemmaPreds = rows.slice(1).map(row => row[gemmaPredsColumnIndex] || '');
            maskedWords = rows.slice(1).map(row => row[maskedWordColumnIndex] || 'Enter masked word');

            try {
                showRow(currentRow);
            } catch (err) {
                throw new Error('Error displaying row: ' + err.message);
            }

        } catch (error) {
            console.error('Error loading CSV:', error);
            originalTextDisplayA.value = 'Error loading CSV data.';
            originalTextDisplayB.value = 'Error loading CSV data.';
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
        if (dataA.length === 0 || dataB.length === 0 || dataATask2.length === 0 || dataBTask2.length === 0 || dataATask3.length === 0 || dataBTask3.length === 0) {
            console.error('No data available for rows.');
            originalTextDisplayA.value = 'No data available.';
            originalTextDisplayB.value = 'No data available.';
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

        if (index < 0 || index >= dataA.length) {
            console.error('Row index out of bounds.');
            return;
        }

        originalTextDisplayA.value = originalA[index] || '';
        originalTextDisplayB.value = originalB[index] || '';
        textDisplayA.value = dataA[index] || '';
        textDisplayB.value = dataB[index] || '';
        textDisplayATask2.value = dataATask2[index] || '';
        textDisplayBTask2.value = dataBTask2[index] || '';
        textDisplayATask3.value = dataATask3[index] || '';
        textDisplayBTask3.value = dataBTask3[index] || '';
        robertaPredsDisplay.textContent = robertaPreds[index] || '';
        llamaPredsDisplay.textContent = llamaPreds[index] || '';
        gemmaPredsDisplay.textContent = gemmaPreds[index] || '';
        maskedWordDisplay.value = maskedWords[index] || '';

        statusSelect.value = statusData[index] || 'Incomplete';
        caseSelect.value = caseData[index] || 'Select case';
        turnMaskedSelect.value = turnMaskedData[index] || 'Select turn masked';
    }

    // Event handlers for buttons and inputs
    previousButton.addEventListener('click', () => {
        if (currentRow > 0) {
            currentRow--;
            showRow(currentRow);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentRow < dataA.length - 1) {
            currentRow++;
            showRow(currentRow);
        }
    });

    goButton.addEventListener('click', () => {
        const row = parseInt(rowInput.value, 10);
        if (!isNaN(row) && row >= 0 && row < dataA.length) {
            currentRow = row;
            showRow(currentRow);
        } else {
            console.error('Invalid row number.');
        }
    });

    submitButton.addEventListener('click', () => {
        if (currentRow >= 0 && currentRow < dataA.length) {
            statusData[currentRow] = statusSelect.value;
            caseData[currentRow] = caseSelect.value;
            turnMaskedData[currentRow] = turnMaskedSelect.value;
            maskedWords[currentRow] = maskedWordDisplay.value;
            showRow(currentRow); // Update the display
        }
    });

    // Load CSV data on page load
    loadCSV();
});