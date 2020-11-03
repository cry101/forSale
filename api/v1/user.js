const eventproxy = require('eventproxy');
const UserProxy    = require('../../proxy').User;
const config = require('../../config');

const create = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let body = req.body
	let token = req.headers.token || req.body.token
	if (!token) {
		return res.send({success: false, msg: '没有用户token信息'})
	}
	// 校验token
	UserProxy.getUsersByQuery({ token }, {}, ep.doneLater('token'))

	ep.once('token', token => {
		if (token.length > 0) {
			return res.send({success: false, msg: '该用户token已被注册'})
		} else {
			if (body.username) {
				if (/[a-zA-Z0-9]{6,}/.test(body.username) && /[a-zA-Z0-9]{6,}/.test(body.password)) {
					UserProxy.getUsersByQuery({ username: body.username }, {}, ep.doneLater('username'))
				} else {
					return res.send({success: false, msg: '用户名和密码为6位以上数字和字母组成'})
				}
			} else {
				ep.emit('save')
			}
		}
	})
	ep.once('username', username => {
		if (username.length > 0) {
			return res.send({success: false, msg: '该用户名已被使用'})
		} else {
			ep.emit('save')
		}
	})

	ep.once('save', () => {
		UserProxy.newAndSave({
			...body,
			token
		}, ep.done(function (data) {
			res.send({success: true, data: data});
		}));
	})
}

// 小程序端使用
const updateByToken = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);
	let body = req.body

	if (body.username) {
		if (/[a-zA-Z0-9]{6,}/.test(body.username) && /[a-zA-Z0-9]{6,}/.test(body.password)) {
			UserProxy.getUsersByQuery({ username: body.username }, {}, ep.doneLater('username'))
		} else {
			return res.send({success: false, msg: '用户名和密码为6位以上数字和字母组成'})
		}
	} else {
		ep.emitLater('save')
	}
	ep.once('username', username => {
		if (username.length > 1) { // 更新的时候肯定有一个自己
			return res.send({success: false, msg: '该用户名已被使用'})
		} else {
			ep.emitLater('save')
		}
	})
	ep.once('save', () => {
		UserProxy.updateUserByToken(req.headers.token, {
			...body,
			token: req.headers.token
		}, ep.done(function (data) {
			if (!data) {
				return res.send({success: false, msg: '用户不存在'});
			}
			res.send({success: true, data: data});
		}));
	})
}

// 后台使用
const update = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (id.match(/^[0-9a-fA-F]{24}$/)) {
		UserProxy.updateUserById(id, req.body, ep.done(function (data) {
			if (!data) {
				// res.status(404);
				return res.send({success: false, msg: '用户不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '用户id有误'});
	}
}

const list = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let query = req.query;
	let page_no = parseInt(query.page_no, 10) || 1;
	page_no = page_no > 0 ? page_no : 1;
	let page_size    = Number(query.page_size) || config.page_size;
	let options = { skip: (page_no - 1) * page_size, limit: page_size, sort: '-top -created_time'};

	delete query["page_no"];
	delete query["page_size"];

	// 过滤空查询
	for(let i in query) {
		if (!query[i]) {
			delete query[i]
		}
	}
	//模糊搜索
	if(query.name) {
		const reg = new RegExp(query.name, 'i')
		query = {
			...query,
			name:  {$regex : reg}
		}
	}

	UserProxy.count(query, (err, sums) => {
		UserProxy.getUsersByQuery(query, options, ep.done(function (data) {
			res.send({
				success: true, 
				data: {
					list: data,
					total: sums
				}
			});
		}));
	})
}

const del = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (id.match(/^[0-9a-fA-F]{24}$/)) {
		UserProxy.delUserById(id, ep.done(function (data) {
			if (!data) {
				// res.status(404);
				return res.send({success: false, msg: '用户不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '用户id有误'});
	}
}

const oneById = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (id.match(/^[0-9a-fA-F]{24}$/)) {
		UserProxy.getUserById(id, ep.done(function (data) {
			if (!data) {
				res.status(404);
				return res.send({success: false, msg: '用户不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '用户id有误'});
	}
}

const info = (req, res, next) => {
	let ep = new eventproxy()
	ep.fail(next);

	UserProxy.getUserByToken(req.headers.token, ep.done(function(data){
		if (!data) {
			return res.send({success: true, data: null, msg: '请注册！'});
		}
		res.send({ success: true, data: data});
	}))
}

exports.create = create
exports.del = del
exports.update = update
exports.updateByToken = updateByToken
exports.list = list
exports.oneById = oneById
exports.info = info