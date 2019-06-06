const eventproxy = require('eventproxy');
const superagent = require('superagent');
const cheerio = require('cheerio');
const config = require('../../config');
const ProductsProxy    = require('../../proxy').Product;

const fetch = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	let query = req.query;
	if(!(query.url && query.company_id && query.tag)) {
		res.send({ success: false, msg: '参数不足'})
		return
	}

	let reg=/^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
	if (!reg.test(query.url)){
		res.send({ success: false, msg: 'url格式不正确'})
	}

	superagent.get(query.url).end(function( err, res){
		if(err) {
			return console.error(err)
		}

		let $ = cheerio.load(res.text)

		$('.product-listing .variant').each(function(i, element){
			let obj = {
				pic: $(element).find('.pictureimg').attr('src'),
				name: $(element).find('.product-title-link').attr('title'),
				price: $(element).find('.price').data('price').replace(/[^0-9.]/g, ''),
				company_id: query.company_id,
				tag: query.tag
			}
			ProductsProxy.newAndSave(obj, ep.done('fetch', data => data));
		})

		ep.all('fetch', _ => {
			res.send({success: true, msg: '操作成功'});
		})

	})

}

const create = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	ProductsProxy.newAndSave(req.body, ep.done(function (data) {
		res.send({success: true, data: data});
	}));
}

const del = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	ProductsProxy.delById(req.params.id, ep.done(function (data) {
		if (!data) {
			res.status(404);
			return res.send({success: false, msg: '产品不存在'});
		}
		res.send({success: true, data: data});
	}));
}

const update = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	ProductsProxy.updateById(req.params.id, req.body, ep.done(function (data) {
		if (!data) {
			res.status(404);
			return res.send({success: false, msg: '产品不存在'});
		}
		res.send({success: true, data: data});
	}));
}

const list = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	// 翻页
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
	}

	ProductsProxy.getListByQuery(query, options, ep.done(function (data) {
		res.send({success: true, data: data});
	}));
}

const oneById = (req, res, next) => {
	let ep = new eventproxy();
	ep.fail(next);

	ProductsProxy.getProductById(req.params.id, ep.done(function (data) {
		if (!data) {
			res.status(404);
			return res.send({success: false, msg: '产品不存在'});
		}
		res.send({success: true, data: data});
	}));
}

exports.fetch = fetch
exports.create = create
exports.del = del
exports.update = update
exports.list = list
exports.oneById = oneById