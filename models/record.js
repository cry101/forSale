var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');

var RecordSchema = new Schema({
	pro_name: { type: String},
	pro_price: { type: String},
	tag: {type: String},
	pic: {type: String},

	number: {type: Number},
	type: { type: Boolean}, // true进 false销
	token: {type: String},
	remark: {type: String},

	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },
});

RecordSchema.plugin(BaseModel);


RecordSchema.pre('save', function(next){
	var now = new Date();
	this.update_at = now;
	next();
});

mongoose.model('Record', RecordSchema);
