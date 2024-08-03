const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvFilePath = path.join(__dirname, '../..', 'sampled_climate_data.csv');
const rows = [];

// Read CSV file and parse data
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => rows.push(row))
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

exports.handler = async function(event) {
  const index = parseInt(event.queryStringParameters.index, 10) || 0;
  
  if (index >= 0 && index < rows.length) {
    return {
      statusCode: 200,
      body: JSON.stringify(rows[index])
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Data not found' })
    };
  }
};