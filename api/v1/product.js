const eventproxy = require('eventproxy');
const config = require('../../config');
const TagsProxy    = require('../../proxy').Tag;
const ProductsProxy    = require('../../proxy').Product;
const axios = require('axios')
const download = require('../../utils/download')

const fetch = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let query = req.query;
	// code 官方分类
	if(!(query.code && query.company_id && query.tag_id)) {
		res.send({ success: false, msg: '参数不足'})
		return
	}

	// 先获取分类名
	TagsProxy.getTagById(query.tag_id, ep.done(function (tag) {
		if (!tag) {
			return res.send({success: false, msg: '分类不存在'});
		}
		
		const imageUrl = config.amwayImageUrl
		var post_data = {  
			"categoryAggregateType": "CHILDREN",
			"categoryCode": query.code,
			"channel": "INT",
			"channelCode": "INT",
			"pageNo": query.page_no || 1,
			"pageSize": query.page_size || 100
		};//这是需要提交的数据  
		axios({
			data: post_data,
			method: 'post',
			url: config.amwayUrl
		}).then(function(result) {
			// console.log(result)
			let data = result.data.data.products.content
			// 去下载所有图片
			let urlList = data.map(j => imageUrl + j.picture)
			download(urlList)
			data.map(item => {
				let price = item.priceList.map(i => i.price)
				price = [...new Set(price)] // 多个价格去重
				let obj = {
					name: item.productName,
					product_code: item.productCode, // 产品代码 对应官网的 下次添加不重复标识
					tag_id: query.tag_id,
					tag_name: tag.name,
					company_id: query.company_id,
					price: price,
					pic: item.picture,
					bar_code: '' // 
				}
				ProductsProxy.newAndSave(obj, ep.done('fetch', data => data));
			})
			// res.send({success: true, msg: '请求成功', data: data });
			
			ep.all('fetch', _ => {
				res.send({success: true, msg: '操作成功'});
			})
		}).catch(e => {
			res.send({success: false, msg: '获取失败', data: e});
		})
	}));
}

// 先获取检查数据
const check = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let query = req.query;
	// code 官方分类
	if(!query.code) {
		res.send({ success: false, msg: '参数不足'})
		return
	}
		
	var post_data = {  
		"categoryAggregateType": "CHILDREN",
		"categoryCode": query.code,
		"channel": "INT",
		"channelCode": "INT",
		"pageNo": query.page_no || 1,
		"pageSize": query.page_size || 100
	};//这是需要提交的数据  
	axios({
		data: post_data,
		method: 'post',
		url: config.amwayUrl
	}).then(function(result) {
		// console.log(result.data.data)
		let data = result.data.data.products.content
		// console.log(data)
		let arr = []
		data.map(item => {
			let price = item.priceList.map(i => i.price)
			price = [...new Set(price)] // 多个价格去重
			let obj = {
				name: item.productName,
				product_code: item.productCode, // 产品代码 对应官网的 下次添加不重复标识
				tag_id: '',
				tag_name: '',
				company_id: '',
				price: price,
				pic: item.picture,
				bar_code: '' // 
			}
			arr.push(obj)
		})
		
		res.send({success: true, msg: '请求成功', data: data, saveData: arr });
		
	}).catch(e => {
		res.send({success: false, msg: '获取失败', data: e});
	})
}

const create = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	TagsProxy.getTagById(query.tag_id, ep.done(function (tag) {
		if (!tag) {
			return res.send({success: false, msg: '分类不存在'});
		}
		ProductsProxy.newAndSave({
			...req.body,
			tag_name: tag
		}, ep.done(function (data) {
			res.send({success: true, data: data});
		}));
	}))
}

const del = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		ProductsProxy.delById(id, ep.done(function (data) {
			if (!data) {
				return res.send({success: false, msg: '产品不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '产品id有误'});
	}
}

const update = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	// TagsProxy.getTagById(query.tag_id, ep.done('tag'))

	// ep.all('tag', function(tag) {
	// 	if (!tag) {
	// 		return res.send({success: false, msg: '分类不存在'});
	// 	}
		ProductsProxy.updateById(req.params.id, {
			...req.body
		}, ep.done(function (data) {
			if (!data) {
				return res.send({success: false, msg: '产品不存在'});
			}
			res.send({success: true, data: data});
		}));
	// })
	
}

const list = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	// 翻页
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

	ProductsProxy.count(query, (err, sums) => {
		ProductsProxy.getListByQuery(query, options, ep.done(function (data) {
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
		ProductsProxy.getProductById(id, ep.done(function (data) {
			if (!data) {
				// res.status(404);
				return res.send({success: false, msg: '产品不存在'});
			}
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '产品id有误'});
	}
}

const proList = (req, res, next) => {
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
		ProductsProxy.getProductByIds(ids, ep.done(function (data) {
			res.send({success: true, data: data});
		}));
	} else {
		res.send({success: false, msg: '传参格式有误'});
	}
}

exports.fetch = fetch
exports.check = check
exports.create = create
exports.del = del
exports.update = update
exports.list = list
exports.oneById = oneById
exports.proList = proList