let currentIndex = 0;

document.getElementById('next-button').addEventListener('click', async () => {
    try {
        const response = await fetch(`/data?index=${currentIndex}`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('content').textContent = data.body_parent || 'No data available';
            currentIndex++;
        } else {
            document.getElementById('content').textContent = 'No more data';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});