var mysql = require('mysql');
var fs = require('fs');
var async = require("async");

var configConnectionFile = "./database/Config/configConnection.json";
var dbInfoMode = JSON.parse(fs.readFileSync(configConnectionFile));
var configTableFile = "./database/Config/configTable.json";
var {tableInfo} = JSON.parse(fs.readFileSync(configTableFile));
var connection = undefined;

var dbInfo = dbInfoMode[dbInfoMode["default"]];

function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }
    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);
	
    connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect();
  });
}

var database = {
    tableDelete : function(){
        try {
            connection.query("DROP TABLE IF EXISTS userInfo;", function(error, results, fields){
                if (error) {
                    throw error;
                }
            });
        }
        catch(err){
            console.error(err);
        }
    },

    tableInit : async function(){
        try {
			
            connection = mysql.createConnection({
                host     : dbInfo.host,
                user     : dbInfo.user,
                password : dbInfo.password,
                port     : dbInfo.port
            });
			
			await new Promise((resolve, reject)=>{
				connection.query('CREATE DATABASE IF NOT EXISTS '+dbInfo.database+' character set utf8', async function(error, results, fields){
					if(error){
						reject(error);
						return;
					}
					connection = mysql.createConnection({
						host     : dbInfo.host,
						user     : dbInfo.user,
						password : dbInfo.password,
						port     : dbInfo.port,
						database : dbInfo.database,
						timezone : dbInfo.timezone
					});

					connection.query("SET NAMES UTF8;", function(error, results, fields){
						if(error){
							reject(error);
							return;
						}
					});
					
					for(let i = 0; i < tableInfo.length; i++){
						await new Promise((resolve, reject) => {
							connection.query(tableInfo[i].join(""), function(error, results, fields){
								if(error){
									reject(error);
									return;
								}
								resolve();
								return;
							});
						}).catch((error) => {console.log(error);});
					}
					console.log("SUCCESS: create database successfully!");
					resolve();
					return;
				});
			}).catch((error)=>{
				console.error(error);
			});
		}
		catch(err){
            console.error("ERROR: " + err);
            return;
        }
    },
	
    dataBaseControl: function(sql, args, callback){
        // console.log(sql);
        if(args == null || args.length == 0){
            connection.query(sql, function(error, results, fields){
                if(error){
                    console.error(error);
                    callback(null);
                    return;
                }
                callback(results);
            });
        }
        else{
            connection.query(sql, args, function(error, results, fields){
                if(error){
                    console.error(error);
                    callback(null);
                    return;
                }
                // console.log(results)
                // console.log(callback)
                callback(results);
            });
        }
    },

    execTrans(sqlparamsEntities, callback) {
        connection.beginTransaction(function (err) {
            if (err) {
                return callback(err, null);
            }
            console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
            var funcAry = [];
            sqlparamsEntities.forEach(function (sql_param) {
                var temp = function (cb) {
                    var sql = sql_param.sql;
                    var param = sql_param.value;
                    connection.query(sql, param, function (tErr, rows, fields) {
                        if (tErr) {
                            connection.rollback(function () {
                                console.log("事务失败，" + sql_param + "，ERROR：" + tErr);
                                throw tErr;
                            });
                        } else {
                            return cb(null, rows);
                        }
                    })
                };
                funcAry.push(temp);
            });

            async.series(funcAry, function (err, result) {
                console.log("transaction error: " + err);
                if (err) {
                    connection.rollback(function (err) {
                        console.log("transaction error: " + err);
                        // connection.release();
                        return callback(err, null);
                    });
                } else {
                    connection.commit(function (err, info) {
                        console.log("transaction info: " + JSON.stringify(info));
                        if (err) {
                            console.log("执行事务失败，" + err);
                            connection.rollback(function (err) {
                                console.log("transaction error: " + err);
                                // connection.release();
                                return callback(err, null);
                            });
                        } else {
                            // connection.release();
                            console.log(result);
                            return callback(null, result);
                        }
                    })
                }
            })
        });
    }
};

database.tableInit();
handleDisconnect(connection);
module.exports = database;
