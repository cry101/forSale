var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');

var ProductsSchema = new Schema({
	name: { type: String},
	tag: {type: Number},
	company_id: {type: String},
	price: {type: String},
	pic: {type: String},

	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },
});

ProductsSchema.plugin(BaseModel);


ProductsSchema.pre('save', function(next){
	var now = new Date();
	this.update_at = now;
	next();
});

mongoose.model('Product', ProductsSchema);
