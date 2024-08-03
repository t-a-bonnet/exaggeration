let currentIndex = 0;

async function fetchData(index) {
    try {
        const response = await fetch(`/api/data?index=${index}`);
        const data = await response.json();
        document.getElementById('data-content').textContent = data.body_parent || 'No data';
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