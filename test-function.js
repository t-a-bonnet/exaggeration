import fetch from 'node-fetch';

const url = 'http://localhost:8888/.netlify/functions/update-csv';
const data = {
    id: '1',
    text: 'Updated text'
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));