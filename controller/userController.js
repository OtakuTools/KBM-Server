var dbController = require('./DBController_public');
var utils = require('./utils');

var userSystem = function() {

    this.version = "1.0.0",

    this.generatorToken = (username, type) => {
        return type + "_" + username + "_" + utils.getTimestamp();
    }

    this.userLogin = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "select";
        stru["tables"] = "userInfo";
        stru["data"] = {
            "*": 0
        };
        stru["where"]["condition"] = [
            "username = " + dbController.typeTransform(req.body.username),
            "password = " + dbController.typeTransform(req.body.password)
        ];

        try {
            let result = await dbController.ControlAPI_obj_async(stru);
            if(result.length == 0){
                utils.sendResponse(res, 404, {"errorCode": 101, "msg": "该用户不存在"});
            } else {
                let token = this.generatorToken(result[0].username, result[0].type);
                stru["query"] = "insert";
                stru["tables"] = "loginRecord";
                stru["data"] = {
                    "token": token,
                    "username": result[0].username
                };
                try {
                    await dbController.ControlAPI_obj_async(stru);
                    utils.sendResponse(res, 200, {"errorCode": 0, "msg": "登录成功", "data": { "token" : token}});
                } catch(error) {
                    utils.sendResponse(res, 404, {"errorCode": 101, "msg": "该用户已登录"});
                }
            }
        } catch(error) {
            console.error(error);
            utils.sendResponse(res, 404, {"errorCode": 101, "msg": "select语句出错"});
        }
    },

    this.userRegist = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "insert";
        stru["tables"] = "userInfo";
        stru["data"] = {
            "username" : req.body.username,
            "password" : req.body.password,
            "type" : req.body.type
        };

        try {
            await dbController.ControlAPI_obj_async(stru);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "注册成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": 102, "msg": "用户名重复"});
        }
    },

    this.userUpdate = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "update";
        stru["tables"] = "userInfo";
        stru["data"] = {
            "password" : req.body.password,
            "type" : req.body.type
        };
        stru["where"]["condition"] = [
            "username = " + dbController.typeTransform(req.body.username)
        ];

        try {
            await dbController.ControlAPI_obj_async(stru);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "更新信息成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": 103, "msg": "更新信息失败"});
        }
    },

    this.userDelete = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "delete";
        stru["tables"] = "userInfo";
        stru["where"]["condition"] = [
            "username = " + dbController.typeTransform(req.body.username)
        ];

        try {
            await dbController.ControlAPI_obj_async(stru);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "删除用户成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": 104, "msg": "删除用户失败"});
        }
    },

    this.userGetInfo = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "select";
        stru["tables"] = "userInfo left join loginRecord on userInfo.username = loginRecord.username";
        stru["data"] = {
            "userInfo.username as username": 0,
            "userInfo.type as type": 0,
            "isnull(loginRecord.token) as status": 0,
            "ifnull(loginRecord.modifyTime, 0) as time": 0
        };
        try {
            let result = await dbController.ControlAPI_obj_async(stru);
            if(result.length == 0){
                utils.sendResponse(res, 404, {"errorCode": 105, "msg": "当前系统无用户信息"});
            } else {
                utils.sendResponse(res, 200, {"errorCode": 0, "msg": "查询用户状态成功", "data": { "info" : result}});
            }
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": 105, "msg": "无法查询用户信息"});
        }
    },

    this.userLogout = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "delete";
        stru["tables"] = "loginRecord";
        stru["where"]["condition"] = [
            "token = " + dbController.typeTransform(req.query.token)
        ];
        try {
            await dbController.ControlAPI_obj_async(stru);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "退出登录成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": 106, "msg": "退出登录失败"});
        }
    },

    this.userCheck = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "select";
        stru["tables"] = "loginRecord";
        stru["data"] = {
            "*": 0
        }; 
        stru["where"]["condition"] = [
            "token = " + dbController.typeTransform(req.query.token)
        ];

        try {
            let result = await dbController.ControlAPI_obj_async(stru);
            if(result.length == 0){
                utils.sendResponse(res, 404, {"errorCode": 100, "msg": "请先登录"});
                return;
            } else {
                next();
            }
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": 100, "msg": "请先登录"});
        }
    }
};


module.exports = new userSystem();