var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');

var spiderUrl = 'https://mall.amway.com.cn/%E7%BA%BD%E5%B4%94%E8%8E%B1%3Csup%3E%C2%AE%3C-sup%3E/c/100/loadMore?q=%3Acustomersort-desc&page=0&_=1559638008455'

superagent.get(spiderUrl).end(function( err, res){
	if(err) {
		return console.error(err)
	}
	let ep = new eventproxy();

	var $ = cheerio.load(res.text)
	var productList = []

	$('.product-listing .variant').each(function(i, element){
		var obj = {
			pic: $(element).find('.pictureimg').attr('src'),
			name: $(element).find('.product-title-link').attr('title'),
			price: $(element).find('.price').data('price'),
		}
		ep.done('fetch', data => data)
		productList.push(obj)
	})

	ep.all('fetch', function(data){
		console.log(data)
	})

	// console.log(productList)
})