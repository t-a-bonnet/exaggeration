import * as d3 from 'd3';

// Fetch the CSV file and parse it
const loadData = async () => {
    const response = await fetch('sampled_climate_data.csv');
    const data = await response.text();
    const parsedData = d3.csvParse(data);
    return parsedData;
};

const updateText = (data, index) => {
    const textElement = document.getElementById('text');
    textElement.textContent = data[index].body_parent || 'No data available';
};

const init = async () => {
    const data = await loadData();
    let index = 0;

    updateText(data, index);

    document.getElementById('prev').addEventListener('click', () => {
        if (index > 0) {
            index -= 1;
            updateText(data, index);
        }
    });

    document.getElementById('next').addEventListener('click', () => {
        if (index < data.length - 1) {
            index += 1;
            updateText(data, index);
        }
    });
};

init();