document.addEventListener('DOMContentLoaded', () => {
    // Prompt the user for their name and store it in a variable
    let userName = '';

    while (true) {
        userName = prompt('Please enter author name:');
        if (userName === 'Janet' || userName === 'Ved' || userName === 'Tyler') {
            break;
        } else {
            alert('Invalid name.');
        }
    }

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
    const originalADisplay = document.getElementById('original-a');
    const originalBDisplay = document.getElementById('original-b');
    const coherenceRadioButtons1 = document.querySelectorAll('input[name="coherence1"]');
    const coherenceRadioButtons2 = document.querySelectorAll('input[name="coherence2"]');
    const agreementRadioButtons1 = document.querySelectorAll('input[name="agreement1"]');
    const agreementRadioButtons2 = document.querySelectorAll('input[name="agreement2"]');
    const informativenessRadioButtons1 = document.querySelectorAll('input[name="informativeness1"]');
    const informativenessRadioButtons2 = document.querySelectorAll('input[name="informativeness2"]');

    let currentRow = 0;
    let dataA = [];
    let dataB = [];
    let dataATask2 = [];
    let dataBTask2 = [];
    let statusData = [];
    let caseData = [];
    let turnMaskedData = [];
    let robertaPreds = [];
    let llamaPreds = [];
    let gemmaPreds = [];
    let maskedWords = [];
    let originalDataA = [];
    let originalDataB = [];
    let coherenceRatings1 = [];
    let coherenceRatings2 = [];
    let agreementRatings1 = [];
    let agreementRatings2 = [];
    let informativenessRatings1 = [];
    let informativenessRatings2 = [];

    let columnIndexA;
    let columnIndexB;
    let columnIndexATask2;
    let columnIndexBTask2;
    let statusColumnIndex;
    let caseColumnIndex;
    let turnMaskedColumnIndex;
    let robertaPredsColumnIndex;
    let llamaPredsColumnIndex;
    let gemmaPredsColumnIndex;
    let maskedWordColumnIndex;
    let originalAColumnIndex;
    let originalBColumnIndex;
    let coherenceColumnIndex1;
    let coherenceColumnIndex2;
    let agreementColumnIndex1;
    let agreementColumnIndex2;
    let informativenessColumnIndex1;
    let informativenessColumnIndex2;

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
    async function loadCSV() {
        try {
            const response = await fetch('Appen data 16.8.2024.csv');
            const text = await response.text();

            const rows = parseCSV(text);
            if (rows.length < 2) {
                console.error('Not enough rows in CSV file.');
                textDisplayA.value = 'No data available.';
                textDisplayB.value = 'No data available.';
                textDisplayATask2.value = 'No data available.';
                textDisplayBTask2.value = 'No data available.';
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
            agreeDisagreeColumnIndex = header.indexOf('agree_disagree');
            statusColumnIndex = header.indexOf('status');
            caseColumnIndex = header.indexOf('case');
            turnMaskedColumnIndex = header.indexOf('turn_masked');
            robertaPredsColumnIndex = header.indexOf('roberta_preds');
            llamaPredsColumnIndex = header.indexOf('llama_preds');
            gemmaPredsColumnIndex = header.indexOf('gemma_preds');
            maskedWordColumnIndex = header.indexOf('masked_word');
            originalAColumnIndex = header.indexOf('speaker_a_original');
            originalBColumnIndex = header.indexOf('speaker_b_original');
            coherenceColumnIndex1 = header.indexOf('coherence_task_1');
            coherenceColumnIndex2 = header.indexOf('coherence_task_2');
            agreementColumnIndex1 = header.indexOf('agreement_task_1');
            agreementColumnIndex2 = header.indexOf('agreement_task_2');
            informativenessColumnIndex1 = header.indexOf('informativeness_task_1');
            informativenessColumnIndex2 = header.indexOf('informativeness_task_2');

            dataA = rows.slice(1).map(row => row[columnIndexA] || 'no data');
            dataB = rows.slice(1).map(row => row[columnIndexB] || 'no data');
            dataATask2 = rows.slice(1).map(row => row[columnIndexATask2] || 'no data');
            dataBTask2 = rows.slice(1).map(row => row[columnIndexBTask2] || 'no data');
            statusData = rows.slice(1).map(row => row[statusColumnIndex] || 'no data');
            caseData = rows.slice(1).map(row => row[caseColumnIndex] || 'no data');
            turnMaskedData = rows.slice(1).map(row => row[turnMaskedColumnIndex] || 'no data');
            robertaPreds = rows.slice(1).map(row => row[robertaPredsColumnIndex] || 'no data');
            llamaPreds = rows.slice(1).map(row => row[llamaPredsColumnIndex] || 'no data');
            gemmaPreds = rows.slice(1).map(row => row[gemmaPredsColumnIndex] || 'no data');
            maskedWords = rows.slice(1).map(row => row[maskedWordColumnIndex] || 'no data');
            originalDataA = rows.slice(1).map(row => row[originalAColumnIndex] || 'no data');
            originalDataB = rows.slice(1).map(row => row[originalBColumnIndex] || 'no data');
            coherenceRatings1 = rows.slice(1).map(row => row[coherenceColumnIndex1] || '');
            coherenceRatings2 = rows.slice(1).map(row => row[coherenceColumnIndex2] || '');
            agreementRatings1 = rows.slice(1).map(row => row[agreementColumnIndex1] || '');
            agreementRatings2 = rows.slice(1).map(row => row[agreementColumnIndex2] || '');
            informativenessRatings1 = rows.slice(1).map(row => row[informativenessColumnIndex1] || '');
            informativenessRatings2 = rows.slice(1).map(row => row[informativenessColumnIndex2] || '');
        
            // Calculate and display distributions using Chart.js
            displayDistribution('case-distribution-chart', calculateDistribution(rows, caseColumnIndex));
            displayDistribution('turn-masked-distribution-chart', calculateDistribution(rows, turnMaskedColumnIndex));
        
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
            robertaPredsDisplay.textContent = 'Error loading CSV data.';
            llamaPredsDisplay.textContent = 'Error loading CSV data.';
            gemmaPredsDisplay.textContent = 'Error loading CSV data.';
            maskedWordDisplay.value = 'Error loading CSV data.';
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
        statusSelect.value = statusData[index] || 'no data';
        caseSelect.value = caseData[index] || 'no data';
        turnMaskedSelect.value = turnMaskedData[index] || 'no data';
        robertaPredsDisplay.textContent = robertaPreds[index] || 'no data';
        llamaPredsDisplay.textContent = llamaPreds[index] || 'no data';
        gemmaPredsDisplay.textContent = gemmaPreds[index] || 'no data';
        maskedWordDisplay.value = maskedWords[index] || 'no data';
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

        const currentAgreementRating1 = agreementRatings1[index] || '';
        agreementRadioButtons1.forEach(button => {
            button.checked = button.value === currentAgreementRating1;
        });

        const currentAgreementRating2 = agreementRatings2[index] || '';
        agreementRadioButtons2.forEach(button => {
            button.checked = button.value === currentAgreementRating2;
        });

        const currentInformativenessRating1 = informativenessRatings1[index] || '';
        informativenessRadioButtons1.forEach(button => {
            button.checked = button.value === currentInformativenessRating1;
        });

        const currentInformativenessRating2 = informativenessRatings2[index] || '';
        informativenessRadioButtons2.forEach(button => {
            button.checked = button.value === currentInformativenessRating2;
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
        const updatedStatus = statusSelect.value.trim() || 'no data';
        const updatedCase = caseSelect.value.trim() || 'no data';
        const updatedTurnMasked = turnMaskedSelect.value.trim() || 'no data';
        const updatedMaskedWord = maskedWordDisplay.value.trim() || 'no data';
        const updatedCoherence1 = document.querySelector('input[name="coherence1"]:checked')?.value || 'Enter coherence';
        const updatedCoherence2 = document.querySelector('input[name="coherence2"]:checked')?.value || 'Enter coherence';
        const updatedAgreement1 = document.querySelector('input[name="agreement1"]:checked')?.value || 'Enter agreement';
        const updatedAgreement2 = document.querySelector('input[name="agreement2"]:checked')?.value || 'Enter agreement';
        const updatedInformativeness1 = document.querySelector('input[name="informativeness1"]:checked')?.value || 'Enter informativeness';
        const updatedInformativeness2 = document.querySelector('input[name="informativeness2"]:checked')?.value || 'Enter informativeness';

        submitButton.disabled = true;

        // Construct the updates array for batch processing
        const updates = [
            { id: currentRow, column: 'speaker_a_task_1', text: updatedTextA },
            { id: currentRow, column: 'speaker_b_task_1', text: updatedTextB },
            { id: currentRow, column: 'speaker_a_task_2', text: updatedTextATask2 },
            { id: currentRow, column: 'speaker_b_task_2', text: updatedTextBTask2 },
            { id: currentRow, column: 'status', text: updatedStatus },
            { id: currentRow, column: 'case', text: updatedCase },
            { id: currentRow, column: 'turn_masked', text: updatedTurnMasked },
            { id: currentRow, column: 'masked_word', text: updatedMaskedWord },
            { id: currentRow, column: 'coherence_task_1', text: updatedCoherence1 },
            { id: currentRow, column: 'coherence_task_2', text: updatedCoherence2 },
            { id: currentRow, column: 'agreement_task_1', text: updatedAgreement1 },
            { id: currentRow, column: 'agreement_task_2', text: updatedAgreement2 },
            { id: currentRow, column: 'informativeness_task_1', text: updatedInformativeness1 },
            { id: currentRow, column: 'informativeness_task_2', text: updatedInformativeness2 },
            { id: currentRow, column: 'author', text: userName }
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
            statusData[currentRow] = updatedStatus;
            caseData[currentRow] = updatedCase;
            turnMaskedData[currentRow] = updatedTurnMasked;
            maskedWords[currentRow] = updatedMaskedWord;
            coherenceRatings1[currentRow] = updatedCoherence1;
            coherenceRatings2[currentRow] = updatedCoherence2;
            agreementRatings1[currentRow] = updatedAgreement1;
            agreementRatings2[currentRow] = updatedAgreement2;
            informativenessRatings1[currentRow] = updatedInformativeness1;
            informativenessRatings2[currentRow] = updatedInformativeness2;

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