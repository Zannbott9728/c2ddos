const axios = require('axios');

// Check if the command-line arguments are provided correctly
if (process.argv.length !== 4) {
  console.log('Usage: node Rand.js <URL> <intervalInSeconds>');
  process.exit(1);
}

const targetUrl = process.argv[2];
const intervalInSeconds = parseInt(process.argv[3]);

if (isNaN(intervalInSeconds) || intervalInSeconds <= 0) {
  console.error('Invalid interval. Please provide a positive number of seconds.');
  process.exit(1);
}

console.log(`Sending GET requests to ${targetUrl} every ${intervalInSeconds} seconds.`);

// Function to send a GET request
async function sendGetRequest() {
  try {
    await axios.get(targetUrl);
    console.log('GET request sent.');
  } catch (err) {
    console.error('Failed to send GET request:', err.message);
  }
}

// Send GET requests at the specified interval
setInterval(sendGetRequest, intervalInSeconds * 99999999999999);
