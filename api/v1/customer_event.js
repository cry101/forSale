const eventproxy = require('eventproxy');
const CusEventProxy    = require('../../proxy').CusEvent;
const config = require('../../config');


const create = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);
	CusEventProxy.newAndSave(req.body, ep.done(function (data) {
		res.send({success: true, data: data});
	}));
}

const del = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		CusEventProxy.delById(id, ep.done(function (data) {
			if (!data) {
				return res.send({success: false, msg: '记录不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '记录id有误'});
	}
	
}

const update = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		CusEventProxy.updateById(id, req.body, ep.done(function (data) {
			if (!data) {
				return res.send({success: false, msg: '记录不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '记录id有误'});
	}
}

const list = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let query = req.query;
	let page_no = parseInt(query.page_no, 10) || 1;
	page_no = page_no > 0 ? page_no : 1;
	let page_size    = Number(query.page_size) || config.page_size;
	let options = { skip: (page_no - 1) * page_size, limit: page_size, sort: '-top -sort'};

	delete query["page_no"];
	delete query["page_size"];

	//模糊搜索
	if(!query.customer_id) {
		return res.send({success: false, msg: '缺少顾客id'});
	}

	CusEventProxy.count({ customer_id: query.customer_id }, (err, sums) => {
		CusEventProxy.getListByQuery({ customer_id: query.customer_id }, options, ep.done(function (data) {
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

const oneById = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		CusEventProxy.getTagById(id, ep.done(function (data) {
			if (!data) {
				// res.status(404);
				return res.send({success: false, msg: '记录不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '记录id有误'});
	}
}

exports.create = create
exports.del = del
exports.update = update
exports.list = list
exports.oneById = oneById
