var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
// var utility   = require('utility');
// var _ = require('lodash');
/**
 * 产品和分类按公司来管理
*/
var CompanySchema = new Schema({
	name: { type: String, unique: true},
	remark: { type: String},
});


mongoose.model('Company', CompanySchema);
