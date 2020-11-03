var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');

var CustomerSchema = new Schema({
	name: { type: String},
	mobile: { type: String},
	sex: { type: String},
	birthday: { type: String},
	star: { type: Number}, //星级 1-5
	address: {type: String},
	products: {type: Array}, //常用产品 预留
	tags: {type: Array}, // 常用标签
	describe: {type: String}, // 描述
	remark: {type: String},
	record: {type: String}, //服务跟进记录
	prepay: {type: Number}, //预付款

	token: {type: String},
});

mongoose.model('Customer', CustomerSchema);
