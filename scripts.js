document.addEventListener('DOMContentLoaded', () => {
    const textDisplayA = document.getElementById('text-display-a');
    const textDisplayB = document.getElementById('text-display-b');
    const textDisplayATask2 = document.getElementById('text-display-a-task-2');
    const textDisplayBTask2 = document.getElementById('text-display-b-task-2');
    const textDisplayATask3 = document.getElementById('text-display-a-task-3');
    const textDisplayBTask3 = document.getElementById('text-display-b-task-3');
    const textDisplayAOriginal = document.getElementById('text-display-a-original'); // New display for SPEAKER_A_ORIGINAL
    const textDisplayBOriginal = document.getElementById('text-display-b-original'); // New display for SPEAKER_B_ORIGINAL
    const statusSelect = document.getElementById('status-select');
    const caseSelect = document.getElementById('case-select'); // New dropdown for case
    const turnMaskedSelect = document.getElementById('turn-masked-select'); // New dropdown for turn_masked
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
    let speakerAOriginalData = []; // New data array for SPEAKER_A_ORIGINAL
    let speakerBOriginalData = []; // New data array for SPEAKER_B_ORIGINAL
    let statusData = [];
    let caseData = [];
    let turnMaskedData = []; // New data array for turn_masked
    let robertaPreds = [];
    let llamaPreds = [];
    let gemmaPreds = [];
    let maskedWords = [];

    let columnIndexA;
    let columnIndexB;
    let columnIndexATask2;
    let columnIndexBTask2;
    let columnIndexATask3;
    let columnIndexBTask3;
    let speakerAOriginalColumnIndex; // New column index for SPEAKER_A_ORIGINAL
    let speakerBOriginalColumnIndex; // New column index for SPEAKER_B_ORIGINAL
    let statusColumnIndex;
    let caseColumnIndex;
    let turnMaskedColumnIndex; // New column index for turn_masked
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
                textDisplayA.value = 'No data available.';
                textDisplayB.value = 'No data available.';
                textDisplayATask2.value = 'No data available.';
                textDisplayBTask2.value = 'No data available.';
                textDisplayATask3.value = 'No data available.';
                textDisplayBTask3.value = 'No data available.';
                textDisplayAOriginal.value = 'No data available.';
                textDisplayBOriginal.value = 'No data available.';
                robertaPredsDisplay.textContent = 'No data available.';
                llamaPredsDisplay.textContent = 'No data available.';
                gemmaPredsDisplay.textContent = 'No data available.';
                maskedWordDisplay.value = 'No data available.';
                return;
            }

            const header = rows[0];
            columnIndexA = header.indexOf('speaker_a_task_1');
            columnIndexB = header.indexOf('speaker_b_task_1');
            columnIndexATask2 = header.indexOf('speaker_a_task_2');
            columnIndexBTask2 = header.indexOf('speaker_b_task_2');
            columnIndexATask3 = header.indexOf('speaker_a_task_3');
            columnIndexBTask3 = header.indexOf('speaker_b_task_3');
            speakerAOriginalColumnIndex = header.indexOf('speaker_a_original'); // New column index for SPEAKER_A_ORIGINAL
            speakerBOriginalColumnIndex = header.indexOf('speaker_b_original'); // New column index for SPEAKER_B_ORIGINAL
            statusColumnIndex = header.indexOf('status');
            caseColumnIndex = header.indexOf('case'); // New column index for case
            turnMaskedColumnIndex = header.indexOf('turn_masked'); // New column index for turn_masked
            robertaPredsColumnIndex = header.indexOf('roberta_preds');
            llamaPredsColumnIndex = header.indexOf('llama_preds');
            gemmaPredsColumnIndex = header.indexOf('gemma_preds');
            maskedWordColumnIndex = header.indexOf('masked_word'); // New column index for masked words

            if (columnIndexA === undefined || columnIndexB === undefined || columnIndexATask2 === undefined || columnIndexBTask2 === undefined || columnIndexATask3 === undefined || columnIndexBTask3 === undefined || speakerAOriginalColumnIndex === undefined || speakerBOriginalColumnIndex === undefined || statusColumnIndex === undefined || caseColumnIndex === undefined || turnMaskedColumnIndex === undefined) {
                console.error('Required columns not found');
                textDisplayA.value = 'Required columns not found.';
                textDisplayB.value = 'Required columns not found.';
                textDisplayATask2.value = 'Required columns not found.';
                textDisplayBTask2.value = 'Required columns not found.';
                textDisplayATask3.value = 'Required columns not found.';
                textDisplayBTask3.value = 'Required columns not found.';
                textDisplayAOriginal.value = 'Required columns not found.';
                textDisplayBOriginal.value = 'Required columns not found.';
                robertaPredsDisplay.textContent = 'Required columns not found.';
                llamaPredsDisplay.textContent = 'Required columns not found.';
                gemmaPredsDisplay.textContent = 'Required columns not found.';
                maskedWordDisplay.value = 'Required columns not found.';
                return;
            }

            dataA = rows.slice(1).map(row => row[columnIndexA] || '');
            dataB = rows.slice(1).map(row => row[columnIndexB] || '');
            dataATask2 = rows.slice(1).map(row => row[columnIndexATask2] || '');
            dataBTask2 = rows.slice(1).map(row => row[columnIndexBTask2] || '');
            dataATask3 = rows.slice(1).map(row => row[columnIndexATask3] || '');
            dataBTask3 = rows.slice(1).map(row => row[columnIndexBTask3] || '');
            speakerAOriginalData = rows.slice(1).map(row => row[speakerAOriginalColumnIndex] || ''); // Load SPEAKER_A_ORIGINAL data
            speakerBOriginalData = rows.slice(1).map(row => row[speakerBOriginalColumnIndex] || ''); // Load SPEAKER_B_ORIGINAL data
            statusData = rows.slice(1).map(row => row[statusColumnIndex] || '');
            caseData = rows.slice(1).map(row => row[caseColumnIndex] || 'modal'); // Default to 'modal'
            turnMaskedData = rows.slice(1).map(row => row[turnMaskedColumnIndex] || 'first'); // Default to 'first'
            robertaPreds = rows.slice(1).map(row => row[robertaPredsColumnIndex] || '');
            llamaPreds = rows.slice(1).map(row => row[llamaPredsColumnIndex] || '');
            gemmaPreds = rows.slice(1).map(row => row[gemmaPredsColumnIndex] || '');
            maskedWords = rows.slice(1).map(row => row[maskedWordColumnIndex] || '');

            showRow(currentRow);
        } catch (error) {
            console.error('Error loading CSV data:', error);
            textDisplayA.value = 'Error loading data.';
            textDisplayB.value = 'Error loading data.';
            textDisplayATask2.value = 'Error loading data.';
            textDisplayBTask2.value = 'Error loading data.';
            textDisplayATask3.value = 'Error loading data.';
            textDisplayBTask3.value = 'Error loading data.';
            textDisplayAOriginal.value = 'Error loading data.';
            textDisplayBOriginal.value = 'Error loading data.';
            robertaPredsDisplay.textContent = 'Error loading data.';
            llamaPredsDisplay.textContent = 'Error loading data.';
            gemmaPredsDisplay.textContent = 'Error loading data.';
            maskedWordDisplay.value = 'Error loading data.';
        }
    }

    function showRow(rowIndex) {
        if (rowIndex < 0 || rowIndex >= dataA.length) {
            textDisplayA.value = 'No data available.';
            textDisplayB.value = 'No data available.';
            textDisplayATask2.value = 'No data available.';
            textDisplayBTask2.value = 'No data available.';
            textDisplayATask3.value = 'No data available.';
            textDisplayBTask3.value = 'No data available.';
            textDisplayAOriginal.value = 'No data available.';
            textDisplayBOriginal.value = 'No data available.';
            robertaPredsDisplay.textContent = 'No data available.';
            llamaPredsDisplay.textContent = 'No data available.';
            gemmaPredsDisplay.textContent = 'No data available.';
            maskedWordDisplay.value = 'No data available.';
            return;
        }

        textDisplayA.value = dataA[rowIndex] || '';
        textDisplayB.value = dataB[rowIndex] || '';
        textDisplayATask2.value = dataATask2[rowIndex] || '';
        textDisplayBTask2.value = dataBTask2[rowIndex] || '';
        textDisplayATask3.value = dataATask3[rowIndex] || '';
        textDisplayBTask3.value = dataBTask3[rowIndex] || '';
        textDisplayAOriginal.value = speakerAOriginalData[rowIndex] || ''; // Display SPEAKER_A_ORIGINAL
        textDisplayBOriginal.value = speakerBOriginalData[rowIndex] || ''; // Display SPEAKER_B_ORIGINAL
        robertaPredsDisplay.textContent = robertaPreds[rowIndex] || '';
        llamaPredsDisplay.textContent = llamaPreds[rowIndex] || '';
        gemmaPredsDisplay.textContent = gemmaPreds[rowIndex] || '';
        maskedWordDisplay.value = maskedWords[rowIndex] || '';
        
        // Set the values of the dropdowns
        statusSelect.value = statusData[rowIndex] || 'default';
        caseSelect.value = caseData[rowIndex] || 'modal'; // Default to 'modal'
        turnMaskedSelect.value = turnMaskedData[rowIndex] || 'first'; // Default to 'first'
    }

    // Event listeners for the buttons and inputs
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
        const rowNumber = parseInt(rowInput.value, 10);
        if (rowNumber >= 0 && rowNumber < dataA.length) {
            currentRow = rowNumber;
            showRow(currentRow);
        } else {
            console.error('Invalid row number.');
            textDisplayA.value = 'Invalid row number.';
            textDisplayB.value = 'Invalid row number.';
            textDisplayATask2.value = 'Invalid row number.';
            textDisplayBTask2.value = 'Invalid row number.';
            textDisplayATask3.value = 'Invalid row number.';
            textDisplayBTask3.value = 'Invalid row number.';
            textDisplayAOriginal.value = 'Invalid row number.';
            textDisplayBOriginal.value = 'Invalid row number.';
            robertaPredsDisplay.textContent = 'Invalid row number.';
            llamaPredsDisplay.textContent = 'Invalid row number.';
            gemmaPredsDisplay.textContent = 'Invalid row number.';
            maskedWordDisplay.value = 'Invalid row number.';
        }
    });

    submitButton.addEventListener('click', () => {
        if (dataA.length === 0) return;

        dataA[currentRow] = textDisplayA.value;
        dataB[currentRow] = textDisplayB.value;
        dataATask2[currentRow] = textDisplayATask2.value;
        dataBTask2[currentRow] = textDisplayBTask2.value;
        dataATask3[currentRow] = textDisplayATask3.value;
        dataBTask3[currentRow] = textDisplayBTask3.value;
        speakerAOriginalData[currentRow] = textDisplayAOriginal.value; // Save SPEAKER_A_ORIGINAL
        speakerBOriginalData[currentRow] = textDisplayBOriginal.value; // Save SPEAKER_B_ORIGINAL
        statusData[currentRow] = statusSelect.value;
        caseData[currentRow] = caseSelect.value;
        turnMaskedData[currentRow] = turnMaskedSelect.value;
        robertaPreds[currentRow] = robertaPredsDisplay.textContent;
        llamaPreds[currentRow] = llamaPredsDisplay.textContent;
        gemmaPreds[currentRow] = gemmaPredsDisplay.textContent;
        maskedWords[currentRow] = maskedWordDisplay.value;

        console.log('Data saved for row:', currentRow);
    });

    loadCSV(); // Initial load of the CSV data
});