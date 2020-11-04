var models  = require('../models');
var CusRecord    = models.CusRecord;

/**
 * 根据用户ID，查找分类
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getById = function (id, callback) {
	if (!id) {
		return callback();
	}
	CusRecord.findOne({_id: id}, callback);
};

/**
 * 根据id更新分类
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.updateById = function (id, data, callback) {
	CusRecord.updateOne({_id: id}, {$set: data}, callback)
};

/**
 * 根据id删除分类
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.delById = function (id, callback) {
	CusRecord.deleteOne({_id: id}, callback)
};

/**
 * 根据关键字，获取分类列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getListByQuery = function (query, opt, callback) {
	CusRecord.find(query, '', opt, callback);
};

/**
 * 查询总条数
*/
exports.count = function (query, callback) {
	CusRecord.countDocuments(query, callback)
};

/**
 * 新增
 * @param {String} obj 提交的数据
 * @param {Function} callback 回调函数
* */
exports.newAndSave = function ( obj, callback) {
	var record = new CusRecord();
	record.name = obj.name || '';
	record.date = obj.date || '';
	record.customer_id = obj.customer_id;
	record.content = obj.content || '';
	record.deal = obj.deal || false;
	record.reason = obj.reason || '';

	record.save(callback);
};