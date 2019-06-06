var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
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

	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },
});

InventorySchema.plugin(BaseModel);


InventorySchema.pre('save', function(next){
	var now = new Date();
	this.update_at = now;
	next();
});

mongoose.model('Inventory', InventorySchema);
