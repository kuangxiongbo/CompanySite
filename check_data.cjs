const http = require('http');
const https = require('https');

https.get('https://cs.new.myibc.net/Product', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // See if data has JSON or structured info
    const match = data.match(/<script.*?>(.*?)<\/script>/gs);
    if (match) {
        console.log("Found scripts, looking for data...");
        // Look for JSON data injected in HTML
    }
  });
});
