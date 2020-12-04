const eventproxy = require('eventproxy');
const RecordProxy    = require('../../proxy').Record;
const InventoryProxy    = require('../../proxy').Inventory;
const ProductsProxy    = require('../../proxy').Product;
const config = require('../../config');
const moment = require('moment')

const create = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let body = req.body;
	body.token = req.headers.token;
	let pro_id = body.pro_id
	// todo 进销存逻辑
	if (!/^[0-9a-fA-F]{24}$/.test(pro_id)) return res.send({success: false, msg: '产品id有误'});
	// 获取产品信息
	ProductsProxy.getProductById(pro_id, ep.doneLater('pro'));

	// 处理库存逻辑 根据对应用户的对应产品
	InventoryProxy.getInventoryByPro({
		pro_id,
		token: req.headers.token
	}, ep.doneLater('inve'))

	ep.all('pro', 'inve', function (pro, inve) {
		if (!pro) {
			return res.send({success: false, msg: '产品不存在'});
		}
		console.log('库存详情：', inve)
		if (!(body.customer_id && body.is_net)) { // 不是顾客下单 需要处理库存
			console.log('不是顾客下单 需要处理库存')
			if (!inve) { // 没有库存的情况 直接加进库存
				console.log('没有库存的情况 直接加进库存')
				if (body.type) { // 进
					console.log('进库存')
					InventoryProxy.newAndSave({
						...body,
						pro_id: body.pro_id,
						price_list: body.price_list,
						pro_name: pro.name,
						tag_name: pro.tag_name,
						tag_id: pro.tag_id,
						pic: pro.pic
					}, ep.doneLater('inventory'));
				} else {
					return res.send({success: false, msg: '没有该产品的库存'});
				}
			} else { // 有库存的情况，处理进出货
				console.log('有库存的情况，处理进出货')
				let priceArr = inve.price_list // 旧库存 [{price: 10, amount: 1}]
				let newArr = body.price_list // 新数据 [{price: 20, amount: 1}]
				// 转成对象去处理
				let price_list = {} // { 10: 1, 20: 2}
				priceArr.map(i => {
					price_list[i.price] = i.amount
				})
				let priceData = {} // { 10: 1, 20: 2}
				newArr.map(i => {
					priceData[i.price] = i.amount
				})
				
				let keys = Object.keys(priceData)
				let flag = 0
				keys.map(item => {
					if (body.type) { // 进
						if (price_list[item]) { // 存在
							price_list[item] = price_list[item] + priceData[item]
						} else {
							price_list[item] = priceData[item]
						}
					} else { // 出
						if (price_list[item]) { // 存在
							if (price_list[item] >= priceData[item]) { // 且足够
								price_list[item] = price_list[item] - priceData[item]
							} else {
								flag = item
								
							}
						} else {
							flag = 1
						}
					}
				})
				if (flag) {
					if (flag === 1) {
						return res.send({success: false, msg: '没有该产品的库存'});
					} else {
						return res.send({success: false, msg: flag + '库存不足' + price_list[flag]});
					}
				}


				let postData = []
				for(let p in price_list) {
					postData.push({ price: p, amount: price_list[p] })
				}
				InventoryProxy.updateById(inve._id, {
					price_list: postData
				}, ep.doneLater('inventory'));
			}
		}

		console.log('添加到记录')
		// 添加到记录
		RecordProxy.newAndSave({
			...body, // 价格使用自定义
			pro_name: pro.name,
			tag_id: pro.tag_id,
			tag_name: pro.tag_name,
			pic: pro.pic
		}, ep.done('record'));
		
	});

	ep.once('inventory', function(inventory) {
		console.log('库存添加进数据库：', inventory)
	})

	ep.all('record', function (record) {
		// console.log(record)
		// 成功回调
		res.send({success: true, data: record, msg: '操作成功'});
	})
}

const del = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		// 查询记录出来 处理库存
		RecordProxy.getRecordById(id, ep.doneLater('record'))

		let priceData = {} // { 10: 1, 20: 2}
		let type = false // true 进 false 出
		ep.once('record', function (record) {
			if (!record) {
				return res.send({success: false, msg: '记录不存在'});
			}
			type = record.type
			if (!(record.customer_id && record.is_net)) { // 不是顾客下单 需要处理库存
				let newArr = record.price_list // 新数据 [{price: 20, amount: 1}]
				// 转成对象去处理
				newArr.map(i => {
					priceData[i.price] = i.amount
				})
				InventoryProxy.getInventoryByPro({
					pro_id: record.pro_id,
					token: req.headers.token
				}, ep.doneLater('inve'))
			} else {
				ep.emit('del')
			}
		})

		// 处理库存
		ep.once('inve', function(inve) {
			let priceArr = inve.price_list // 旧库存 [{price: 10, amount: 1}]
			// 转成对象去处理
			let price_list = {} // { 10: 1, 20: 2}
			priceArr.map(i => {
				price_list[i.price] = i.amount
			})
			console.log(priceData, type)
			let keys = Object.keys(priceData)
			keys.map(item => {
				if (type) { // 出库的加回来
					price_list[item] = price_list[item] - priceData[item]
				} else { // 入库的减掉
					price_list[item] = price_list[item] + priceData[item]
				}
			})
			let postData = []
			for(let p in price_list) {
				postData.push({ price: p, amount: price_list[p] })
			}
			InventoryProxy.updateById(inve._id, {
				price_list: postData
			}, ep.done('del'));
		})

		ep.all('del',function(del) {
			let id = req.params.id
			if (/^[0-9a-fA-F]{24}$/.test(id)) {
				RecordProxy.delById(id, ep.done(function (data) {
					if (!data) {
						return res.send({success: false, msg: '记录不存在'});
					}
					res.send({success: true, msg: '删除成功', data: del });
				}))
			} else {
				res.send({success: false, msg: '记录id有误'});
			}
		})
	} else {
		res.send({success: false, msg: '记录id有误'});
	}
}

const update = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	RecordProxy.updateById(req.params.id, req.body, ep.done(function (data) {
		if (!data) {
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

	RecordProxy.count(query, (err, sums) => {
		RecordProxy.getListByQuery(query, options, ep.done(function (data) {
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

	// 出库条件
	if (query.type === 'false') {
		if (query.is_gift === 'false') { // 查询非赠品
			query.is_gift = { '$in': [false, null] } // 兼容旧数据
		}

		if (query.is_self) {
			if (query.is_self === 'true') { // 自用
				query.customer_id = ''
			} else if (query.is_self === 'false') { // 销售
				query.customer_id = { '$ne': ''} // 顾客id不为空
			}
			query.is_gift = { '$in': [false, null] }
			delete query.is_self
		}
		
	}

	query.token = req.headers.token;

	RecordProxy.getListByQuery(query, options, ep.done(function (data) {
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
				sums: total.toFixed(2),
				list: data
			}
		});
	}));
}

const oneById = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let id = req.params.id
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		RecordProxy.getRecordById(id, ep.done(function (data) {
			if (!data) {
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
exports.sums = sums
