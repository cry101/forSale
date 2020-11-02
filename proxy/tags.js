var models  = require('../models');
var Tags    = models.Tags;

/**
 * 根据用户ID，查找分类
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getTagById = function (id, callback) {
	if (!id) {
		return callback();
	}
	Tags.findOne({_id: id}, callback);
};

/**
 * 根据id更新分类
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.updateById = function (id, data, callback) {
	Tags.updateOne({_id: id}, {$set: data}, callback)
};

/**
 * 根据id删除分类
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.delById = function (id, callback) {
	Tags.deleteOne({_id: id}, callback)
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
	Tags.find(query, '', opt, callback);
};

/**
 * 查询总条数
*/
exports.count = function (callback) {
	Tags.countDocuments({}, callback)
};

/**
 * 新增一个分类
 * @param {String} obj 提交的数据
 * @param {Function} callback 回调函数
* */
exports.newAndSave = function ( obj, callback) {
	var tag = new Tags();
	tag.name = obj.name || '';
	tag.company_id = obj.company_id || '';

	tag.save(callback);
};
