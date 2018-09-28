const express = require('express');
const app = express();
const http = require('http').Server(app);

const server = (port) => {
  // Setup
  if (process.env.NODE_ENV !== 'test') {
    const logger = require('morgan');
    app.use(logger('dev'));
  }
  
  app.use(express.static('public'));
  app.use(express.static('views'));

  // Routes
  const index = require('../routes');
  app.use('/', index);

  // Socket
  require('../middleware/socket')(http);

  http.listen(port, () => console.log(`🕒  Sync Timer listening on port ${port}`));
  return http;
};

module.exports = server;