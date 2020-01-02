var mysql = require('mysql');
var config = require('../conf/db.js');
var utils = require('../utils/util.js');
var sql = require('./loginsql.js');
//使用mysql 连接池
var pool = mysql.createPool(utils.extend({},config.mysql));

// 向前台返回json方法
var jsonWrite = function(res,req){
	if(typeof req === 'undefined'){
		res.json({
			code:'1',
			meg:'操作失败'
		})
	}else{
		res.json(req)
	}
}

module.exports = {
	login:function(req,res,next){
		// console.log(req)
		pool.getConnection(function(err,connection){
			if(err) {
				console.log(err,"建立连接失败")
			} else{
				console.log("建立连接成功")
				// 获取前台传过来的参数
				var param = req.query ||req.params;
				// 建立连接，请求登录
				// var sqlStr = 'SELECT * FROM userinfo WHERE `username` = '+param.username+' AND `password` = '+param.password+''
				connection.query(sql.login,[param.username,param.password],function(err,result){		
					if(err){
						console.log("查询失败",err)
					}else{
						console.log("查询成功",result)
						if(result && result.length !== 0){
							result = {
								code: '1',
								msg:'登录成功'
							}; 
						} else {
							result = {
								code: '0',
								msg:'账号或密码错误'
							}; 
						}
						// 已json形式把操作结果传给前台页面
					 	jsonWrite(res, result);
						// 释放连接
						connection.release();
					}
				})
			}
		})
	},
	getPayReal:function(req,res,next){
		pool.getConnection(function(err, connection){
			if(err){
				console.log('失败')
			}else{
				var param = req.query || req.params;
				connection.query(sql.getPayReal,[param.startDate,param.endDate],function(err,result){
					if(err){
						console.log(err,'查询失败')
					}else{
						console.log('查询成功')
						result = {
							data:result,
							code:'1'
						}
						// 已json形式把操作结果传给前台页面
						jsonWrite(res, result);
						// 释放连接
						connection.release();
					}
				})
			}
		})
	}
}

