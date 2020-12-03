const eventproxy = require('eventproxy');
const InventoryProxy    = require('../../proxy').Inventory;
const ProductsProxy    = require('../../proxy').Product;
const config = require('../../config');
const moment = require('moment')

const create = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let body = req.body;
	body.token = req.headers.token;

	ProductsProxy.getProductById(body.pro_id, ep.done(function(data){
		if (!data) {
			return res.send({success: false, msg: '产品不存在'});
		}
		InventoryProxy.newAndSave({
			...body,
			pro_name: data.name,
			pro_price: data.price,
			tag: data.tag,
			tag_id: data.tag_id,
			pic: data.pic
		}, ep.done(function (data) {
			res.send({success: true, data: data});
		}));
	}));

}

const del = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	InventoryProxy.delById(req.params.id, ep.done(function (data) {
		if (!data) {
			return res.send({success: false, msg: '库存不存在'});
		}
		res.send({success: true, data: data});
	}));
}

const update = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	InventoryProxy.updateById(req.params.id, {
		remark: req.body.remark
	}, ep.done(function (data) {
		if (!data) {
			return res.send({success: false, msg: '库存不存在'});
		}
		res.send({success: true, data: data});
	}));
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
	if(query.pro_name) {
		const reg = new RegExp(query.pro_name, 'i')
		query = {
			...query,
			pro_name:  {$regex : reg}
		}
	}

	query.token = req.headers.token;

	InventoryProxy.count(query, (err, sums) => {
		InventoryProxy.getListByQuery(query, options, ep.done(function (data) {
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

const sums = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let query = req.query;

	// 过滤空查询
	for(let i in query) {
		if (!query[i]) {
			delete query[i]
		}
	}
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

	query.token = req.headers.token;

	InventoryProxy.getListByQuery(query, {}, ep.done(function (data) {
		let total = 0
		data.map(item => {
			item.price_list.map(i => {
				if (i.amount > 0) {
					total += i.price*i.amount
				}
			})
		})
		res.send({
			success: true, 
			data: {
				sums: total,
				list: data
			}
		});
	}));
}

const oneById = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	InventoryProxy.getInventoryById(req.params.id, ep.done(function (data) {
		if (!data) {
			return res.send({success: false, msg: '库存不存在'});
		}
		res.send({success: true, data: data});
	}));
}

// 根据产品id查询库存
const oneByPro = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	InventoryProxy.getInventoryByPro({
		pro_id: req.params.id,
		token: req.headers.token
	}, ep.done(function (data) {
		if (!data) {
			return res.send({success: false, msg: '库存不存在'});
		}
		res.send({success: true, data: data});
	}));
}

exports.create = create
exports.del = del
exports.update = update
exports.list = list
exports.oneById = oneById
exports.oneByPro = oneByPro
exports.sums = sums
