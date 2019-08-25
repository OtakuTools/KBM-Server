var dbController = require('./DBController_public');
var utils = require('./utils');
var CONFIG = require('./Config');

var infoSystem = function() {

    this.version = "1.0.0",

    this.addInfo = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "insert";
        stru["tables"] = "knowledge";
        stru["data"] = {
            "sequence" : req.body.sequence,
            "department": req.body.department,
			"applicant" : req.body.applicant,
            "knowledgeType" : req.body.knowledgeType,
			"discoverTime" : req.body.discoverTime,
            "resolveTime" : req.body.resolveTime,
            "lastfor" : req.body.lastfor,
			"kTitle" : req.body.kTitle,
			"kContent" : req.body.kContent,
			"kMethod" : req.body.kMethod,
			"curStatus" : 0
        };
        try {
            await dbController.ControlAPI_obj_async(stru);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "新建知识成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.INSERT_DATA_FAIL, "msg": "新建知识失败"});
        }
    },

    this.modifyInfo = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "update";
        stru["tables"] = "knowledge";
        stru["data"] = {
            "department": req.body.department,
			"applicant" : req.body.applicant,
            "knowledgeType" : req.body.knowledgeType,
			"discoverTime" : req.body.discoverTime,
            "resolveTime" : req.body.resolveTime,
            "lastfor" : req.body.lastfor,
			"kTitle" : req.body.kTitle,
			"kContent" : req.body.kContent,
            "kMethod" : req.body.kMethod,
            "curStatus": req.body.curStatus
        };
        stru["where"]["condition"] = [
            "sequence = " + dbController.typeTransform(req.body.sequence)
        ];
        try {
            await dbController.ControlAPI_obj_async(stru);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "修改知识成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.UPDATE_DATA_FAIL, "msg": "修改知识失败"});
        }
    },

    this.modifyInfoStatus = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "update";
        stru["tables"] = "knowledge";
        stru["data"] = {
            "curStatus": req.body.curStatus
        };
        stru["where"]["condition"] = [
            "sequence = " + dbController.typeTransform(req.body.sequence)
        ];
        try {
            await dbController.ControlAPI_obj_async(stru);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "修改知识成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.UPDATE_DATA_FAIL, "msg": "修改知识失败"});
        }
    },

    this.deleteInfo = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "delete";
        stru["tables"] = "knowledge";
        stru["where"]["condition"] = [
            "sequence = " + dbController.typeTransform(req.query.sequence)
        ];
        try {
            await dbController.ControlAPI_obj_async(stru);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "删除知识成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.DELETE_DATA_FAIL, "msg": "删除知识失败"});
        }
    },

    this.getInfo = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "select";
        stru["tables"] = "knowledge";
        stru["data"] = {
            "*" : 0
        };
        stru["where"]["condition"] = [
            "sequence = " + dbController.typeTransform(req.query.sequence)
        ];
        try {
            let result = await dbController.ControlAPI_obj_async(stru);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "", "data": result});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.SELECT_DATA_FAIL, "msg": "获取知识失败"});
        }
    },

    this.searchInfo = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "select";
        stru["tables"] = "knowledge";
        stru["data"] = {
            "COUNT(*)" : 0
        };
        let total = 0;
        let searchBy_items = [];
        if(req.query.department) {
            searchBy_items.push("department = " +  dbController.typeTransform(req.query.department))
        }
        if(req.query.applicant) {
            searchBy_items.push("applicant = " +  dbController.typeTransform(req.query.applicant))
        }
        stru["where"]["condition"] = searchBy_items;
        try {
            let result = await dbController.ControlAPI_obj_async(stru);
            total = result[0]["COUNT(*)"];
        } catch (error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.SEARCH_DATA_FAIL, "msg": "查找知识失败 " + error})
            return;
        }

        stru["data"] = {
            "*" : 0
        };
        let searchOption_items = {};
        let orderStr = "sequence ";
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
			utils.sendResponse(res, 200, {"errorCode": 0, "msg": "", "data" : { "count": total, "content" : result}});
		} catch(error) {
			utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.SEARCH_DATA_FAIL, "msg": "查找知识失败 " + error})
		}
    },

    this.getSeq = async (req , res, next) => {
        let today = utils.getDate();
        let stru = dbController.getSQLObject();
        stru["query"] = "insert";
        stru["tables"] = "seqRecord";
        stru["data"] = {
            "day": today,
            "seq": 1
        };

        let stru1 = dbController.getSQLObject();
        stru1["query"] = "select";
        stru1["tables"] = "seqRecord";
        stru1["data"] = {
            "day": 0,
            "seq": 0
        };
        stru1["where"]["condition"] = [
            "day = " + dbController.typeTransform(today)
        ];

        let stru2 = dbController.getSQLObject_sv();
        stru2["sql"] = `update seqRecord set seq = seq + 1 where day = '${today}';`;
        try {
            await dbController.ControlAPI_obj_async(stru);
        } catch(error) {
            console.error("当前日期已存在");
        }

        try {
            let result = await dbController.ControlAPI_obj_async(stru1);
            try {
                await dbController.ControlAPI_str_async(stru2);
                utils.sendResponse(res, 200, {"errorCode": 0, "msg": "", "data": result[0]});
            } catch (error) {
                utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.GET_SEQ_FAIL, "msg": "更新序号失败"});
            }
        } catch (error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.GET_SEQ_FAIL, "msg": "获取序号失败"});
        }
    },

    this.userPermissionCheck = (req, res, next) => {
        let token = req.query.token;
        var [type, name, time] = token.split("_");
        if(type == CONFIG.UserType.dataEntry || type == CONFIG.UserType.manager || type == CONFIG.UserType.kbAdmin) {
            next();
        } else {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.PERMISSION_FAIL, "msg": "没有权限"});
        }
    }
};


module.exports = new infoSystem();