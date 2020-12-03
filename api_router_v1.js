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
const cusEventApi = require('./api/v1/customer_event');
const cusRecordApi = require('./api/v1/customer_record');

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
router.post('/userLogin', userApi.login);
router.post('/user', userApi.create);
router.get('/user/:id', userApi.oneById);
router.get('/users', auth.adminRequired, userApi.list);
router.get('/userInfo', auth.userRequired, userApi.info);
router.put('/user/:id', userApi.update);
router.put('/userInfo', auth.userRequired, userApi.updateByToken);
router.delete('/user/:id', auth.adminRequired, userApi.del);

// 公司
router.post('/company', auth.adminRequired, companyApi.create);
router.get('/companys', companyApi.list);
router.put('/company/:id', auth.adminRequired, companyApi.update);
router.delete('/company/:id', auth.adminRequired, companyApi.del);

// 分类
router.post('/tag', auth.adminRequired, tagApi.create);
router.get('/tags', tagApi.list);
router.put('/tag/:id', auth.adminRequired, tagApi.update);
router.delete('/tag/:id', auth.adminRequired, tagApi.del);
router.get('/tag/:id', tagApi.oneById);
router.post('/tagByids', tagApi.tagList);

// 产品
router.post('/product', auth.adminRequired, productApi.create);
router.get('/product/:id', productApi.oneById);
router.get('/products', productApi.list);
router.put('/product/:id', auth.adminRequired, productApi.update);
router.delete('/product/:id', auth.adminRequired, productApi.del);
router.post('/product/fetch', auth.adminRequired, productApi.fetch);
router.post('/product/check', auth.adminRequired, productApi.check);
router.post('/productByIds', productApi.proList)


// 客户
router.post('/customer', auth.userRequired, customerApi.create);
router.get('/customer/:id', auth.userRequired, customerApi.oneById);
router.get('/customers', auth.userRequired, customerApi.list);
router.put('/customer/:id', auth.userRequired, customerApi.update);
router.delete('/customer/:id', auth.userRequired, customerApi.del);

// 客户跟进记录
router.post('/cusRecord', auth.userRequired, cusRecordApi.create);
router.get('/cusRecord/:id', auth.userRequired, cusRecordApi.oneById);
router.get('/cusRecords', auth.userRequired, cusRecordApi.list);
router.put('/cusRecord/:id', auth.userRequired, cusRecordApi.update);
router.delete('/cusRecord/:id', auth.userRequired, cusRecordApi.del);

// 客户重要事件
router.post('/cusEvent', auth.userRequired, cusEventApi.create);
router.get('/cusEvent/:id', auth.userRequired, cusEventApi.oneById);
router.get('/cusEvents', auth.userRequired, cusEventApi.list);
router.put('/cusEvent/:id', auth.userRequired, cusEventApi.update);
router.delete('/cusEvent/:id', auth.userRequired, cusEventApi.del);

// 进销
router.post('/record',auth.userRequired, recordApi.create);
router.get('/record/:id',auth.userRequired, recordApi.oneById);
router.get('/records',auth.userRequired, recordApi.list);
router.get('/records/sums',auth.userRequired, recordApi.sums);
// router.put('/record/:id',auth.userRequired, recordApi.update);
router.delete('/record/:id',auth.userRequired, recordApi.del);

// 库存
// router.post('/inventory',auth.userRequired, inventoryApi.create);
router.get('/inventory/:id',auth.userRequired, inventoryApi.oneById);
router.get('/inventoryByPro/:id',auth.userRequired, inventoryApi.oneByPro);
router.get('/inventorys',auth.userRequired, inventoryApi.list);
router.get('/inventorys/sums',auth.userRequired, inventoryApi.sums);
router.put('/inventory/:id',auth.userRequired, inventoryApi.update);
router.delete('/inventory/:id',auth.userRequired, inventoryApi.del);

module.exports = router;
