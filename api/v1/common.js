const multer = require('multer');
const path = require('path')
const axios = require('axios')
const config = require("../../config")

// 上传文件
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(path.resolve('./'),"/public/upload"))
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
	const appid = config.appId // 测试
	const secret = config.secret // 测试
	axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`)
	.then(result => {
		let data = result.data
		console.log(data)
		const errMap = {
			'-1': '系统繁忙',
			'40029': 'code无效',
			'45011': '频率限制，每个用户每分钟100次',
			'40013': 'appId有误'
		}
		if (data.errcode) {
			res.send({ success: false, code: data.errcode, msg: errMap[data.errcode], errmsg: data.errmsg });
		} else {
			// { openid, session_key} 
			res.send({ success: true, data: data.openid});
		}
	}).catch(e => {
		res.send({ success: false, error: e});
	})
}


exports.upload = upload
exports.login = login
