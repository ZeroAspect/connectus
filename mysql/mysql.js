const mysql = require("mysql2")

function MySQLConnect(){
    const connect = mysql.createPool("mysql://root:TuWIXKMPtamgkVuONTHnnOUgmosFAdLy@roundhouse.proxy.rlwy.net:26427/railway")
    const pool = connect.promise()
    return pool
}

module.exports = MySQLConnect