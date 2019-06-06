var models  = require('../models');
var Record = models.Record;

/**
 * 根据ID查找记录
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getRecordById = function (id, callback) {
	if (!id) {
		return callback();
	}
	Record.findOne({_id: id}, callback);
};

/**
 * 根据id更新记录
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.updateById = function (id, data, callback) {
	Record.updateOne({_id: id}, {$set: data}, callback)
};

/**
 * 根据id删除记录
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.delById = function (id, callback) {
	Record.deleteOne({_id: id}, callback)
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
	Record.find(query, '', opt, callback);
};

/**
 * 新增一个记录
 * @param {String} obj 提交的数据
 * @param {Function} callback 回调函数
* */
exports.newAndSave = function ( obj, callback) {
	var record = new Record();

	record.pro_name = obj.pro_name || ''
	record.pro_price = obj.pro_price || ''
	record.tag = obj.tag || ''
	record.pic = obj.pic || ''
	record.number = obj.number || ''
	record.type = obj.type || ''
	record.token = obj.token || ''
	record.remark = obj.remark || ''

	record.save(callback);
};
