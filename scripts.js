document.addEventListener('DOMContentLoaded', () => {
    const textEdit = document.getElementById('text-edit');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const submitButton = document.getElementById('submit-button');

    let currentRow = 1; // Starting row index (1-based index)
    const totalRows = 100; // Adjust this based on your data

    function loadRow(rowIndex) {
        axios.get(`/get-row/${rowIndex}`)
            .then(response => {
                textEdit.value = response.data.text || '';
            })
            .catch(error => {
                console.error('Error fetching row:', error);
                textEdit.value = 'Error loading row';
            });
    }

    function showNextRow() {
        if (currentRow < totalRows) {
            currentRow++;
            loadRow(currentRow);
        }
    }

    function showPrevRow() {
        if (currentRow > 1) {
            currentRow--;
            loadRow(currentRow);
        }
    }

    function submitChanges() {
        axios.post('/update-csv', {
            row: currentRow,
            text: textEdit.value
        })
        .then(response => {
            console.log('Success:', response.data);
            alert('Changes saved successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error saving changes.');
        });
    }

    nextButton.addEventListener('click', showNextRow);
    prevButton.addEventListener('click', showPrevRow);
    submitButton.addEventListener('click', submitChanges);

    loadRow(currentRow); // Load initial row
});