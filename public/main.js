let currentIndex = 0;
let data = [];

document.addEventListener('DOMContentLoaded', () => {
    const textBody = document.getElementById('text-body');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    // Fetch initial data
    axios.get('/.netlify/functions/get-data')
        .then(response => {
            data = response.data;
            console.log('Fetched Data:', data); // Log fetched data to verify it
            if (data.length > 0) {
                textBody.value = data[currentIndex].body_parent;
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    // Previous button event listener
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            textBody.value = data[currentIndex].body_parent;
        }
    });

    // Next button event listener
    nextBtn.addEventListener('click', () => {
        if (currentIndex < data.length - 1) {
            currentIndex++;
            textBody.value = data[currentIndex].body_parent;
        }
    });

    // Submit button event listener
    submitBtn.addEventListener('click', () => {
        data[currentIndex].body_parent = textBody.value;
        axios.post('/.netlify/functions/save-data', { data })
            .then(response => alert('Data saved successfully!'))
            .catch(error => console.error('Error saving data:', error));
    });
});