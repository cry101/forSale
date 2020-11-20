var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');

// 库存
var InventorySchema = new Schema({
	pro_id: {type: String}, // 产品id
	pro_name: { type: String}, // 产品名
	price_list: { type: Array}, // 产品价格 [{price: 10, amount: 1}]
	tag_id: {type: String}, // 分类id
	tag_name: {type: String}, // 产品分类
	pic: {type: String}, // 产品图

	token: {type: String}, // 用户token
	remark: {type: String}, // 备注
});

mongoose.model('Inventory', InventorySchema);
