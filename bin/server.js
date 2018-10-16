'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('../middleware/passport');
const mongoose = require('../middleware/mongoose');
const RoomManager = require('../models/RoomManager');

const server = (port) => {
  
  // Setup
  if (process.env.NODE_ENV !== 'test') {
    const logger = require('morgan');
    app.use(logger('dev'));
  }
  app.use(express.static('public'));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({ secret: 'meow' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.set('view engine', 'pug');

  const rm = new RoomManager();

  // Routes
  const index = require('../routes/index');
  const api = require('../routes/api')(rm);
  const timer = require('../routes/timer')(rm);
  const admin = require('../routes/admin')(passport);
  app.use('/', index);
  app.use('/api', api);
  app.use('/timer', timer);
  app.use('/admin', admin);

  // Socket
  const socket = require('../middleware/socket')(http, rm);

  http.listen(port, () => console.log(`🕒  Sync Timer listening on port ${port}`));
  return http;
};

module.exports = server;