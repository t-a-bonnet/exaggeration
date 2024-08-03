const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const index = body.index;
        const newText = body.text;
        
        // Path to your CSV file
        const filePath = path.resolve(__dirname, '../data/sampled_climate_data.csv');

        // Read and parse CSV file, update row, and save
        let csvData = fs.readFileSync(filePath, 'utf8');
        let rows = csvData.split('\n');
        let header = rows[0];
        let data = rows.slice(1);
        data[index] = data[index].split(',').map((cell, i) => i === 1 ? newText : cell).join(',');
        let updatedCSV = [header].concat(data).join('\n');

        fs.writeFileSync(filePath, updatedCSV, 'utf8');

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Success' })
        };
    }
    
    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' })
    };
};