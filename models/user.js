var mongoose  = require('mongoose');
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

	accessToken: {type: String},
});

UserSchema.index({accessToken: 1});

mongoose.model('User', UserSchema);
