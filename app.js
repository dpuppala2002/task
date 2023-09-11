const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/time-series');

const timeSeriesSchema = new mongoose.Schema({
  timestamp: Date,
  variable1: Number,
  variable2: Number,
  variable3: Number,
  variable4: Number,
  variable5: Number,
  variable6: Number,
  variable7: Number,
  variable8: Number,
  variable9: Number,
  variable10: Number,
});

const TimeSeries = mongoose.model('TimeSeries', timeSeriesSchema);

app.post('/time-series', async (req, res) => {
  const data = req.body;

  // Validate the incoming data.
  const validationErrors = validateTimeSeriesData(data);
  if (validationErrors.length > 0) {
    return res.status(400).send({ errors: validationErrors });
  }

  // Store the time series data in the database.
  const timeSeries = new TimeSeries(data);
  await timeSeries.save();

  res.send({ success: true });
});

function validateTimeSeriesData(data) {
  const errors = [];

  // Validate the timestamp.
  if (!data.timestamp || !isNaN(data.timestamp)) {
    errors.push('Timestamp is required and must be a valid date.');
  }

  // Validate the variables.
  for (let i = 1; i <= 10; i++) {
    const variable = 'variable' + i;
    if (!data[variable] || isNaN(data[variable])) {
      errors.push(`Variable ${i} is required and must be a valid number.`);
    }
  }

  return errors;
}

app.listen(3000, () => {
  console.log('Server listening on port 3000!');
});
