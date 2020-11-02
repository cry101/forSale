var models  = require('../models');
var User    = models.User;
// var utility = require('utility');
// var uuid    = require('node-uuid');

/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByNames = function (names, callback) {
	if (names.length === 0) {
		return callback(null, []);
	}
	User.find({ nickName: { $in: names } }, callback);
};

/**
 * 根据token查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} token
 * @param {Function} callback 回调函数
 */
exports.getUserByToken = function (token, callback) {
	if (!token) {
		return callback();
	}
	User.findOne({'token': token}, callback);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
	if (!id) {
		return callback();
	}
	User.findOne({_id: id}, callback);
};

/**
 * 根据id更新用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.updateUserById = function (id, data, callback) {
	User.updateOne({_id: id}, {$set: data}, callback)
};

/**
 * 根据token更新用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} token 用户token
 * @param {Function} callback 回调函数
 */
exports.updateUserByToken = function (token, data, callback) {
	User.updateOne({ token }, {$set: data}, callback)
};

/**
 * 根据id删除用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.delUserById = function (id, callback) {
	User.deleteOne({_id: id}, callback)
};

/**
 * 根据用户ID列表，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} ids 用户ID列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByIds = function (ids, callback) {
	User.find({'_id': {'$in': ids}}, callback);
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
	User.find(query, '', opt, callback);
};

/**
 * 查询总条数
*/
exports.count = function (callback) {
	User.countDocuments({}, callback)
};


exports.newAndSave = function ( obj, callback) {
	var user = new User();
	user.nickName = obj.nickName || '';
	user.gender = obj.gender || '';
	user.language = obj.language || '';
	user.city = obj.city || '';
	user.province = obj.province || '';
	user.country = obj.country || '';
	user.avatarUrl = obj.avatarUrl || '';

	user.company_id = obj.company_id || '';
	user.token = obj.token || ''; // uuid.v4();

	user.username = obj.username || '';
	user.password = obj.password || '';

	user.save(callback);
};