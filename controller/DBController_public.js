var database = require('./../database/DataBaseMySQL');

var dbController = function() {
	
	this.version = "2.0.0";
	
	this.updateLog = `
		1. 更新通用接口函数
		2. 设计通用数据库结构体
	`;
	
	// 字段类型转换
	this.typeTransform = function(data){
		return typeof(data) === "string"? "\'" + data + "\'" : data;
	};
	
	// 返回数据库结构体
	this.getSQLObject = function(){
		return {
			// select/update/delete/insert
			"query": "select",
			// table name
			"tables": "",
			"data":{
				// for select, use ("key": anything)
				// for others, use ("key": value)
			},
			"where": {
				// and / or / not / ""
				"type": "and",
				"condition": []
			},
			// options
			"options": {
				"group by": "",
				"order by": ""
			}
		};
	};
	
	this.getSQLObject_sv = function(){
		return {
			"sql": "",
			"value": []
		};
	};
	
	// 解析数据库结构体
	this._structureAnalysis = function(sqlObj) {
		let dataKey = [], dataValue = [];
		let optionKey = [];
		let whereSql = "";
		let hasWhere = false;
		for(var key in sqlObj["data"]){
			if(sqlObj["query"] == 'update'){
				dataKey.push([key, "?"].join("="));
			}
			else{
				dataKey.push(key);
			}
			dataValue.push(sqlObj["data"][key]);
		}
		hasWhere = sqlObj["where"]["condition"].length == 0? false : true;
		whereSql = "where " + sqlObj["where"]["condition"].join(` ${sqlObj["where"]["type"]} `);
		for(var key in sqlObj["options"]){
			if(sqlObj["options"][key] && sqlObj["options"][key] != ""){
				optionKey.push([key, sqlObj["options"][key]].join(" "));
			}
		}

		let sql = {
			"update" : `update ${sqlObj["tables"]} set ${dataKey.join(",")} ${hasWhere? whereSql : ""};`,
			"select" : `select ${dataKey.join(",")} from ${sqlObj["tables"]} ${hasWhere? whereSql : ""} ${optionKey.join(" ")};`,
			"delete" : `delete from ${sqlObj["tables"]} ${hasWhere? whereSql : ""};`,
			"insert" : `insert into ${sqlObj["tables"]} (${dataKey.join(",")}) values(${dataKey.fill('?').join(",")});`
		}
		
		let result = this.getSQLObject_sv();
		result["sql"] = sql[sqlObj["query"]];
		result["value"] = sqlObj["query"] == "select"? [] : dataValue;
		console.log(result);
		return result;
	};
	
	// sql是语句，args是参数，callback回调函数
	this._generalOperation = function(sql, args, callback) {
		database.dataBaseControl(sql, args, callback);
	};
	
	this.ControlAPI_str = function(data, callback){
		this._generalOperation(data["sql"], data["value"], callback);
	};

	this.ControlAPI_obj = function(data, callback){
		var sqlObj = this._structureAnalysis(data);
		this._generalOperation(sqlObj["sql"], sqlObj["value"], (result)=>{
			if(result == null || result.length == 0){
				callback(null);
			}
			else{
				callback(result);
			}
		});
	};
	
	this.ControlAPI_obj_async = function(data) {
		var sqlObj = this._structureAnalysis(data);
		return new Promise((resolved, rejected)=>{
			this._generalOperation(sqlObj["sql"], sqlObj["value"], (result)=>{
				if(result === null){
					rejected(null);
				}
				else{
					resolved(result);
				}
			});
		});
	}
	
	this.ControlAPI_objs_async = function(...vars) {
		let len = vars.length;
		let promiseList = [];
		for(let i = 0; i < len; i++){
			let sqlObj = this._structureAnalysis(vars[i]);
			promiseList.push(new Promise((resolved, rejected)=>{
				this._generalOperation(sqlObj["sql"], sqlObj["value"], (result)=>{
					if(result === null){
						rejected(null);
					}
					else{
						resolved(result);
					}
				});
			}));
		}
		return Promise.all(promiseList);
	}
};

module.exports = new dbController();