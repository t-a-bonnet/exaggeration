document.addEventListener('DOMContentLoaded', () => {
    const textEdit = document.getElementById('text-edit');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const submitButton = document.getElementById('submit-button');

    let currentRow = 0;
    let data = [];
    let columnIndex = -1;

    function loadCSV() {
        fetch('sampled_climate_data.csv')
            .then(response => response.text())
            .then(text => {
                const rows = text.trim().split('\n');
                if (rows.length < 2) {
                    console.error('Not enough rows in CSV file.');
                    return;
                }

                const header = rows[0].split(',');
                columnIndex = header.indexOf('body_parent');

                if (columnIndex === -1) {
                    console.error('Column "body_parent" not found');
                    return;
                }

                data = rows.slice(1)
                    .map(row => row.split(',')[columnIndex] || '')
                    .filter(text => text.trim() !== '');

                showRow(currentRow);
            })
            .catch(error => console.error('Error loading CSV:', error));
    }

    function showRow(index) {
        if (data.length === 0) return;
        textEdit.value = data[index];
    }

    function showNextRow() {
        if (data.length === 0) return;
        currentRow = (currentRow + 1) % data.length;
        showRow(currentRow);
    }

    function showPrevRow() {
        if (data.length === 0) return;
        currentRow = (currentRow - 1 + data.length) % data.length;
        showRow(currentRow);
    }

    function submitChanges() {
        if (data.length === 0) return;
        data[currentRow] = textEdit.value;

        // Send updated data to the server
        fetch('/update-csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                row: currentRow,
                text: textEdit.value,
            }),
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
        })
        .catch(error => console.error('Error:', error));
    }

    nextButton.addEventListener('click', showNextRow);
    prevButton.addEventListener('click', showPrevRow);
    submitButton.addEventListener('click', submitChanges);

    loadCSV();
});