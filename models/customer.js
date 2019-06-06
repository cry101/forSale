var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');

var CustomerSchema = new Schema({
	name: { type: String},
	nick_name: { type: String},
	sex: { type: String},
	birthday: { type: String},
	is_remind: { type: Boolean}, //是否提醒
	address: {type: String},
	products: {type: Array}, //常用产品
	describe: {type: String},
	remark: {type: String},
	record: {type: String}, //服务跟进记录
	prepay: {type: Number}, //预付款

	token: {type: String},

	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },
});

CustomerSchema.plugin(BaseModel);


CustomerSchema.pre('save', function(next){
	var now = new Date();
	this.update_at = now;
	next();
});

mongoose.model('Customer', CustomerSchema);
