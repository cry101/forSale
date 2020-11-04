var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

// 顾客跟进记录
var CusEventSchema = new Schema({
	name: { type: String}, // 顾客姓名
	date: { type: String}, // 日期
	customer_id: { type: String }, // 顾客id
	gif_record: { type: String }, // 礼物记录
	remark: { type: String } // 备注
});

mongoose.model('CusEvent', CusEventSchema);
