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
			"kTitle" : req.nody.kTitle,
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
			"kTitle" : req.nody.kTitle,
			"kContent" : req.body.kContent,
			"kMethod" : req.body.kMethod,
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
            "*" : 0
        };
        let searchBy_items = [];
        if(req.query.department) {
            searchBy_items.push("department = " +  dbController.typeTransform(req.query.department))
        }
        if(req.query.applicant) {
            searchBy_items.push("applicant = " +  dbController.typeTransform(req.query.applicant))
        }
        let searchOption_items = {};
        let orderStr = "sequence ";
        
        if(req.query.page && req.query.pageSize) {
            searchOption_items["limit"] =  (req.query.page-1) * req.query.pageSize + "," + req.query.pageSize;
        }
        if(req.query.sortOrder) {
			orderStr += (req.query.sortOrder && req.query.sortOrder == "asc") ? "ASC" : "DESC";
        }
        searchOption_items["order by"] = orderStr;

        stru["where"]["condition"] = searchBy_items;
        stru["options"] = searchOption_items;

        try{
			let result = await db.ControlAPI_obj_async(strc);
			utils.sendResponse(res, 200, {"errorCode": 0, "msg": "", "data" : { "count": result.length, "content" : result}});
		}
		catch(error){
			utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.SEARCH_DATA_FAIL, "msg": "查找知识失败"})
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