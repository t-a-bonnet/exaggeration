let currentIndex = 0;

async function fetchData(index) {
    try {
        const response = await fetch(`/api/main?index=${index}`);  // Ensure the correct path
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.body_parent) {
            document.getElementById('data-content').textContent = data.body_parent;
        } else {
            document.getElementById('data-content').textContent = 'No more data';
            document.getElementById('next-button').disabled = true; // Disable button when no more data
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('data-content').textContent = 'Error loading data';
    }
}

document.getElementById('next-button').addEventListener('click', () => {
    currentIndex++;
    fetchData(currentIndex);
});

// Initial fetch
fetchData(currentIndex);