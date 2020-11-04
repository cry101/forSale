var eventproxy = require('eventproxy');
var UserProxy  = require('../proxy').User;

/**
 * 需要用户登录
 */
exports.userRequired = function (req, res, next) {
	let ep = new eventproxy()
	ep.fail(next);
	if(!req.headers.token) {
		return res.send({ success: false, msg: '没有用户信息', err: '没有token信息' })
	}
	UserProxy.getUserByToken(req.headers.token, ep.done(function(data){
		if (!data) {
			return res.status(403).send({ success: false, msg: '用户信息无效', err: 'token无效' });
		}
		next();
	}))
};

/**
 * 需要管理员权限
 */
exports.adminRequired = function (req, res, next) {
	let ep = new eventproxy()
	ep.fail(next);
	if(!req.headers.token) {
		return res.send({ success: false, msg: '没有用户信息', err: '没有token信息' })
	}
	UserProxy.getUserByToken(req.headers.token, ep.done(function(data){
		if (!data) {
			return res.status(403).send({ success: false, msg: '用户信息无效', err: 'token无效' });
		} else if( !data.isAdmin ) {
			return res.status(403).send({ success: false, msg: '没有权限' });
		}
		next();
	}))
};


