var logins = {
	// 登入
	login:'select * from userInfo where `username` = ? and `password` = ?',
	getPayReal:'SELECT time,type,pay,date,message,typeId FROM daycost WHERE date BETWEEN ? AND ? ORDER BY date'//获取本月支出详情
}
module.exports = logins;