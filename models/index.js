var mongoose = require('mongoose');
var config   = require('../config');
// var logger = require('../common/logger')

mongoose.connect(config.db, {
  poolSize: 20,
  useCreateIndex: true,
  useNewUrlParser: true
}, function (err) {
  if (err) {
  	console.error(err)
    // logger.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./user');
require('./company')
require('./tag');
require('./customer');
require('./record')
require('./inventory')
require('./product');


exports.User = mongoose.model('User');
exports.Tag = mongoose.model('Tag');
exports.Company = mongoose.model('Company');
exports.Customer = mongoose.model('Customer');
exports.Record = mongoose.model('Record');
exports.Inventory = mongoose.model('Inventory');
exports.Product = mongoose.model('Product');
