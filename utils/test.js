
const axios = require('axios')
// https.globalAgent.options.secureProtocol = 'SSLv3_method';
var post_data = {  
	"categoryAggregateType": "CHILDREN",
	"categoryCode": "100",
	"channel": "INT",
	"channelCode": "INT",
	"pageNo": 1,
	"pageSize": 100
};//这是需要提交的数据  

const url = 'https://api.amway.com.cn/commodity-center/v1/api/search/product'
axios({
	data: post_data,
	method: 'post',
	url: url
}).then(function(result) {
	console.log(result)
}).catch(e => {
	console.log(e)
})
  
  
// var content = qs.stringify(post_data);  
  
// var options = {  
//     hostname: 'api.amway.com.cn',  
//     port: 80,  
//     path: '/commodity-center/v1/api/search/product',  
//     method: 'POST',  
//     headers: {  
//         'Content-Type': 'application/json;charset=UTF-8' 
// 	},
// 	rejectUnauthorized: false,
//     requestCert: true
// }; 
// // var options = {  
// //     hostname: 'seadm.xmbhzt.com',  
// //     port: 8091,  
// //     path: '/sys/dictionaryValue/dictionaryValueList',  
// //     method: 'POST',  
// //     headers: {  
// //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' // 'application/json;charset=UTF-8' 
// //     }
// // };  
  
// var req = https.request(options, function (res) {  
//     console.log('STATUS: ' + res.statusCode);  
//     console.log('HEADERS: ' + JSON.stringify(res.headers));  
//     res.setEncoding('utf8');  
//     res.on('data', function (chunk) {  
//         console.log('BODY: ' + chunk);  
        
//         var data = JSON.parse(chunk);
//         console.log(data.returnCode);
//     });  
// });  
  
// req.on('error', function (e) {  
//     console.log('problem with request: ' + e.message);  
// });  
  
// // 将数据写入请求体
// req.write(content);//注意这个地方  
  
// req.end();