var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');

var InventorySchema = new Schema({
	pro_name: { type: String},
	pro_price: { type: String},
	tag: {type: String},
	pic: {type: String},

	number: {type: Number},
	token: {type: String},
	remark: {type: String},
});

mongoose.model('Inventory', InventorySchema);
