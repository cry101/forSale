var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');

var CompanySchema = new Schema({
	name: { type: String},

	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },
});

CompanySchema.plugin(BaseModel);


CompanySchema.pre('save', function(next){
	var now = new Date();
	this.update_at = now;
	next();
});

mongoose.model('Company', CompanySchema);
