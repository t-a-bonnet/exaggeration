document.addEventListener('DOMContentLoaded', () => {
    // Prompt the author for their name and store it in a variable
    let authorName = '';

    while (true) {
        authorName = prompt('Please enter author name:');
        if (authorName === 'Janet' || authorName === 'Ved' || authorName === 'Tyler') {
            break;
        } else {
            alert('Invalid name.');
        }
    }

    // Prompt the author for mode and store it in a variable
    let authorMode = '';

    while (true) {
        authorMode = prompt('Please enter author mode (primary or proofer):');
        if (authorMode === 'primary' || authorMode === 'proofer') {
            break;
        } else {
            alert('Invalid mode.');
        }
    }

    function checkAuthorMode() {
        const isProoferMode = authorMode === 'proofer';

        const rejectControl = document.getElementById('reject-control');
        if (isProoferMode) {
            rejectControl.classList.remove('hidden');
        } else {
            rejectControl.classList.add('hidden');
        }
    }

    checkAuthorMode();

    // Function to calculate distribution
    function calculateDistribution(data, key) {
        const distribution = {};
        // Exclude header row
        data.slice(1).forEach(item => {
            const value = item[key];
            if (value !== undefined && value !== null) {
                distribution[value] = (distribution[value] || 0) + 1;
            }
        });
        return distribution;
    }

    // Function to display distribution using Chart.js
    function displayDistribution(chartId, distribution) {
        const ctx = document.getElementById(chartId).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(distribution),
                datasets: [{
                    label: 'Count',
                    data: Object.values(distribution),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    const textDisplayA = document.getElementById('text-display-a');
    const textDisplayB = document.getElementById('text-display-b');
    const textDisplayATask2 = document.getElementById('text-display-a-task-2');
    const textDisplayBTask2 = document.getElementById('text-display-b-task-2');
    const textDisplayATask3 = document.getElementById('text-display-a-task-3');
    const textDisplayBTask3 = document.getElementById('text-display-b-task-3');
    const itemTypeSelect = document.getElementById('item-type-select');
    const statusSelect = document.getElementById('status-select');
    const rejectSelect = document.getElementById('reject-select');
    const caseSelect = document.getElementById('case-select');
    const turnModifiedSelectTask2 = document.getElementById('turn-modified-select-task-2');
    const turnModifiedSelectTask3 = document.getElementById('turn-modified-select-task-3');
    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    const goButton = document.getElementById('go-button');
    const rowInput = document.getElementById('row-input');
    const submitButton = document.getElementById('submit-button');
    const modifiedWordDisplay = document.getElementById('modified-word');
    const originalADisplay = document.getElementById('original-a');
    const originalBDisplay = document.getElementById('original-b');
    const coherenceRadioButtons1 = document.querySelectorAll('input[name="coherence1"]');
    const coherenceRadioButtons2 = document.querySelectorAll('input[name="coherence2"]');
    const coherenceRadioButtons3 = document.querySelectorAll('input[name="coherence3"]');
    const agreementRadioButtons1 = document.querySelectorAll('input[name="agreement1"]');
    const agreementRadioButtons2 = document.querySelectorAll('input[name="agreement2"]');
    const agreementRadioButtons3 = document.querySelectorAll('input[name="agreement3"]');
    const informativenessRadioButtons1 = document.querySelectorAll('input[name="informativeness1"]');
    const informativenessRadioButtons2 = document.querySelectorAll('input[name="informativeness2"]');
    const informativenessRadioButtons3 = document.querySelectorAll('input[name="informativeness3"]');

    let currentRow = 0;
    let dataA = [];
    let dataB = [];
    let dataATask2 = [];
    let dataBTask2 = [];
    let dataATask3 = [];
    let dataBTask3 = [];
    let itemTypeData = [];
    let statusData = [];
    let rejectData = [];
    let caseData = [];
    let turnModifiedDataTask2 = [];
    let turnModifiedDataTask3 = [];
    let modifiedWords = [];
    let originalDataA = [];
    let originalDataB = [];
    let coherenceRatings1 = [];
    let coherenceRatings2 = [];
    let coherenceRatings3 = [];
    let agreementRatings1 = [];
    let agreementRatings2 = [];
    let agreementRatings3 = [];
    let informativenessRatings1 = [];
    let informativenessRatings2 = [];
    let informativenessRatings3 = [];

    let columnIndexA;
    let columnIndexB;
    let columnIndexATask2;
    let columnIndexBTask2;
    let columnIndexATask3;
    let columnIndexBTask3;
    let itemTypeColumnIndex;
    let statusColumnIndex;
    let rejectColumnIndex;
    let caseColumnIndex;
    let turnModifiedColumnIndexTask2;
    let turnModifiedColumnIndexTask3;
    let modifiedWordColumnIndex;
    let originalAColumnIndex;
    let originalBColumnIndex;
    let coherenceColumnIndex1;
    let coherenceColumnIndex2;
    let coherenceColumnIndex3;
    let agreementColumnIndex1;
    let agreementColumnIndex2;
    let agreementColumnIndex3;
    let informativenessColumnIndex1;
    let informativenessColumnIndex2;
    let informativenessColumnIndex3;

    // Function to parse CSV text, handling commas within quotes
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
    async function loadCSV(currentRow) {
        try {
            const response = await fetch('exaggeration_master_job_2.csv');
            const text = await response.text();

            const rows = parseCSV(text);
            if (rows.length < 2) {
                console.error('Not enough rows in CSV file.');
                textDisplayA.value = 'No data available.';
                textDisplayB.value = 'No data available.';
                textDisplayATask2.value = 'No data available.';
                textDisplayBTask2.value = 'No data available.';
                textDisplayATask3.value = 'No data available.';
                textDisplayBTask3.value = 'No data available.';
                modifiedWordDisplay.value = 'No data available.';
                originalADisplay.textContent = 'No data available.';
                originalBDisplay.textContent = 'No data available.';
                return;
            }

            const header = rows[0];
            columnIndexA = header.indexOf('speaker_a_original');
            columnIndexB = header.indexOf('speaker_b_original');
            columnIndexATask2 = header.indexOf('speaker_a_task_2');
            columnIndexBTask2 = header.indexOf('speaker_b_task_2');
            columnIndexATask3 = header.indexOf('speaker_a_task_3');
            columnIndexBTask3 = header.indexOf('speaker_b_task_3');
            agreeDisagreeColumnIndex = header.indexOf('agree_disagree');
            itemTypeColumnIndex = header.indexOf('item_type');
            statusColumnIndex = header.indexOf('status');
            rejectColumnIndex = header.indexOf('reject');
            caseColumnIndex = header.indexOf('case');
            turnModifiedColumnIndexTask2 = header.indexOf('turn_modified_task_2');
            turnModifiedColumnIndexTask3 = header.indexOf('turn_modified_task_3');
            modifiedWordColumnIndex = header.indexOf('modified_word');
            originalAColumnIndex = header.indexOf('speaker_a_original');
            originalBColumnIndex = header.indexOf('speaker_b_original');
            coherenceColumnIndex1 = header.indexOf('coherence_task_1');
            coherenceColumnIndex2 = header.indexOf('coherence_task_2');
            coherenceColumnIndex3 = header.indexOf('coherence_task_3');
            agreementColumnIndex1 = header.indexOf('agreement_task_1');
            agreementColumnIndex2 = header.indexOf('agreement_task_2');
            agreementColumnIndex3 = header.indexOf('agreement_task_3');
            informativenessColumnIndex1 = header.indexOf('informativeness_task_1');
            informativenessColumnIndex2 = header.indexOf('informativeness_task_2');
            informativenessColumnIndex3 = header.indexOf('informativeness_task_3');

            dataA = rows.slice(1).map(row => row[columnIndexA] || 'no data');
            dataB = rows.slice(1).map(row => row[columnIndexB] || 'no data');
            dataATask2 = rows.slice(1).map(row => row[columnIndexATask2] || 'no data');
            dataBTask2 = rows.slice(1).map(row => row[columnIndexBTask2] || 'no data');
            dataATask3 = rows.slice(1).map(row => row[columnIndexATask3] || 'no data');
            dataBTask3 = rows.slice(1).map(row => row[columnIndexBTask3] || 'no data');
            itemTypeData = rows.slice(1).map(row => row[itemTypeColumnIndex] || 'no data');
            statusData = rows.slice(1).map(row => row[statusColumnIndex] || 'no data');
            rejectData = rows.slice(1).map(row => row[rejectColumnIndex] || 'no data');
            caseData = rows.slice(1).map(row => row[caseColumnIndex] || 'no data');
            turnModifiedDataTask2 = rows.slice(1).map(row => row[turnModifiedColumnIndexTask2] || 'no data');
            turnModifiedDataTask3 = rows.slice(1).map(row => row[turnModifiedColumnIndexTask3] || 'no data');
            modifiedWords = rows.slice(1).map(row => row[modifiedWordColumnIndex] || 'no data');
            originalDataA = rows.slice(1).map(row => row[originalAColumnIndex] || 'no data');
            originalDataB = rows.slice(1).map(row => row[originalBColumnIndex] || 'no data');
            coherenceRatings1 = rows.slice(1).map(row => row[coherenceColumnIndex1] || '');
            coherenceRatings2 = rows.slice(1).map(row => row[coherenceColumnIndex2] || '');
            coherenceRatings3 = rows.slice(1).map(row => row[coherenceColumnIndex3] || '');
            agreementRatings1 = rows.slice(1).map(row => row[agreementColumnIndex1] || '');
            agreementRatings2 = rows.slice(1).map(row => row[agreementColumnIndex2] || '');
            agreementRatings3 = rows.slice(1).map(row => row[agreementColumnIndex3] || '');
            informativenessRatings1 = rows.slice(1).map(row => row[informativenessColumnIndex1] || '');
            informativenessRatings2 = rows.slice(1).map(row => row[informativenessColumnIndex2] || '');
            informativenessRatings3 = rows.slice(1).map(row => row[informativenessColumnIndex3] || '');
        
            // Calculate and display distributions using Chart.js
            displayDistribution('case-distribution-chart', calculateDistribution(rows, caseColumnIndex));
            displayDistribution('status-distribution-chart', calculateDistribution(rows, statusColumnIndex));
            displayDistribution('turn-modified-distribution-chart-task-2', calculateDistribution(rows, turnModifiedColumnIndexTask2));
            displayDistribution('turn-modified-distribution-chart-task-3', calculateDistribution(rows, turnModifiedColumnIndexTask3));
        
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
            modifiedWordDisplay.value = 'Error loading CSV data.';
            originalADisplay.textContent = 'Error loading CSV data.';
            originalBDisplay.textContent = 'Error loading CSV data.';
        }
    };

    // Function to display a specific row
    function showRow(index) {
        // Display row data or defaults
        textDisplayA.value = dataA[index] || 'no data';
        textDisplayB.value = dataB[index] || 'no data';
        textDisplayATask2.value = dataATask2[index] || 'no data';
        textDisplayBTask2.value = dataBTask2[index] || 'no data';
        textDisplayATask3.value = dataATask3[index] || 'no data';
        textDisplayBTask3.value = dataBTask3[index] || 'no data';
        itemTypeSelect.value = itemTypeData[index] || 'no data';
        statusSelect.value = statusData[index] || 'no data';
        rejectSelect.value = rejectData[index] || 'no data';
        caseSelect.value = caseData[index] || 'no data';
        turnModifiedSelectTask2.value = turnModifiedDataTask2[index] || 'no data';
        turnModifiedSelectTask3.value = turnModifiedDataTask3[index] || 'no data';
        modifiedWordDisplay.value = modifiedWords[index] || 'no data';
        originalADisplay.textContent = originalDataA[index] || 'no data';
        originalBDisplay.textContent = originalDataB[index] || 'no data';

        const currentCoherenceRating1 = coherenceRatings1[index] || '';
        coherenceRadioButtons1.forEach(button => {
            button.checked = button.value === currentCoherenceRating1;
        });

        const currentCoherenceRating2 = coherenceRatings2[index] || '';
        coherenceRadioButtons2.forEach(button => {
            button.checked = button.value === currentCoherenceRating2;
        });

        const currentCoherenceRating3 = coherenceRatings3[index] || '';
        coherenceRadioButtons3.forEach(button => {
            button.checked = button.value === currentCoherenceRating3;
        });

        const currentAgreementRating1 = agreementRatings1[index] || '';
        agreementRadioButtons1.forEach(button => {
            button.checked = button.value === currentAgreementRating1;
        });

        const currentAgreementRating2 = agreementRatings2[index] || '';
        agreementRadioButtons2.forEach(button => {
            button.checked = button.value === currentAgreementRating2;
        });

        const currentAgreementRating3 = agreementRatings3[index] || '';
        agreementRadioButtons3.forEach(button => {
            button.checked = button.value === currentAgreementRating3;
        });

        const currentInformativenessRating1 = informativenessRatings1[index] || '';
        informativenessRadioButtons1.forEach(button => {
            button.checked = button.value === currentInformativenessRating1;
        });

        const currentInformativenessRating2 = informativenessRatings2[index] || '';
        informativenessRadioButtons2.forEach(button => {
            button.checked = button.value === currentInformativenessRating2;
        });

        const currentInformativenessRating3 = informativenessRatings3[index] || '';
        informativenessRadioButtons3.forEach(button => {
            button.checked = button.value === currentInformativenessRating3;
        });

        // Update the row number input box
        rowInput.value = index + 1;

        // Disable/Enable navigation buttons
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
        // Retrieve input values
        const updatedTextA = textDisplayA.value.trim() || 'no data';
        const updatedTextB = textDisplayB.value.trim() || 'no data';
        const updatedTextATask2 = textDisplayATask2.value.trim() || 'no data';
        const updatedTextBTask2 = textDisplayBTask2.value.trim() || 'no data';
        const updatedTextATask3 = textDisplayATask3.value.trim() || 'no data';
        const updatedTextBTask3 = textDisplayBTask3.value.trim() || 'no data';
        const updatedItemType = itemTypeSelect.value.trim() || 'no data';
        const updatedStatus = statusSelect.value.trim() || 'no data';
        const updatedReject = rejectSelect.value.trim() || 'no data';
        const updatedCase = caseSelect.value.trim() || 'no data';
        const updatedTurnModifiedTask2 = turnModifiedSelectTask2.value.trim() || 'no data';
        const updatedTurnModifiedTask3 = turnModifiedSelectTask3.value.trim() || 'no data';
        const updatedModifiedWord = modifiedWordDisplay.value.trim() || 'no data';
        const updatedCoherence1 = document.querySelector('input[name="coherence1"]:checked')?.value || 'no data';
        const updatedCoherence2 = document.querySelector('input[name="coherence2"]:checked')?.value || 'no data';
        const updatedCoherence3 = document.querySelector('input[name="coherence3"]:checked')?.value || 'no data';
        const updatedAgreement1 = document.querySelector('input[name="agreement1"]:checked')?.value || 'no data';
        const updatedAgreement2 = document.querySelector('input[name="agreement2"]:checked')?.value || 'no data';
        const updatedAgreement3 = document.querySelector('input[name="agreement3"]:checked')?.value || 'no data';
        const updatedInformativeness1 = document.querySelector('input[name="informativeness1"]:checked')?.value || 'no data';
        const updatedInformativeness2 = document.querySelector('input[name="informativeness2"]:checked')?.value || 'no data';
        const updatedInformativeness3 = document.querySelector('input[name="informativeness3"]:checked')?.value || 'no data';

        submitButton.disabled = true;

        // Construct the updates array for batch processing
        const updates = [
            { id: currentRow, column: 'speaker_a_original', text: updatedTextA },
            { id: currentRow, column: 'speaker_b_original', text: updatedTextB },
            { id: currentRow, column: 'speaker_a_task_2', text: updatedTextATask2 },
            { id: currentRow, column: 'speaker_b_task_2', text: updatedTextBTask2 },
            { id: currentRow, column: 'item_type', text: updatedItemType },
            { id: currentRow, column: 'status', text: updatedStatus },
            { id: currentRow, column: 'reject', text: updatedReject },
            { id: currentRow, column: 'case', text: updatedCase },
            { id: currentRow, column: 'turn_modified_task_2', text: updatedTurnModifiedTask2 },
            { id: currentRow, column: 'turn_modified_task_3', text: updatedTurnModifiedTask3 },
            { id: currentRow, column: 'modified_word', text: updatedModifiedWord },
            { id: currentRow, column: 'coherence_task_1', text: updatedCoherence1 },
            { id: currentRow, column: 'coherence_task_2', text: updatedCoherence2 },
            { id: currentRow, column: 'coherence_task_3', text: updatedCoherence3 },
            { id: currentRow, column: 'agreement_task_1', text: updatedAgreement1 },
            { id: currentRow, column: 'agreement_task_2', text: updatedAgreement2 },
            { id: currentRow, column: 'agreement_task_3', text: updatedAgreement3 },
            { id: currentRow, column: 'informativeness_task_1', text: updatedInformativeness1 },
            { id: currentRow, column: 'informativeness_task_2', text: updatedInformativeness2 },
            { id: currentRow, column: 'informativeness_task_3', text: updatedInformativeness3 },
            { id: currentRow, column: 'author', text: authorName },
            { id: currentRow, column: 'author_mode', text: authorMode }
        ];

        // Helper function to submit batch updates
        async function submitBatchUpdates(updates) {
            try {
                const response = await fetch('/.netlify/functions/update-csv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ updates })
                });

                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.message);
                }
                return result;
            } catch (error) {
                alert(`Error submitting batch updates: ${error.message}`);
                throw error; // Rethrow to handle in the outer try/catch
            }
        }

        // Submit batch updates
        try {
            await submitBatchUpdates(updates);

            // Update local data arrays after successful submission
            dataA[currentRow] = updatedTextA;
            dataB[currentRow] = updatedTextB;
            dataATask2[currentRow] = updatedTextATask2;
            dataBTask2[currentRow] = updatedTextBTask2;
            dataATask3[currentRow] = updatedTextATask3;
            dataBTask3[currentRow] = updatedTextBTask3;
            itemTypeData[currentRow] = updatedItemType;
            statusData[currentRow] = updatedStatus;
            rejectData[currentRow] = updatedReject;
            caseData[currentRow] = updatedCase;
            turnModifiedDataTask2[currentRow] = updatedTurnModifiedTask2;
            turnModifiedDataTask3[currentRow] = updatedTurnModifiedTask3;
            modifiedWords[currentRow] = updatedModifiedWord;
            coherenceRatings1[currentRow] = updatedCoherence1;
            coherenceRatings2[currentRow] = updatedCoherence2;
            coherenceRatings3[currentRow] = updatedCoherence3;
            agreementRatings1[currentRow] = updatedAgreement1;
            agreementRatings2[currentRow] = updatedAgreement2;
            agreementRatings3[currentRow] = updatedAgreement3;
            informativenessRatings1[currentRow] = updatedInformativeness1;
            informativenessRatings2[currentRow] = updatedInformativeness2;
            informativenessRatings3[currentRow] = updatedInformativeness3;

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
        loadCSV(currentRow);
    });