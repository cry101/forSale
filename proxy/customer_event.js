var models  = require('../models');
var CusEvent    = models.CusEvent;

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
	CusEvent.findOne({_id: id}, callback);
};

/**
 * 根据id更新分类
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.updateById = function (id, data, callback) {
	CusEvent.updateOne({_id: id}, {$set: data}, callback)
};

/**
 * 根据id删除分类
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.delById = function (id, callback) {
	CusEvent.deleteOne({_id: id}, callback)
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
	CusEvent.find(query, '', opt, callback);
};

/**
 * 查询总条数
*/
exports.count = function (query, callback) {
	CusEvent.countDocuments(query, callback)
};

/**
 * 新增
 * @param {String} obj 提交的数据
 * @param {Function} callback 回调函数
* */
exports.newAndSave = function ( obj, callback) {
	var event = new CusEvent();
	event.name = obj.name || '';
	event.date = obj.date || '';
	event.customer_id = obj.customer_id;
	event.gif_record = obj.gif_record || '';
	event.remark = obj.remark || '';

	event.save(callback);
};