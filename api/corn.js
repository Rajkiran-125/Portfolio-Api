
const cron = require('node-cron');
const axios = require('axios');
const express = require('express');
const router = express.Router();

cron.schedule('*/10 * * * *', async () => {
  try {
    const response = await axios.get('https://portfolio-api-m6u1.onrender.com');
    console.log(`Health check response: ${response.status}`);
  } catch (error) {
    console.error(`Health check error: ${error.message}`);
  }
});

module.exports = router;
