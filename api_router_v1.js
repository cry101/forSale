const express = require('express');

const auth = require('./middlewares/auth')

const commonApi = require('./api/v1/common');
const userApi = require('./api/v1/user');
const companyApi = require('./api/v1/company');
const tagApi = require('./api/v1/tag');
const productApi = require('./api/v1/product');
const customerApi = require('./api/v1/customer');
const recordApi = require('./api/v1/record');
const inventoryApi = require('./api/v1/inventory');

// const middleware        = require('./api/v1/middleware');
// const limit             = require('./middlewares/limit');
const config = require('./config');

const router = express.Router();

// 通用接口
router.post('/upload', commonApi.upload.single('file'),(req,res)=>{
    let path = '/uploads/' + req.file.filename
    res.send({success: true, data: {
        ...req.file,
        path
    }})
})
router.get('/login', commonApi.login);

// 用户
router.post('/user', userApi.create);
router.get('/user/:id', userApi.oneById);
router.get('/users', userApi.list);
router.get('/userInfo', auth.userRequired, userApi.info);
router.put('/user/:id', userApi.update);
router.put('/userInfo', auth.userRequired, userApi.updateByToken);
router.delete('/user/:id', userApi.del);

// 公司
router.post('/company', companyApi.create);
router.get('/companys', companyApi.list);
router.put('/company/:id', companyApi.update);
router.delete('/company/:id', companyApi.del);

// 分类
router.post('/tag', tagApi.create);
router.get('/tags', tagApi.list);
router.put('/tag/:id', tagApi.update);
router.delete('/tag/:id', tagApi.del);
router.get('/tag/:id', tagApi.oneById);

// 产品
router.post('/product', productApi.create);
router.get('/product/:id', productApi.oneById);
router.get('/products', productApi.list);
router.put('/product/:id', productApi.update);
router.delete('/product/:id', productApi.del);
router.post('/product/fetch', productApi.fetch);


// 客户
router.post('/customer', auth.userRequired, customerApi.create);
router.get('/customer/:id', auth.userRequired, customerApi.oneById);
router.get('/customers', auth.userRequired, customerApi.list);
router.put('/customer/:id', auth.userRequired, customerApi.update);
router.delete('/customer/:id', auth.userRequired, customerApi.del);

// 进销
router.post('/record',auth.userRequired, recordApi.create);
router.get('/record/:id',auth.userRequired, recordApi.oneById);
router.get('/records',auth.userRequired, recordApi.list);
// router.put('/record/:id',auth.userRequired, recordApi.update);
router.delete('/record/:id',auth.userRequired, recordApi.del);

// 库存
// router.post('/inventory',auth.userRequired, inventoryApi.create);
router.get('/inventory/:id',auth.userRequired, inventoryApi.oneById);
router.get('/inventorys',auth.userRequired, inventoryApi.list);
// router.put('/inventory/:id',auth.userRequired, inventoryApi.update);
router.delete('/inventory/:id',auth.userRequired, inventoryApi.del);

module.exports = router;
