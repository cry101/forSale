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

mongoose.plugin(require("./base_model"))

// models
require('./user');
require('./company')
require('./tags');
require('./customer');
require('./record')
require('./inventory')
require('./product');


exports.User = mongoose.model('User');
exports.Tags = mongoose.model('Tags');
exports.Company = mongoose.model('Company');
exports.Customer = mongoose.model('Customer');
exports.Record = mongoose.model('Record');
exports.Inventory = mongoose.model('Inventory');
exports.Product = mongoose.model('Product');
