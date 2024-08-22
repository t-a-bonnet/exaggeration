document.addEventListener('DOMContentLoaded', () => {
    const textDisplayA = document.getElementById('text-display-a');
    const textDisplayB = document.getElementById('text-display-b');
    const statusSelect = document.getElementById('status-select');
    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    const goButton = document.getElementById('go-button');
    const rowInput = document.getElementById('row-input');
    const submitButton = document.getElementById('submit-button');
    const coherenceRadioButtons = document.querySelectorAll('input[name="coherence"]');

    let currentRow = 0;
    let dataA = [];
    let dataB = [];
    let coherenceRatings = [];

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
            const response = await fetch('data.csv');
            const text = await response.text();

            const rows = parseCSV(text);
            if (rows.length < 2) {
                console.error('Not enough rows in CSV file.');
                displayNoData();
                return;
            }

            const header = rows[0];
            const columnIndexA = header.indexOf('speaker_a_task_1');
            const columnIndexB = header.indexOf('speaker_b_task_1');
            const columnIndexCoherence = header.indexOf('coherence_task_1');

            if (columnIndexA === undefined || columnIndexB === undefined || columnIndexCoherence === undefined) {
                console.error('Required columns not found');
                displayNoData();
                return;
            }

            dataA = rows.slice(1).map(row => row[columnIndexA] || '');
            dataB = rows.slice(1).map(row => row[columnIndexB] || '');
            coherenceRatings = rows.slice(1).map(row => row[columnIndexCoherence] || '');

            showRow(currentRow);

        } catch (error) {
            console.error('Error loading CSV:', error);
            displayNoData();
        }
    }

    // Function to display a specific row
    function showRow(index) {
        if (dataA.length === 0 || dataB.length === 0 || coherenceRatings.length === 0) return;

        textDisplayA.value = dataA[index] || '';
        textDisplayB.value = dataB[index] || '';
        statusSelect.value = statusSelect.value || 'Incomplete';

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

            // Update local data arrays after successful submission
            if (resultA.success) dataA[currentRow] = updatedTextA;
            if (resultB.success) dataB[currentRow] = updatedTextB;
            if (resultCoherence.success) coherenceRatings[currentRow] = updatedCoherence;

            alert('Changes successfully submitted!');

        } catch (error) {
            console.error('Error submitting changes:', error);
            alert('Error submitting changes: ' + error.message);
        } finally {
            submitButton.disabled = false;
        }
    }

    // Display no data message
    function displayNoData() {
        textDisplayA.value = 'No data available.';
        textDisplayB.value = 'No data available.';
        coherenceRadioButtons.forEach(button => button.checked = false);
    }

    // Event listeners
    previousButton.addEventListener('click', showPreviousRow);
    nextButton.addEventListener('click', showNextRow);
    goButton.addEventListener('click', goToRow);
    submitButton.addEventListener('click', submitChanges);

    // Load the CSV data on page load
    loadCSV();
});