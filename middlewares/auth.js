var eventproxy = require('eventproxy');
var UserProxy  = require('../proxy').User;

// todo 管理员权限

/**
 * 需要用户登录
 */
exports.userRequired = function (req, res, next) {
	let ep = new eventproxy()
	if(!req.headers.token) {
		return res.send({success: false, msg: '没有用户token信息'})
	}
	UserProxy.getUserByToken(req.headers.token, ep.done(function(data){
		if (!data) {
			return res.status(403).send({success: false, msg: 'token无效'});
		}
		next();
	}))
};


