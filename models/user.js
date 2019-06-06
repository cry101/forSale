var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');

var UserSchema = new Schema({
	// name: { type: String},
	nickName: { type: String},
	gender: { type: String },
	language: { type: String},
	city: { type: String },
	province: {type: String},
	country: { type: String },
	avatarUrl: { type: String },
	company_id: {type: String},
	company_name: {type: String},

	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },

	accessToken: {type: String},
});

UserSchema.plugin(BaseModel);

UserSchema.index({accessToken: 1});

UserSchema.pre('save', function(next){
	var now = new Date();
	this.update_at = now;
	next();
});

mongoose.model('User', UserSchema);
