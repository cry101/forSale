var models  = require('../models');
var Company = models.Company;

/**
 * 根据id更新公司
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.updateById = function (id, data, callback) {
	Company.updateOne({_id: id}, {$set: data}, callback)
};

/**
 * 根据id删除公司
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.delById = function (id, callback) {
	Company.deleteOne({_id: id}, callback)
};

/**
 * 根据关键字，获取公司列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getListByQuery = function (query, opt, callback) {
	Company.find(query, '', opt, callback);
};

/**
 * 查询总条数
*/
exports.count = function (callback) {
	Company.count({}, callback)
};

/**
 * 新增一个公司
 * @param {String} obj 提交的数据
 * @param {Function} callback 回调函数
* */
exports.newAndSave = function ( obj, callback) {
	var company = new Company();
	company.name = obj.name || '';
	company.remark = obj.remark || '';

	company.save(callback);
};
