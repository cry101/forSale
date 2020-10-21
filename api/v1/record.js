const eventproxy = require('eventproxy');
const RecordProxy    = require('../../proxy').Record;
const ProductsProxy    = require('../../proxy').Product;
const config = require('../../config');


const create = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let body = req.body;
	body.token = req.headers.token;
	// todo 进销存逻辑

	ProductsProxy.getProductById(body.pro_id, ep.done(function(data){
		if (!data) {
			res.status(404);
			return res.send({success: false, msg: '产品不存在'});
		}
		delete body['pro_id']
		RecordProxy.newAndSave({
			...body,
			pro_name: data.name,
			pro_price: data.price,
			tag: data.tag,
			pic: data.pic
		}, ep.done(function (data) {
			res.send({success: true, data: data});
		}));
	}));

}

const del = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	RecordProxy.delById(req.params.id, ep.done(function (data) {
		if (!data) {
			res.status(404);
			return res.send({success: false, msg: '记录不存在'});
		}
		res.send({success: true, data: data});
	}));
}

const update = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	RecordProxy.updateById(req.params.id, req.body, ep.done(function (data) {
		if (!data) {
			res.status(404);
			return res.send({success: false, msg: '记录不存在'});
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
	let options = { skip: (page_no - 1) * page_size, limit: page_size, sort: '-top -last_reply_at'};

	delete query["page_no"];
	delete query["page_size"];

	//模糊搜索
	if(query.name) {
		const reg = new RegExp(query.name, 'i')
		query = {
			...query,
			name:  {$regex : reg}
		}
	} else {
		delete query["name"]
	}

	query.token = req.headers.token;

	RecordProxy.getListByQuery(query, options, ep.done(function (data) {
		res.send({success: true, data: data});
	}));
}

const oneById = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	RecordProxy.getRecordById(req.params.id, ep.done(function (data) {
		if (!data) {
			res.status(404);
			return res.send({success: false, msg: '记录不存在'});
		}
		res.send({success: true, data: data});
	}));
}

exports.create = create
exports.del = del
exports.update = update
exports.list = list
exports.oneById = oneById
