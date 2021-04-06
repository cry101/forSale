const eventproxy = require('eventproxy');
const CusRecordProxy    = require('../../proxy').CusRecord;
const config = require('../../config');
const moment = require('moment')


const create = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);
	CusRecordProxy.newAndSave(req.body, ep.done(function (data) {
		res.send({success: true, data: data});
	}));
}

const del = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		CusRecordProxy.delById(id, ep.done(function (data) {
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
		CusRecordProxy.updateById(id, req.body, ep.done(function (data) {
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
	let options = { skip: (page_no - 1) * page_size, limit: page_size, sort: '-top -created_time'};

	delete query["page_no"];
	delete query["page_size"];

	//模糊搜索
	if(!query.customer_id) {
		return res.send({success: false, msg: '缺少顾客id'});
	}
	CusRecordProxy.count({ customer_id: query.customer_id }, (err, sums) => {
		CusRecordProxy.getListByQuery({ customer_id: query.customer_id }, options, ep.done(function (data) {
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
		CusRecordProxy.getTagById(id, ep.done(function (data) {
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

const sums = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let query = req.query;
	let options = { sort: '-top -created_time' };

	// 过滤空查询
	for(let i in query) {
		if (!query[i]) {
			delete query[i]
		}
	}
	// console.log(query)
	// 日期范围查询
	if (query.startDate && query.endDate) {
		var startDate = moment(query.startDate + ' 00:00:00').format()
		var endDate = moment(query.endDate + ' 23:59:59').format()
		query = {
			...query,
			created_time:  { '$gte': startDate, '$lte': endDate}
		}
	}
	delete query.startDate
	delete query.endDate

	//模糊搜索
	if(!query.customer_id) {
		return res.send({success: false, msg: '缺少顾客id'});
	}

	// query.token = req.headers.token;
	CusRecordProxy.getListByQuery(query, options, ep.done(function (data) {
		let total = 0
		data.map(item => {
			if (item.deal) {
				total = total - item.money
			} else {
				total += item.money
			}
		})
		res.send({
			success: true, 
			data: {
				sums: total.toFixed(2),
				list: data
			}
		});
	}));
}

exports.create = create
exports.del = del
exports.update = update
exports.list = list
exports.oneById = oneById
exports.sums = sums
