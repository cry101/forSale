var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

// 顾客跟进记录 - 统计下预存款
var CusRecordSchema = new Schema({
	name: { type: String}, // 顾客姓名
	date: { type: String}, // 日期
	customer_id: {type: String}, // 顾客id
	content: { type: String }, // 内容
	deal: { type: Boolean }, // 是否扣钱 true是 false否
	money: { type: Number }, // 金额
	remark: { type: String } // 备注
});

mongoose.model('CusRecord', CusRecordSchema);
