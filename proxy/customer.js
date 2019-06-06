var models  = require('../models');
var Customer = models.Customer;

/**
 * 根据ID查找客户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getCustomerById = function (id, callback) {
	if (!id) {
		return callback();
	}
	Customer.findOne({_id: id}, callback);
};

/**
 * 根据id更新客户
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.updateById = function (id, data, callback) {
	Customer.updateOne({_id: id}, {$set: data}, callback)
};

/**
 * 根据id删除客户
 * Callback:
 * - err, 数据库异常
 * @param {String} id 用户id
 * @param {Function} callback 回调函数
 */
exports.delById = function (id, callback) {
	Customer.deleteOne({_id: id}, callback)
};

/**
 * 根据关键字，获取客户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getListByQuery = function (query, opt, callback) {
	Customer.find(query, '', opt, callback);
};

/**
 * 新增一个客户
 * @param {String} obj 提交的数据
 * @param {Function} callback 回调函数
* */
exports.newAndSave = function ( obj, callback) {
	var customer = new Customer();
	customer.name = obj.name || ''
	customer.nick_name = obj.nick_name || ''
	customer.sex = obj.sex || ''
	customer.birthday = obj.birthday || ''
	customer.is_remind = obj.is_remind || '' //是否提醒
	customer.address = obj.address || ''
	customer.products = obj.products || '' //常用产品
	customer.describe = obj.describe || ''
	customer.remark = obj.remark || ''
	customer.record = obj.record || '' //服务跟进记录
	customer.prepay = obj.prepay || '' //预付款
	customer.token = obj.token || '' //所属用户

	customer.save(callback);
};
