document.addEventListener('DOMContentLoaded', () => {
    const textEdit = document.getElementById('text-edit');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const submitButton = document.getElementById('submit-button');

    let currentRow = 0;
    let data = [];
    let columnIndex = -1;

    function loadCSV() {
        // Fetch the CSV file content from the backend if needed
        // In this case, we'll assume it's already loaded and handled in the backend directly
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

        axios.post('/update-csv', {
            row: currentRow + 1, // Adjust if your backend expects 1-based index
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

    loadCSV(); // Adjust if you need to load the CSV or handle it differently
});