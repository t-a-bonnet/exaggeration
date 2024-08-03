const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const csvFilePath = path.join(__dirname, 'sampled_climate_data.csv');
const rows = [];

// Read CSV file and parse data
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => rows.push(row))
  .on('end', () => {
    console.log('CSV file successfully processed');
  })
  .on('error', (err) => {
    console.error('Error reading CSV file:', err);
  });

// Serve static files (e.g., HTML, CSS)
app.use(express.static('public'));

// Serve the current row of data
app.get('/data', (req, res) => {
  const index = parseInt(req.query.index, 10);
  if (index >= 0 && index < rows.length) {
    res.json(rows[index]);
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});