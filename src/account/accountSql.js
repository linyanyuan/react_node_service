var account = {
	// 记账
	queryAccount:'INSERT INTO daycost (type,time,date,message,pay,typeName) VALUES (?,?,?,?,?,?);',
	deleteAccount:'DELETE FROM daycost WHERE typeId=?',//删除
	updateAccount:'UPDATE daycost SET type=?,time=?,date=?,message=?,pay=?,typeName=? WHERE typeId=?',//修改
	queryMonth:"SELECT * from daycost WHERE DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE(),'%Y%m')",//获取本月
	queryMonthTotal:"SELECT SUM(pay) AS payTotal FROM daycost WHERE DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE(),'%Y%m')",//获取本月总金额
	queryMonthLast:"SELECT SUM(pay) AS lastPayTotal FROM daycost WHERE PERIOD_DIFF(date_format(NOW(),'%Y%m'),DATE_FORMAT(date,'%Y%m')) = 1",//获取上月总金额
}
module.exports = account;