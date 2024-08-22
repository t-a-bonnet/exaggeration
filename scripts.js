document.addEventListener('DOMContentLoaded', () => {
    const textDisplayA = document.getElementById('text-display-a');
    const textDisplayB = document.getElementById('text-display-b');
    const statusSelect = document.getElementById('status-select');
    const caseSelect = document.getElementById('case-select');
    const turnMaskedSelect = document.getElementById('turn-masked-select');
    const maskedWordDisplay = document.getElementById('masked-word');
    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    const goButton = document.getElementById('go-button');
    const rowInput = document.getElementById('row-input');
    const submitButton = document.getElementById('submit-button');
    const coherenceRadioButtons = document.querySelectorAll('input[name="coherence"]');

    let currentRow = 0;
    let dataA = [];
    let dataB = [];
    let statusData = [];
    let caseData = [];
    let turnMaskedData = [];
    let maskedWords = [];
    let coherenceRatings = [];

    let columnIndexA;
    let columnIndexB;
    let statusColumnIndex;
    let caseColumnIndex;
    let turnMaskedColumnIndex;
    let maskedWordColumnIndex;
    let coherenceColumnIndex;

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

            const rows = parseCSV(text);
            if (rows.length < 2) {
                console.error('Not enough rows in CSV file.');
                textDisplayA.value = 'No data available.';
                textDisplayB.value = 'No data available.';
                maskedWordDisplay.value = 'No data available.';
                return;
            }

            const header = rows[0];
            columnIndexA = header.indexOf('speaker_a_task_1');
            columnIndexB = header.indexOf('speaker_b_task_1');
            statusColumnIndex = header.indexOf('status');
            caseColumnIndex = header.indexOf('case');
            turnMaskedColumnIndex = header.indexOf('turn_masked');
            maskedWordColumnIndex = header.indexOf('masked_word');
            coherenceColumnIndex = header.indexOf('coherence_task_1');

            if (columnIndexA === -1 || columnIndexB === -1 || statusColumnIndex === -1 || caseColumnIndex === -1 || turnMaskedColumnIndex === -1 || maskedWordColumnIndex === -1 || coherenceColumnIndex === -1) {
                console.error('Required columns not found');
                textDisplayA.value = 'Required columns not found.';
                textDisplayB.value = 'Required columns not found.';
                maskedWordDisplay.value = 'Required columns not found.';
                return;
            }

            dataA = rows.slice(1).map(row => row[columnIndexA] || '');
            dataB = rows.slice(1).map(row => row[columnIndexB] || '');
            statusData = rows.slice(1).map(row => row[statusColumnIndex] || '');
            caseData = rows.slice(1).map(row => row[caseColumnIndex] || '');
            turnMaskedData = rows.slice(1).map(row => row[turnMaskedColumnIndex] || '');
            maskedWords = rows.slice(1).map(row => row[maskedWordColumnIndex] || '');
            coherenceRatings = rows.slice(1).map(row => row[coherenceColumnIndex] || '');

            try {
                showRow(currentRow);
            } catch (err) {
                console.error('Error displaying row:', err.message);
            }

        } catch (error) {
            console.error('Error loading CSV:', error);
            textDisplayA.value = 'Error loading CSV data.';
            textDisplayB.value = 'Error loading CSV data.';
            maskedWordDisplay.value = 'Error loading CSV data.';
        }
    }

    // Function to display a specific row
    function showRow(index) {
        if (dataA.length === 0 || dataB.length === 0 || statusData.length === 0 || caseData.length === 0 || turnMaskedData.length === 0) return;
        textDisplayA.value = dataA[index] || '';
        textDisplayB.value = dataB[index] || '';
        statusSelect.value = statusData[index] || 'Incomplete';
        caseSelect.value = caseData[index] || 'Select case';
        turnMaskedSelect.value = turnMaskedData[index] || 'Select turn masked';
        maskedWordDisplay.value = maskedWords[index] || '';
        const currentRating = coherenceRatings[index] || '';
        coherenceRadioButtons.forEach(button => {
            button.checked = button.value === currentRating;
        });

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
        const updatedStatus = statusSelect.value;
        const updatedCase = caseSelect.value;
        const updatedTurnMasked = turnMaskedSelect.value;
        const updatedMaskedWord = maskedWordDisplay.value;
        const updatedCoherence = document.querySelector('input[name="coherence"]:checked')?.value || '';

        submitButton.disabled = true;

        try {
            // Submit updated text for Speaker A
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

            // Submit updated text for Speaker B
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

            // Submit updated status
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

            // Submit updated coherence rating
            const responseCoherence = await fetch('/.netlify/functions/update-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentRow,
                    text: updatedCoherence,
                    column: 'coherence_task_1'
                })
            });

            const resultCoherence = await responseCoherence.json();
            if (!resultCoherence.success) {
                alert('Error updating column "coherence_task_1": ' + resultCoherence.message);
            }

            // Update the local data arrays after successful submission
            if (resultA.success) dataA[currentRow] = updatedTextA;
            if (resultB.success) dataB[currentRow] = updatedTextB;
            if (resultStatus.success) statusData[currentRow] = updatedStatus;
            if (resultCase.success) caseData[currentRow] = updatedCase;
            if (resultTurnMasked.success) turnMaskedData[currentRow] = updatedTurnMasked;
            if (resultMaskedWord.success) maskedWords[currentRow] = updatedMaskedWord;
            if (resultCoherence.success) coherenceRatings[currentRow] = updatedCoherence;

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