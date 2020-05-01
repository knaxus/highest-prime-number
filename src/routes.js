const url = require('url');
const PrimeNumber = require('./classes/Prime');

let query = null; // to be used to store url query params
let result = null; // store the resul

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode);
  res.write(JSON.stringify(data));
  res.end();
}

module.exports = {
  handleRequests(req, res) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    const path = url.parse(req.url).pathname;

    switch (path) {
      case '/':
        const msg = {
          msg: 'Welcome to Node.js Cluster',
          ver: '1.0',
        };
        sendResponse(res, 200, msg)
        break;

      case '/prime':
        // get the query params
        query = url.parse(req.url, true).query;
        result = PrimeNumber.calculateGreatestPrimeInRange(query.num)
        // send response
        sendResponse(res, 200, { result });
        break;

      case '/prime-enhanced':
        // get the query params
        query = url.parse(req.url, true).query;
        result = PrimeNumber.calculateGreatestPrimeInRangeEnhanced(query.num)

        // send response
        sendResponse(res, 200, { result });
        break;

      default:
        res.writeHead(404);
        res.write('Route not found');
        res.end();
    }
  }
}