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

	let id = req.params.id
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		CompanyProxy.delById(id, ep.done(function (data) {
			if (!data) {
				return res.send({success: false, msg: '公司不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '公司id有误'});
	}
}

const update = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		CompanyProxy.updateById(req.params.id, req.body, ep.done(function (data) {
			if (!data) {
				return res.send({success: false, msg: '公司不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '公司id有误'});
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
	if(query.name) {
		const reg = new RegExp(query.name, 'i')
		query = {
			...query,
			name:  {$regex : reg}
		}
	} else {
		delete query["name"]
	}

	CompanyProxy.count(query, (err, sums) => {
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
