const eventproxy = require('eventproxy');
const TagsProxy    = require('../../proxy').Tag;
const config = require('../../config');


const create = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);
	TagsProxy.newAndSave(req.body, ep.done(function (data) {
		res.send({success: true, data: data});
	}));
}

const del = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		TagsProxy.delById(id, ep.done(function (data) {
			if (!data) {
				return res.send({success: false, msg: '分类不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '分类id有误'});
	}
	
}

const update = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		TagsProxy.updateById(id, req.body, ep.done(function (data) {
			if (!data) {
				return res.send({success: false, msg: '分类不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '分类id有误'});
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

	TagsProxy.count(query, (err, sums) => {
		TagsProxy.getListByQuery(query, options, ep.done(function (data) {
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
		TagsProxy.getTagById(id, ep.done(function (data) {
			if (!data) {
				// res.status(404);
				return res.send({success: false, msg: '分类不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '分类id有误'});
	}
}

const tagList = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let ids = req.body.ids // [1,2,3]
	let flag = false
	for(let i = 0; i < ids.length; i++) {
		if (!/^[0-9a-fA-F]{24}$/.test(ids[i])) {
			flag = true
			break
		}
	}
	if (ids instanceof Array && !flag) {
		TagsProxy.getTagsByIds(ids, ep.done(function (data) {
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '传参格式有误'});
	}
}

exports.create = create
exports.del = del
exports.update = update
exports.list = list
exports.oneById = oneById
exports.tagList = tagList
