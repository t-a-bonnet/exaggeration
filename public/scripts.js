document.addEventListener('DOMContentLoaded', () => {
    const textEdit = document.getElementById('text-edit');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const submitButton = document.getElementById('submit-button');

    let currentRow = 0; // Start from the first row (0-based index)

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
        currentRow++;
        loadRow(currentRow);
    }

    function showPrevRow() {
        if (currentRow > 0) {
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