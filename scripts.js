let dataA = [];
let dataB = [];
let dataATask2 = [];
let dataBTask2 = [];
let dataATask3 = [];
let dataBTask3 = [];
let currentRow = 0;
let columnIndexA = -1;
let columnIndexB = -1;
let columnIndexATask2 = -1;
let columnIndexBTask2 = -1;
let columnIndexATask3 = -1;
let columnIndexBTask3 = -1;

const textDisplayA = document.getElementById('text-display-a');
const textDisplayB = document.getElementById('text-display-b');
const textDisplayATask2 = document.getElementById('text-display-a-task-2');
const textDisplayBTask2 = document.getElementById('text-display-b-task-2');
const textDisplayATask3 = document.getElementById('text-display-a-task-3');
const textDisplayBTask3 = document.getElementById('text-display-b-task-3');
const statusSelect = document.getElementById('status-select');

async function loadCSV() {
    try {
        const response = await fetch('/.netlify/functions/get-csv');
        const csvData = await response.text();
        const rows = csvData.split('\n');
        const header = rows[0].split(',');

        // Find column indices
        columnIndexA = header.indexOf('speaker_a');
        columnIndexB = header.indexOf('speaker_b');
        columnIndexATask2 = header.indexOf('speaker_a_task_2');
        columnIndexBTask2 = header.indexOf('speaker_b_task_2');
        columnIndexATask3 = header.indexOf('speaker_a_task_3');
        columnIndexBTask3 = header.indexOf('speaker_b_task_3');

        if (columnIndexA === -1 || columnIndexB === -1) {
            console.error('Required columns for Task 1 not found');
            return;
        }

        // Parse data
        dataA = rows.slice(1).map(row => {
            const columns = row.split(',');
            return columns[columnIndexA] || '';
        });

        dataB = rows.slice(1).map(row => {
            const columns = row.split(',');
            return columns[columnIndexB] || '';
        });

        if (columnIndexATask2 !== -1 && columnIndexBTask2 !== -1) {
            dataATask2 = rows.slice(1).map(row => {
                const columns = row.split(',');
                return columns[columnIndexATask2] || '';
            });

            dataBTask2 = rows.slice(1).map(row => {
                const columns = row.split(',');
                return columns[columnIndexBTask2] || '';
            });
        }

        if (columnIndexATask3 !== -1 && columnIndexBTask3 !== -1) {
            dataATask3 = rows.slice(1).map(row => {
                const columns = row.split(',');
                return columns[columnIndexATask3] || '';
            });

            dataBTask3 = rows.slice(1).map(row => {
                const columns = row.split(',');
                return columns[columnIndexBTask3] || '';
            });
        }

        showRow(0); // Display the first row on load
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

function showRow(index) {
    currentRow = index;

    textDisplayA.value = dataA[index] || '';
    textDisplayB.value = dataB[index] || '';
    
    if (dataATask2.length > 0 && dataBTask2.length > 0) {
        textDisplayATask2.value = dataATask2[index] || '';
        textDisplayBTask2.value = dataBTask2[index] || '';
    }

    if (dataATask3.length > 0 && dataBTask3.length > 0) {
        textDisplayATask3.value = dataATask3[index] || '';
        textDisplayBTask3.value = dataBTask3[index] || '';
    }
}

document.getElementById('previous-button').addEventListener('click', () => {
    if (currentRow > 0) {
        showRow(currentRow - 1);
    }
});

document.getElementById('next-button').addEventListener('click', () => {
    if (currentRow < dataA.length - 1) {
        showRow(currentRow + 1);
    }
});

document.getElementById('go-button').addEventListener('click', () => {
    const rowInput = document.getElementById('row-input').value;
    const rowIndex = parseInt(rowInput, 10) - 1;
    if (!isNaN(rowIndex) && rowIndex >= 0 && rowIndex < dataA.length) {
        showRow(rowIndex);
    }
});

document.getElementById('submit-button').addEventListener('click', async () => {
    await submitChanges();
});

async function submitChanges() {
    const updatedTextA = textDisplayA.value;
    const updatedTextB = textDisplayB.value;
    const updatedTextATask2 = textDisplayATask2.value;
    const updatedTextBTask2 = textDisplayBTask2.value;
    const updatedTextATask3 = textDisplayATask3.value;
    const updatedTextBTask3 = textDisplayBTask3.value;

    try {
        const responseA = await fetch('/.netlify/functions/update-csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: currentRow,
                text: updatedTextA,
                column: 'speaker_a'
            })
        });

        const resultA = await responseA.json();
        if (!resultA.success) {
            alert('Error updating column "speaker_a": ' + resultA.message);
        }

        const responseB = await fetch('/.netlify/functions/update-csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: currentRow,
                text: updatedTextB,
                column: 'speaker_b'
            })
        });

        const resultB = await responseB.json();
        if (!resultB.success) {
            alert('Error updating column "speaker_b": ' + resultB.message);
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

        // Update local data arrays
        if (resultA.success) dataA[currentRow] = updatedTextA;
        if (resultB.success) dataB[currentRow] = updatedTextB;
        if (resultATask2.success) dataATask2[currentRow] = updatedTextATask2;
        if (resultBTask2.success) dataBTask2[currentRow] = updatedTextBTask2;
        if (resultATask3.success) dataATask3[currentRow] = updatedTextATask3;
        if (resultBTask3.success) dataBTask3[currentRow] = updatedTextBTask3;
    } catch (error) {
        console.error('Error submitting changes:', error);
        alert('An error occurred while submitting changes.');
    }
}

loadCSV();