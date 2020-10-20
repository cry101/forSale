const multer = require('multer');
const path = require('path')
var https = require("https")

// 上传文件
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(path.resolve('./'),"/public/uploads"))
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '_' + Date.now() + '.' + file.mimetype.split('/')[1])
	}
})
const upload = multer({ storage: storage })


// 微信小程序登录
const login = (req, res, next) => {
	const code = req.query.code
    if(!code) {
      	res.send({success: false, msg: '没有登录凭证'})
	}
	const appid = 'wxe14d811f3aec9108' // 测试
	const secret = '368d7719ff736cd27a0775deb7b30358' // 测试
	https.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`, function (data) {
		console.log(data)
		res.send({ success: true, data: data});
	})
}


exports.upload = upload
exports.login = login
