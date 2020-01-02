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
module.exports = router;
