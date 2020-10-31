var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');

var ProductsSchema = new Schema({
	name: { type: String}, // 产品名称
	product_code: { type: String}, // 产品代码 对应官网的 下次添加不重复标识
	tag_id: {type: String},
	tag_name: {type: String},
	company_id: {type: String},
	price: {type: Array}, // 多个价格
	pic: {type: String},
	bar_code: {type: String} // 条形码
});

mongoose.model('Product', ProductsSchema);
