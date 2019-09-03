var dbController = require('./DBController_public');
var utils = require('./utils');
var CONFIG = require('./Config');
var logSystem = require("./logController");

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
                utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.LOGIN_FAIL, "msg": "该用户不存在"});
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
                    await logSystem.addLog(result[0].username, 0, "用户登陆");
                    utils.sendResponse(res, 200, {"errorCode": 0, "msg": "登录成功", "data": { "token" : token}});
                } catch(error) {
                    utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.LOGIN_FAIL, "msg": "该用户已登录"});
                }
            }
        } catch(error) {
            console.error(error);
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.LOGIN_FAIL, "msg": "select语句出错"});
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
            await logSystem.addLog(req.query.token.split('_')[1], 0, `新建用户：${req.body.username}`);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "注册成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.REGIST_FAIL, "msg": "用户名重复"});
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
            await logSystem.addLog(req.query.token.split('_')[1], 0, `更新用户：${req.body.username}`);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "更新信息成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.UPDATE_USER_FAIL, "msg": "更新信息失败"});
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
            await logSystem.addLog(req.query.token.split('_')[1], 0, `删除用户：${req.body.username}`);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "删除用户成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.DELETE_USER_FAIL, "msg": "删除用户失败"});
        }
    },

    this.userChangePassword = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "update";
        stru["tables"] = "userInfo";
        stru["data"] = {
            "password": req.body.new
        };
        stru["where"]["condition"] = [
            "username = " + dbController.typeTransform(req.body.username),
            "password = " + dbController.typeTransform(req.body.old),
        ];

        let stru1 = dbController.getSQLObject();
        stru1["query"] = "select";
        stru1["tables"] = "userInfo";
        stru1["data"] = {
            "*": 0
        };
        stru1["where"]["condition"] = [
            "username = " + dbController.typeTransform(req.body.username),
            "password = " + dbController.typeTransform(req.body.old),
        ];

        try {
            let result = await dbController.ControlAPI_obj_async(stru1);
            if (result && result.length == 0) {
                utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.UPDATE_USER_FAIL, "msg": "用户名与旧密码不相符"});
                return;
            }
            await dbController.ControlAPI_obj_async(stru);
            await logSystem.addLog(req.query.token.split('_')[1], 0, `更新用户密码：${req.body.username}`);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "更新用户密码成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.UPDATE_USER_FAIL, "msg": "更新用户密码失败"});
        }
    },

    this.userForcedOffline = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "delete";
        stru["tables"] = "loginRecord";
        stru["where"]["condition"] = [
            "username = " + dbController.typeTransform(req.body.username)
        ];

        try {
            await dbController.ControlAPI_obj_async(stru);
            await logSystem.addLog(req.query.token.split('_')[1], 0, `强制下线用户：${req.body.username}`);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "强制下线成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.DELETE_USER_FAIL, "msg": "强制下线失败"});
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
            "ifnull(loginRecord.modifyTime, 0) as lastLogin": 0
        };
        try {
            let result = await dbController.ControlAPI_obj_async(stru);
            if(result.length == 0){
                utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.GET_USER_FAIL, "msg": "当前系统无用户信息"});
            } else {
                utils.sendResponse(res, 200, {"errorCode": 0, "msg": "查询用户状态成功", "data": result});
            }
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.GET_USER_FAIL, "msg": "无法查询用户信息"});
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
            await logSystem.addLog(req.query.token.split('_')[1], 0, `用户登出`);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "退出登录成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.LOGOUT_FAIL, "msg": "退出登录失败"});
        }
    },

    this.userLoginCheck = async (req, res, next) => {
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
                utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.LOGINCHECK_FAIL, "msg": "请先登录"});
                return;
            } else {
                next();
            }
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.LOGINCHECK_FAIL, "msg": "请先登录"});
        }
    },
    
    this.userPermissionCheck = (req, res, next) => {
        let token = req.query.token;
        var [type, name, time] = token.split("_");
        if(type == CONFIG.UserType.admin) {
            next();
        } else {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.PERMISSION_FAIL, "msg": "没有权限"});
        }
    }
};


module.exports = new userSystem();