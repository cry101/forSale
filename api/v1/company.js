const eventproxy = require('eventproxy');
const config = require('../../config');
const CompanyProxy = require('../../proxy').Company;

const create = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(err => {
		console.log(err)
		if (err.code === 11000 ) {
			return res.send({ success: false, message: '公司名称不能重复' })
		}
		next()
	});
	// todo 公司名不重复
	CompanyProxy.newAndSave(req.body, ep.done(function (data) {
		res.send({success: true, data: data});
	}));
}

const del = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	CompanyProxy.delById(req.params.id, ep.done(function (data) {
		if (!data) {
			res.status(404);
			return res.send({success: false, msg: '公司不存在'});
		}
		res.send({success: true, data: data});
	}));
}

const update = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	CompanyProxy.updateById(req.params.id, req.body, ep.done(function (data) {
		if (!data) {
			res.status(404);
			return res.send({success: false, msg: '公司不存在'});
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
	console.log('name', query.name)
	if(query.name) {
		console.log('jinlaid')
		const reg = new RegExp(query.name, 'i')
		query = {
			...query,
			name:  {$regex : reg}
		}
	} else {
		delete query["name"]
	}

	CompanyProxy.count((err, sums) => {
		CompanyProxy.getListByQuery(query, options, ep.done(function (data) {
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

exports.create = create
exports.del = del
exports.update = update
exports.list = list
