var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

// 顾客跟进记录
var CusRecordSchema = new Schema({
	name: { type: String}, // 顾客姓名
	date: { type: String}, // 日期
	customer_id: {type: String}, // 顾客id
	content: { type: String }, // 内容
	deal: { type: Boolean }, // 是否成交 true是 false否
	reason: { type: String } // 原因
});

mongoose.model('CusRecord', CusRecordSchema);
