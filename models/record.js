var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');

// 进销记录
var RecordSchema = new Schema({
	pro_id: { type: String},
	pro_name: { type: String},
	price_list: { type: Array}, // 产品价格 [{price: 10, amount: 1}]

	tag_name: {type: String},
	tag_id: {type: String},
	pic: {type: String},

	type: {type: Boolean}, // 类型 true进 false销
	token: {type: String},
	remark: {type: String},

	customer_id: {type: String}, // 客户id 为空代表自己
	customer_name: {type: String}, // 顾客姓名
	is_net: {type: Boolean} // 顾客自己网购(不处理库存) true是 false否
});

mongoose.model('Record', RecordSchema);
