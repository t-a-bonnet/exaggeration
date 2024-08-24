document.addEventListener('DOMContentLoaded', () => {
    // Function to calculate distribution
    function calculateDistribution(data, key) {
        const distribution = {};
        // Start from the second element (index 1) to skip the header row
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
    let agreeDisagreeColumnIndex;
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
    let coherenceColumnIndex3;
    let agreementColumnIndex1;
    let agreementColumnIndex2;
    let agreementColumnIndex3;
    let informativenessColumnIndex1;
    let informativenessColumnIndex2;
    let informativenessColumnIndex3;

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
            coherenceColumnIndex3 = header.indexOf('coherence_task_3');
            agreementColumnIndex1 = header.indexOf('agreement_task_1');
            agreementColumnIndex2 = header.indexOf('agreement_task_2');
            agreementColumnIndex3 = header.indexOf('agreement_task_3');
            informativenessColumnIndex1 = header.indexOf('informativeness_task_1');
            informativenessColumnIndex2 = header.indexOf('informativeness_task_2');
            informativenessColumnIndex3 = header.indexOf('informativeness_task_3');

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

            dataA = rows.slice(1).map(row => row[columnIndexA] || 'No Data');
            dataB = rows.slice(1).map(row => row[columnIndexB] || 'No Data');
            dataATask2 = rows.slice(1).map(row => row[columnIndexATask2] || 'No Data');
            dataBTask2 = rows.slice(1).map(row => row[columnIndexBTask2] || 'No Data');
            dataATask3 = rows.slice(1).map(row => row[columnIndexATask3] || 'No Data');
            dataBTask3 = rows.slice(1).map(row => row[columnIndexBTask3] || 'No Data');
            statusData = rows.slice(1).map(row => row[statusColumnIndex] || 'Select status');
            caseData = rows.slice(1).map(row => row[caseColumnIndex] || 'Select case');
            turnMaskedData = rows.slice(1).map(row => row[turnMaskedColumnIndex] || 'Select turn');
            robertaPreds = rows.slice(1).map(row => row[robertaPredsColumnIndex] || 'No Data');
            llamaPreds = rows.slice(1).map(row => row[llamaPredsColumnIndex] || 'No Data');
            gemmaPreds = rows.slice(1).map(row => row[gemmaPredsColumnIndex] || 'No Data');
            maskedWords = rows.slice(1).map(row => row[maskedWordColumnIndex] || 'No Data');
            originalDataA = rows.slice(1).map(row => row[originalAColumnIndex] || 'No Data');
            originalDataB = rows.slice(1).map(row => row[originalBColumnIndex] || 'No Data');
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
            displayDistribution('turn-masked-distribution-chart', calculateDistribution(rows, turnMaskedColumnIndex));
            displayDistribution('agree-disagree-distribution-chart', calculateDistribution(rows, agreeDisagreeColumnIndex));
        
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
    };

    // Function to display a specific row
    function showRow(index) {
        // Check if the data arrays are not empty
        if (dataA.length === 0 || dataB.length === 0 || dataATask2.length === 0 || dataBTask2.length === 0 || dataATask3.length === 0 || dataBTask3.length === 0 || statusData.length === 0 || caseData.length === 0 || turnMaskedData.length === 0) return;

        // Display text inputs, defaulting to 'No Data' if empty
        textDisplayA.value = dataA[index] || 'No Data';
        textDisplayB.value = dataB[index] || 'No Data';
        textDisplayATask2.value = dataATask2[index] || 'No Data';
        textDisplayBTask2.value = dataBTask2[index] || 'No Data';
        textDisplayATask3.value = dataATask3[index] || 'No Data';
        textDisplayBTask3.value = dataBTask3[index] || 'No Data';

        // Display selects, defaulting to 'Select status', 'Select case', or 'Select turn' if empty
        statusSelect.value = statusData[index] || 'Select status';
        caseSelect.value = caseData[index] || 'Select case';
        turnMaskedSelect.value = turnMaskedData[index] || 'Select turn';

        // Display other text areas, defaulting to 'No Data' if empty
        robertaPredsDisplay.textContent = robertaPreds[index] || 'No Data';
        llamaPredsDisplay.textContent = llamaPreds[index] || 'No Data';
        gemmaPredsDisplay.textContent = gemmaPreds[index] || 'No Data';
        maskedWordDisplay.value = maskedWords[index] || 'No Data';
        originalADisplay.textContent = originalDataA[index] || 'No Data';
        originalBDisplay.textContent = originalDataB[index] || 'No Data';

        // Handle coherence ratings
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

        // Handle agreement ratings
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

        // Handle informativeness ratings
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
        // Retrieve and sanitize input values
        const updatedTextA = textDisplayA.value.trim() || 'No Data';
        const updatedTextB = textDisplayB.value.trim() || 'No Data';
        const updatedTextATask2 = textDisplayATask2.value.trim() || 'No Data';
        const updatedTextBTask2 = textDisplayBTask2.value.trim() || 'No Data';
        const updatedTextATask3 = textDisplayATask3.value.trim() || 'No Data';
        const updatedTextBTask3 = textDisplayBTask3.value.trim() || 'No Data';
        const updatedStatus = statusSelect.value.trim() || 'Select status';
        const updatedCase = caseSelect.value.trim() || 'Select case';
        const updatedTurnMasked = turnMaskedSelect.value.trim() || 'Select turn';
        const updatedMaskedWord = maskedWordDisplay.value.trim() || 'No Data';

        // Get selected values for ratings, defaulting to empty string if not selected
        const updatedCoherence1 = document.querySelector('input[name="coherence1"]:checked')?.value || 'Enter coherence';
        const updatedCoherence2 = document.querySelector('input[name="coherence2"]:checked')?.value || 'Enter coherence';
        const updatedCoherence3 = document.querySelector('input[name="coherence3"]:checked')?.value || 'Enter coherence';
        const updatedAgreement1 = document.querySelector('input[name="agreement1"]:checked')?.value || 'Enter agreement';
        const updatedAgreement2 = document.querySelector('input[name="agreement2"]:checked')?.value || 'Enter agreement';
        const updatedAgreement3 = document.querySelector('input[name="agreement3"]:checked')?.value || 'Enter agreement';
        const updatedInformativeness1 = document.querySelector('input[name="informativeness1"]:checked')?.value || 'Enter informativeness';
        const updatedInformativeness2 = document.querySelector('input[name="informativeness2"]:checked')?.value || 'Enter informativeness';
        const updatedInformativeness3 = document.querySelector('input[name="informativeness3"]:checked')?.value || 'Enter informativeness';

        submitButton.disabled = true;

        // Helper function to update a column
        async function updateColumn(columnName, updatedValue) {
            try {
                const response = await fetch('/.netlify/functions/update-csv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: currentRow,
                        text: updatedValue,
                        column: columnName
                    })
                });

                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.message);
                }
                return result;
            } catch (error) {
                alert(`Error updating column "${columnName}": ${error.message}`);
                throw error; // Rethrow to handle in the outer try/catch
            }
        }

        // Array of columns and their values to be updated
        const updates = [
            { columnName: 'speaker_a_task_1', value: updatedTextA },
            { columnName: 'speaker_b_task_1', value: updatedTextB },
            { columnName: 'speaker_a_task_2', value: updatedTextATask2 },
            { columnName: 'speaker_b_task_2', value: updatedTextBTask2 },
            { columnName: 'speaker_a_task_3', value: updatedTextATask3 },
            { columnName: 'speaker_b_task_3', value: updatedTextBTask3 },
            { columnName: 'status', value: updatedStatus },
            { columnName: 'case', value: updatedCase },
            { columnName: 'turn_masked', value: updatedTurnMasked },
            { columnName: 'masked_word', value: updatedMaskedWord },
            { columnName: 'coherence_task_1', value: updatedCoherence1 },
            { columnName: 'coherence_task_2', value: updatedCoherence2 },
            { columnName: 'coherence_task_3', value: updatedCoherence3 },
            { columnName: 'agreement_task_1', value: updatedAgreement1 },
            { columnName: 'agreement_task_2', value: updatedAgreement2 },
            { columnName: 'agreement_task_3', value: updatedAgreement3 },
            { columnName: 'informativeness_task_1', value: updatedInformativeness1 },
            { columnName: 'informativeness_task_2', value: updatedInformativeness2 },
            { columnName: 'informativeness_task_3', value: updatedInformativeness3 }
        ];

        // Update columns sequentially
        try {
            for (const { columnName, value } of updates) {
                await updateColumn(columnName, value);
            }

            // Update local data arrays after successful submission
            dataA[currentRow] = updatedTextA;
            dataB[currentRow] = updatedTextB;
            dataATask2[currentRow] = updatedTextATask2;
            dataBTask2[currentRow] = updatedTextBTask2;
            dataATask3[currentRow] = updatedTextATask3;
            dataBTask3[currentRow] = updatedTextBTask3;
            statusData[currentRow] = updatedStatus;
            caseData[currentRow] = updatedCase;
            turnMaskedData[currentRow] = updatedTurnMasked;
            maskedWords[currentRow] = updatedMaskedWord;
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
        loadCSV();
    });