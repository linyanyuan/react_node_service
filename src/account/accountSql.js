var account = {
	// 登入
	queryAccount:'INSERT INTO daycost (type,time,date,message,pay,typeName) VALUES (?,?,?,?,?,?);',
    deleteAccount:'DELETE FROM daycost WHERE typeId=?'
}
module.exports = account;