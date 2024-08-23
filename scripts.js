document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
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
    const readabilityRadioButtons1 = document.querySelectorAll('input[name="readability1"]');
    const readabilityRadioButtons2 = document.querySelectorAll('input[name="readability2"]');
    const readabilityRadioButtons3 = document.querySelectorAll('input[name="readability3"]');
    const informativenessRadioButtons1 = document.querySelectorAll('input[name="informativeness1"]');
    const informativenessRadioButtons2 = document.querySelectorAll('input[name="informativeness2"]');
    const informativenessRadioButtons3 = document.querySelectorAll('input[name="informativeness3"]');

    // Data Arrays
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
    let readabilityRatings1 = [];
    let readabilityRatings2 = [];
    let readabilityRatings3 = [];
    let informativenessRatings1 = [];
    let informativenessRatings2 = [];
    let informativenessRatings3 = [];

    // Column Indices
    let columnIndexA, columnIndexB, columnIndexATask2, columnIndexBTask2;
    let columnIndexATask3, columnIndexBTask3, statusColumnIndex, caseColumnIndex;
    let turnMaskedColumnIndex, robertaPredsColumnIndex, llamaPredsColumnIndex;
    let gemmaPredsColumnIndex, maskedWordColumnIndex, originalAColumnIndex;
    let originalBColumnIndex, coherenceColumnIndex1, coherenceColumnIndex2;
    let coherenceColumnIndex3, agreementColumnIndex1, agreementColumnIndex2;
    let agreementColumnIndex3, readabilityColumnIndex1, readabilityColumnIndex2;
    let readabilityColumnIndex3, informativenessColumnIndex1, informativenessColumnIndex2, informativenessColumnIndex3;

    // Parse CSV
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

    // Load CSV Data
    async function loadCSV() {
        try {
            const response = await fetch('Appen data 16.8.2024.csv');
            const text = await response.text();
            const rows = parseCSV(text);

            if (rows.length < 2) {
                console.error('Not enough rows in CSV file.');
                displayNoData();
                return;
            }

            const header = rows[0];
            setColumnIndices(header);

            if (checkMissingColumns()) {
                console.error('Required columns not found');
                displayNoData('Required columns not found.');
                return;
            }

            parseData(rows);
            showRow(currentRow);

        } catch (error) {
            console.error('Error loading CSV:', error);
            displayNoData('Error loading CSV data.');
        }
    }

    // Set Column Indices
    function setColumnIndices(header) {
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
        originalAColumnIndex = header.indexOf('speaker_a_original');
        originalBColumnIndex = header.indexOf('speaker_b_original');
        coherenceColumnIndex1 = header.indexOf('coherence_task_1');
        coherenceColumnIndex2 = header.indexOf('coherence_task_2');
        coherenceColumnIndex3 = header.indexOf('coherence_task_3');
        agreementColumnIndex1 = header.indexOf('agreement_task_1');
        agreementColumnIndex2 = header.indexOf('agreement_task_2');
        agreementColumnIndex3 = header.indexOf('agreement_task_3');
        readabilityColumnIndex1 = header.indexOf('readability_task_1');
        readabilityColumnIndex2 = header.indexOf('readability_task_2');
        readabilityColumnIndex3 = header.indexOf('readability_task_3');
        informativenessColumnIndex1 = header.indexOf('informativeness_task_1');
        informativenessColumnIndex2 = header.indexOf('informativeness_task_2');
        informativenessColumnIndex3 = header.indexOf('informativeness_task_3');
    }

    // Check for Missing Columns
    function checkMissingColumns() {
        return [columnIndexA, columnIndexB, columnIndexATask2, columnIndexBTask2,
                columnIndexATask3, columnIndexBTask3, statusColumnIndex, caseColumnIndex,
                turnMaskedColumnIndex, robertaPredsColumnIndex, llamaPredsColumnIndex,
                gemmaPredsColumnIndex, maskedWordColumnIndex, originalAColumnIndex,
                originalBColumnIndex, coherenceColumnIndex1, coherenceColumnIndex2,
                coherenceColumnIndex3, agreementColumnIndex1, agreementColumnIndex2,
                agreementColumnIndex3, readabilityColumnIndex1, readabilityColumnIndex2,
                readabilityColumnIndex3, informativenessColumnIndex1, informativenessColumnIndex2,
                informativenessColumnIndex3].some(index => index === -1);
    }

    // Parse Data
    function parseData(rows) {
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
        readabilityRatings1 = rows.slice(1).map(row => row[readabilityColumnIndex1] || '');
        readabilityRatings2 = rows.slice(1).map(row => row[readabilityColumnIndex2] || '');
        readabilityRatings3 = rows.slice(1).map(row => row[readabilityColumnIndex3] || '');
        informativenessRatings1 = rows.slice(1).map(row => row[informativenessColumnIndex1] || '');
        informativenessRatings2 = rows.slice(1).map(row => row[informativenessColumnIndex2] || '');
        informativenessRatings3 = rows.slice(1).map(row => row[informativenessColumnIndex3] || '');

        showRow(currentRow);
    }

    // Function to display a specific row
    function showRow(index) {
        // Check if the data arrays are not empty
        if (dataA.length === 0 || dataB.length === 0 || dataATask2.length === 0 || dataBTask2.length === 0 || dataATask3.length === 0 || dataBTask3.length === 0 || statusData.length === 0 || caseData.length === 0 || turnMaskedData.length === 0) {
            displayNoData();
            return;
        }

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

        // Handle readability ratings
        const currentReadabilityRating1 = readabilityRatings1[index] || '';
        readabilityRadioButtons1.forEach(button => {
            button.checked = button.value === currentReadabilityRating1;
        });

        const currentReadabilityRating2 = readabilityRatings2[index] || '';
        readabilityRadioButtons2.forEach(button => {
            button.checked = button.value === currentReadabilityRating2;
        });

        const currentReadabilityRating3 = readabilityRatings3[index] || '';
        readabilityRadioButtons3.forEach(button => {
            button.checked = button.value === currentReadabilityRating3;
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
        const updatedRobertaPreds = robertaPredsDisplay.textContent.trim() || 'No Data';
        const updatedLlamaPreds = llamaPredsDisplay.textContent.trim() || 'No Data';
        const updatedGemmaPreds = gemmaPredsDisplay.textContent.trim() || 'No Data';
        const updatedOriginalA = originalADisplay.textContent.trim() || 'No Data';
        const updatedOriginalB = originalBDisplay.textContent.trim() || 'No Data';

        // Gather ratings
        const updatedCoherenceRating1 = Array.from(coherenceRadioButtons1).find(button => button.checked)?.value || '';
        const updatedCoherenceRating2 = Array.from(coherenceRadioButtons2).find(button => button.checked)?.value || '';
        const updatedCoherenceRating3 = Array.from(coherenceRadioButtons3).find(button => button.checked)?.value || '';
        const updatedAgreementRating1 = Array.from(agreementRadioButtons1).find(button => button.checked)?.value || '';
        const updatedAgreementRating2 = Array.from(agreementRadioButtons2).find(button => button.checked)?.value || '';
        const updatedAgreementRating3 = Array.from(agreementRadioButtons3).find(button => button.checked)?.value || '';
        const updatedReadabilityRating1 = Array.from(readabilityRadioButtons1).find(button => button.checked)?.value || '';
        const updatedReadabilityRating2 = Array.from(readabilityRadioButtons2).find(button => button.checked)?.value || '';
        const updatedReadabilityRating3 = Array.from(readabilityRadioButtons3).find(button => button.checked)?.value || '';
        const updatedInformativenessRating1 = Array.from(informativenessRadioButtons1).find(button => button.checked)?.value || '';
        const updatedInformativenessRating2 = Array.from(informativenessRadioButtons2).find(button => button.checked)?.value || '';
        const updatedInformativenessRating3 = Array.from(informativenessRadioButtons3).find(button => button.checked)?.value || '';

        // Prepare data to be sent to the server
        const updatedRowData = {
            textA: updatedTextA,
            textB: updatedTextB,
            textATask2: updatedTextATask2,
            textBTask2: updatedTextBTask2,
            textATask3: updatedTextATask3,
            textBTask3: updatedTextBTask3,
            status: updatedStatus,
            case: updatedCase,
            turnMasked: updatedTurnMasked,
            maskedWord: updatedMaskedWord,
            robertaPreds: updatedRobertaPreds,
            llamaPreds: updatedLlamaPreds,
            gemmaPreds: updatedGemmaPreds,
            originalA: updatedOriginalA,
            originalB: updatedOriginalB,
            coherenceRatings: {
                rating1: updatedCoherenceRating1,
                rating2: updatedCoherenceRating2,
                rating3: updatedCoherenceRating3
            },
            agreementRatings: {
                rating1: updatedAgreementRating1,
                rating2: updatedAgreementRating2,
                rating3: updatedAgreementRating3
            },
            readabilityRatings: {
                rating1: updatedReadabilityRating1,
                rating2: updatedReadabilityRating2,
                rating3: updatedReadabilityRating3
            },
            informativenessRatings: {
                rating1: updatedInformativenessRating1,
                rating2: updatedInformativenessRating2,
                rating3: updatedInformativenessRating3
            }
        };

        try {
            // Send data to the server (example endpoint and method)
            const response = await fetch('/update-row', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rowIndex: currentRow, ...updatedRowData })
            });

            if (!response.ok) {
                throw new Error('Failed to update row');
            }

            // Success message or confirmation
            alert('Changes saved successfully!');
        } catch (error) {
            console.error('Error updating row:', error);
            alert('An error occurred while saving changes.');
        }
    }

    // Add event listeners
    previousButton.addEventListener('click', showPreviousRow);
    nextButton.addEventListener('click', showNextRow);
    goToButton.addEventListener('click', goToRow);
    submitButton.addEventListener('click', submitChanges);

    // Initialize the interface
    function initialize() {
        // Check for stored data or defaults
        showRow(currentRow);
    }

    initialize();
});
   