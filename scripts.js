document.addEventListener('DOMContentLoaded', () => {
    const textDisplayA = document.getElementById('text-display-a');
    const textDisplayB = document.getElementById('text-display-b');
    const textDisplayATask2 = document.getElementById('text-display-a-task-2');
    const textDisplayBTask2 = document.getElementById('text-display-b-task-2');
    const textDisplayATask3 = document.getElementById('text-display-a-task-3');
    const textDisplayBTask3 = document.getElementById('text-display-b-task-3');
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
    const originalADisplay = document.getElementById('original-a');
    const originalBDisplay = document.getElementById('original-b');

    let currentRow = 0;
    let dataA = [];
    let dataB = [];
    let dataATask2 = [];
    let dataBTask2 = [];
    let dataATask3 = [];
    let dataBTask3 = [];
    let statusData = [];
    let caseData = [];
    let turnMaskedData = []; // New data array for turn_masked
    let robertaPreds = [];
    let llamaPreds = [];
    let gemmaPreds = [];
    let maskedWords = [];
    let originalDataA = [];
    let originalDataB = [];

    let columnIndexA;
    let columnIndexB;
    let columnIndexATask2;
    let columnIndexBTask2;
    let columnIndexATask3;
    let columnIndexBTask3;
    let statusColumnIndex;
    let caseColumnIndex;
    let turnMaskedColumnIndex; // New column index for turn_masked
    let robertaPredsColumnIndex;
    let llamaPredsColumnIndex;
    let gemmaPredsColumnIndex;
    let maskedWordColumnIndex;
    let originalAColumnIndex;
    let originalBColumnIndex;

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
                maskedWordDisplay.value = 'No data available.';
                originalADisplay.textContent = 'No data available.';
                originalBDisplay.textContent = 'No data available.';
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
            caseColumnIndex = header.indexOf('case'); // New column index for case
            turnMaskedColumnIndex = header.indexOf('turn_masked'); // New column index for turn_masked
            robertaPredsColumnIndex = header.indexOf('roberta_preds');
            llamaPredsColumnIndex = header.indexOf('llama_preds');
            gemmaPredsColumnIndex = header.indexOf('gemma_preds');
            maskedWordColumnIndex = header.indexOf('masked_word');
            originalAColumnIndex = header.indexOf('speaker_a_original');
            originalBColumnIndex = header.indexOf('speaker_b_original');

            if (columnIndexA === undefined || columnIndexB === undefined || columnIndexATask2 === undefined || columnIndexBTask2 === undefined || columnIndexATask3 === undefined || columnIndexBTask3 === undefined || statusColumnIndex === undefined || caseColumnIndex === undefined || turnMaskedColumnIndex === undefined) {
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
                maskedWordDisplay.value = 'Required columns not found.';
                originalADisplay.textContent = 'Required columns not found.';
                originalBDisplay.textContent = 'Required columns not found.';
                return;
            }

            dataA = rows.slice(1).map(row => row[columnIndexA] || '');
            dataB = rows.slice(1).map(row => row[columnIndexB] || '');
            dataATask2 = rows.slice(1).map(row => row[columnIndexATask2] || '');
            dataBTask2 = rows.slice(1).map(row => row[columnIndexBTask2] || '');
            dataATask3 = rows.slice(1).map(row => row[columnIndexATask3] || '');
            dataBTask3 = rows.slice(1).map(row => row[columnIndexBTask3] || '');
            statusData = rows.slice(1).map(row => row[statusColumnIndex] || '');
            caseData = rows.slice(1).map(row => row[caseColumnIndex] || 'modal'); // Default to 'modal'
            turnMaskedData = rows.slice(1).map(row => row[turnMaskedColumnIndex] || 'first'); // Default to 'first'
            robertaPreds = rows.slice(1).map(row => row[robertaPredsColumnIndex] || '');
            llamaPreds = rows.slice(1).map(row => row[llamaPredsColumnIndex] || '');
            gemmaPreds = rows.slice(1).map(row => row[gemmaPredsColumnIndex] || '');
            maskedWords = rows.slice(1).map(row => row[maskedWordColumnIndex] || '');
            originalDataA = rows.slice(1).map(row => row[originalAColumnIndex] || '');
            originalDataB = rows.slice(1).map(row => row[originalBColumnIndex] || '');

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
            originalADisplay.textContent = 'Error loading CSV data.';
            originalBDisplay.textContent = 'Error loading CSV data.';
        }
    }

    // Function to display a specific row
    function showRow(index) {
        if (dataA.length === 0 || dataB.length === 0 || dataATask2.length === 0 || dataBTask2.length === 0 || dataATask3.length === 0 || dataBTask3.length === 0 || statusData.length === 0 || caseData.length === 0 || turnMaskedData.length === 0) return;
        textDisplayA.value = dataA[index] || '';
        textDisplayB.value = dataB[index] || '';
        textDisplayATask2.value = dataATask2[index] || '';
        textDisplayBTask2.value = dataBTask2[index] || '';
        textDisplayATask3.value = dataATask3[index] || '';
        textDisplayBTask3.value = dataBTask3[index] || '';
        statusSelect.value = statusData[index] || 'Incomplete';
        caseSelect.value = caseData[index] || 'Select case';
        turnMaskedSelect.value = turnMaskedData[index] || 'Select turn masked'; // Set default value for turn_masked
        robertaPredsDisplay.textContent = robertaPreds[index] || '';
        llamaPredsDisplay.textContent = llamaPreds[index] || '';
        gemmaPredsDisplay.textContent = gemmaPreds[index] || '';
        maskedWordDisplay.value = maskedWords[index] || 'Enter masked word';
        originalADisplay.textContent = llamaPreds[index] || '';
        originalBDisplay.textContent = gemmaPreds[index] || '';

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
        const updatedCase = caseSelect.value;
        const updatedTurnMasked = turnMaskedSelect.value; // Get value from turn_masked dropdown
        const updatedMaskedWord = maskedWordDisplay.value;

        submitButton.disabled = true;

        try {
            const responseA = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow,
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
                    id: currentRow,
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
                    id: currentRow,
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
                    id: currentRow,
                    text: updatedTextBTask2,
                    column: 'speaker_b_task_2'
                })
            });

            const resultBTask2 = await responseBTask2.json();
            if (!resultBTask2.success) {
                alert('Error updating column "speaker_b_task_2": ' + resultBTask2.message);
            }

            const responseATask3 = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow,
                    text: updatedTextATask3,
                    column: 'speaker_a_task_3'
                })
            });

            const resultATask3 = await responseATask3.json();
            if (!resultATask3.success) {
                alert('Error updating column "speaker_a_task_3": ' + resultATask3.message);
            }

            const responseBTask3 = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow,
                    text: updatedTextBTask3,
                    column: 'speaker_b_task_3'
                })
            });

            const resultBTask3 = await responseBTask3.json();
            if (!resultBTask3.success) {
                alert('Error updating column "speaker_b_task_3": ' + resultBTask3.message);
            }

            const responseStatus = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow,
                    text: updatedStatus,
                    column: 'status'
                })
            });

            const resultStatus = await responseStatus.json();
            if (!resultStatus.success) {
                alert('Error updating column "status": ' + resultStatus.message);
            }

            // Update the case column
            const responseCase = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow,
                    text: updatedCase,
                    column: 'case'
                })
            });

            const resultCase = await responseCase.json();
            if (!resultCase.success) {
                alert('Error updating column "case": ' + resultCase.message);
            }

            // Update the turn_masked column
            const responseTurnMasked = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow,
                    text: updatedTurnMasked,
                    column: 'turn_masked'
                })
            });

            const resultTurnMasked = await responseTurnMasked.json();
            if (!resultTurnMasked.success) {
                alert('Error updating column "turn_masked": ' + resultTurnMasked.message);
            }

            // Update the masked word column
            const responseMaskedWord = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow,
                    text: updatedMaskedWord,
                    column: 'masked_word'
                })
            });

            const resultMaskedWord = await responseMaskedWord.json();
            if (!resultMaskedWord.success) {
                alert('Error updating column "masked_word": ' + resultMaskedWord.message);
            }

            // Update the local data arrays after successful submission
            if (resultA.success) dataA[currentRow] = updatedTextA;
            if (resultB.success) dataB[currentRow] = updatedTextB;
            if (resultATask2.success) dataATask2[currentRow] = updatedTextATask2;
            if (resultBTask2.success) dataBTask2[currentRow] = updatedTextBTask2;
            if (resultATask3.success) dataATask3[currentRow] = updatedTextATask3;
            if (resultBTask3.success) dataBTask3[currentRow] = updatedTextBTask3;
            if (resultStatus.success) statusData[currentRow] = updatedStatus;
            if (resultCase.success) caseData[currentRow] = updatedCase;
            if (resultTurnMasked.success) turnMaskedData[currentRow] = updatedTurnMasked;
            if (resultMaskedWord.success) maskedWords[currentRow] = updatedMaskedWord;

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