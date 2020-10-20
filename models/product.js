var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');

var ProductsSchema = new Schema({
	name: { type: String},
	tag: {type: Number},
	company_id: {type: String},
	price: {type: String},
	pic: {type: String},
	bar_code: {type: String}
});

mongoose.model('Product', ProductsSchema);
