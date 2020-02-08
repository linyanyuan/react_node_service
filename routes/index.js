var express = require('express');
var router = express.Router();

var login = require('../login/login.js'); // 登录接口
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 登录
router.get('/api/login',function(req,res,next){
	login.login(req,res,next)
})
// 获取本月数据
router.get('/api/getPayReal',function(req,res,next){
	login.getPayReal(req,res,next)
})
// 记账
router.post('/api/queryAccount',function(req,res,next){
	login.queryAccount(req,res,next)
})
//删除一条记录
router.get('/api/deleteAccount',function(req,res,next){
	login.deleteAccount(req,res,next)
})
// 修改一条记录
router.get('/api/updateAccount',function(req,res,next){
	login.updateAccount(req,res,next)
})
//获取统计
router.get('/api/queryStatistics',function(req,res,next){
	login.queryStatistics(req,res,next)
})
module.exports = router;
