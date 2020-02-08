var mysql = require('mysql');
var config = require('../conf/db.js');
var utils = require('../utils/util.js');
var sql = require('./loginsql.js');
var accountSql = require('../src/account/accountSql.js');// 记账sql
//使用mysql 连接池
var pool = mysql.createPool(utils.extend({}, config.mysql));

// 向前台返回json方法
var jsonWrite = function (res, req) {
	if (typeof req === 'undefined') {
		res.json({
			code: '1',
			meg: '操作失败'
		})
	} else {
		res.json(req)
	}
}
// query
const querySql = function ($sql, $opt) {
	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log("连接失败");
			} else {
				connection.query($sql, $opt, function (err, result) {
					if (err) {
						reject(err)
					} else {
						resolve(result);
						connection.release();
					}
				})
			}
		})
	})
}
module.exports = {
	login: function (req, res, next) {
		// console.log(req)
		pool.getConnection(function (err, connection) {
			console.log(err, connection)
			if (err) {
				console.log(err, "建立连接失败")
			} else {
				console.log("建立连接成功")
				// 获取前台传过来的参数
				var param = req.query || req.params;
				// 建立连接，请求登录
				// var sqlStr = 'SELECT * FROM userinfo WHERE `username` = '+param.username+' AND `password` = '+param.password+''
				connection.query(sql.login, [param.username, param.password], function (err, result) {
					if (err) {
						console.log("查询失败", err)
					} else {
						console.log("查询成功", result)
						if (result && result.length !== 0) {
							result = {
								code: '1',
								msg: '登录成功'
							};
						} else {
							result = {
								code: '0',
								msg: '账号或密码错误'
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
	getPayReal: function (req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log('失败')
			} else {
				var param = req.query || req.params;
				connection.query(sql.getPayReal, [param.startDate, param.endDate], function (err, result) {
					if (err) {
						console.log(err, '查询失败')
					} else {
						console.log('查询成功')
						result = {
							data: result,
							code: '1'
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
	// 记账接口
	queryAccount: function (req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log('连接失败')
			} else {
				var param = req.body || req.params;
				connection.query(accountSql.queryAccount,
					[param.type, param.time, param.date, param.message, param.pay, param.typeName],
					function (err, result) {
						if (err) {
							console.log(err, '记账失败')
						} else {
							console.log('记账成功')
							result = {
								msg: '记账成功',
								code: '1'
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
	// 删除一条
	deleteAccount: function (req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log('失败')
			} else {
				var param = req.query || req.params;
				connection.query(accountSql.deleteAccount,
					[param.typeId],
					function (err, result) {
						if (err) {
							console.log(err, '查询失败')
						} else {
							console.log('查询成功')
							result = {
								msg: '删除成功',
								code: '1'
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
	// 更新一条
	updateAccount: function (req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log('失败');
			} else {
				var param = req.query || req.params;
				connection.query(accountSql.updateAccount,
					[param.type, param.time, param.date, param.message, param.pay, param.typeName, param.typeId],
					function (err, result) {
						if (err) {
							console.log('修改失败');
						} else {
							console.log('修改成功');
							result = {
								msg: '修改成功',
								code: '1'
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
	// 获取统计接口
	queryStatistics: async function (req, res, next) {
		let thisMonth = await querySql(accountSql.queryMonth, []);
		let thisMonthTotal = await querySql(accountSql.queryMonthTotal);
		let lastMonthTotal = await querySql(accountSql.queryMonthLast);
		// thisMonth = jsonWrite(res, thisMonth);
		let Chain = Number(thisMonthTotal[0].payTotal) - Number(lastMonthTotal[0].lastPayTotal); //环比
		// TODO: 这里先用js处理 没用sql语句查询
		let result = {
			code: '1',
			data: {
				chain: Chain,//环比
				thisMonthTotal: thisMonthTotal[0].payTotal,//本月总金额
				thisMonthData: thisMonth//本月数据
			}
		}
		jsonWrite(res, result);

	}
}

