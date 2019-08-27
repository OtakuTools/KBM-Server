var dbController = require('./DBController_public');
var utils = require('./utils');
var CONFIG = require('./Config');

var logSystem = function() {

    this.version = "1.0.0",

    this.addLog = async (user, type, content) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "insert";
        stru["tables"] = "log";
        stru["data"] = {
            "username" : user,
            "type" : type,
            "content" : content
        };

        try {
            await dbController.ControlAPI_obj_async(stru);
            return true;
        } catch(error) {
            return false;
        }
    },

    this.getLog = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "select";
        stru["tables"] = "log";
        stru["data"] = {
            "COUNT(*)" : 0
        };
        let searchBy_items = [];
        let searchOption_items = {};
        if(req.query.username) {
            searchBy_items.push("username = " + dbController.typeTransform(req.query.username));
        }
        if(req.query.type) {
            searchBy_items.push("type = " + dbController.typeTransform(req.query.type));
        }
        stru["where"]["condition"] = searchBy_items;
        let total = 0;
        try {
            let result = await dbController.ControlAPI_obj_async(stru);
            total = result[0]["COUNT(*)"];
        } catch (error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.GET_LOG_FAIL, "msg": "无法查询操作日志"});
        }
        stru["data"] = {
            "*" : 0
        };
        let orderStr = "modifyTime ";
        if(req.query.sortOrder) {
			orderStr += (req.query.sortOrder && req.query.sortOrder == "asc") ? "ASC" : "DESC";
        }
        searchOption_items["order by"] = orderStr;
        if(req.query.page && req.query.pageSize) {
            searchOption_items["limit"] =  (req.query.page-1) * req.query.pageSize + "," + req.query.pageSize;
        }
        stru["options"] = searchOption_items;

        try {
            let result = await dbController.ControlAPI_obj_async(stru);
            utils.sendResponse(res, 404, {"errorCode": 0, "msg": "", "data" : { "count": total, "content": result}});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.GET_LOG_FAIL, "msg": "无法查询操作日志"});
        }
    }
};


module.exports = new logSystem();