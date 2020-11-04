var models  = require('../models');
var Product = models.Product;


/**
 * 根据ID查找客户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getProductById = function (id, callback) {
	if (!id) {
		return callback();
	}
	Product.findById(id, callback);
};

/**
 * 根据id更新产品
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.updateById = function (id, data, callback) {
	Product.updateOne({_id: id}, {$set: data}, callback)
};

/**
 * 根据id删除产品
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.delById = function (id, callback) {
	Product.deleteOne({_id: id}, callback)
};

/**
 * 根据关键字，获取产品列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getListByQuery = function (query, opt, callback) {
	Product.find(query, '', opt, callback);
};

/**
 * 查询总条数
*/
exports.count = function (query, callback) {
	Product.countDocuments(query, callback)
};

/**
 * 新增一个产品
 * @param {String} obj 提交的数据
 * @param {Function} callback 回调函数
* */
exports.newAndSave = function ( obj, callback) {
	var product = new Product();
	product.name = obj.name || '';
	product.product_code = obj.product_code || '';
	product.company_id = obj.company_id || '';
	product.tag_id = obj.tag_id || '';
	product.tag_name = obj.tag_name || '';
	product.price = obj.price || [];
	product.pic = obj.pic || '';
	product.bar_code = obj.bar_code || '';
	product.save(callback);
};

/**
 * 根据ID列表，获取一组数据
 * Callback:
 * - err, 数据库异常
 * - users, 数据列表
 * @param {Array} ids ID列表
 * @param {Function} callback 回调函数
 */
exports.getProductByIds = function (ids, callback) {
	Product.find({'_id': {'$in': ids}}, callback);
};
