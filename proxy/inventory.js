var models  = require('../models');
var Inventory = models.Inventory;

/**
 * 根据ID查找记录
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getInventoryById = function (id, callback) {
	if (!id) {
		return callback();
	}
	Inventory.findOne({_id: id}, callback);
};

/**
 * 根据id更新记录
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.updateById = function (id, data, callback) {
	Inventory.updateOne({_id: id}, {$set: data}, callback)
};

/**
 * 根据id删除记录
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.delById = function (id, callback) {
	Inventory.deleteOne({_id: id}, callback)
};

/**
 * 根据关键字，获取记录列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getListByQuery = function (query, opt, callback) {
	Inventory.find(query, '', opt, callback);
};

/**
 * 新增一个记录
 * @param {String} obj 提交的数据
 * @param {Function} callback 回调函数
* */
exports.newAndSave = function ( obj, callback) {
	var data = new Inventory();

	data.pro_name = obj.pro_name || ''
	data.pro_price = obj.pro_price || ''
	data.tag = obj.tag || ''
	data.pic = obj.pic || ''
	data.number = obj.number || ''
	data.token = obj.token || ''
	data.remark = obj.remark || ''

	data.save(callback);
};
