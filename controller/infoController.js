var dbController = require('./DBController_public');
var utils = require('./utils');
var CONFIG = require('./Config');
var logSystem = require("./logController");

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
        if (req.body.author) {
            stru["data"]["author"] = req.body.author;
        }
        if (req.body.auditor) {
            stru["data"]["auditor"] = req.body.auditor;
        }
        try {
            await dbController.ControlAPI_obj_async(stru);
            await logSystem.addLog(req.query.token.split('_')[1], 1, `新建知识：${req.body.sequence}`);
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
        if (req.body.author) {
            stru["data"]["author"] = req.body.author;
        }
        if (req.body.auditor) {
            stru["data"]["auditor"] = req.body.auditor;
        }
        stru["where"]["condition"] = [
            "sequence = " + dbController.typeTransform(req.body.sequence)
        ];
        try {
            await dbController.ControlAPI_obj_async(stru);
            await logSystem.addLog(req.query.token.split('_')[1], 1, `修改知识：${req.body.sequence}`);
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
            "curStatus": req.body.curStatus,
        };
        if (req.body.author) {
            stru["data"]["author"] = req.body.author;
        }
        if (req.body.auditor) {
            stru["data"]["auditor"] = req.body.auditor;
        }
        stru["where"]["condition"] = [
            "sequence = " + dbController.typeTransform(req.body.sequence)
        ];
        try {
            await dbController.ControlAPI_obj_async(stru);
            await logSystem.addLog(req.query.token.split('_')[1], 1, `修改知识 ${req.body.sequence} 状态至 ${req.body.curStatus}`);
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "修改知识状态成功"});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.UPDATE_DATA_FAIL, "msg": "修改知识状态失败"});
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
            await logSystem.addLog(req.query.token.split('_')[1], 1, `删除知识：${req.query.sequence}`);
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

    this.searchInfoCount = async (req, res, next) => {
        let stru = dbController.getSQLObject();
        stru["query"] = "select";
        stru["tables"] = "knowledge";
        stru["data"] = {};

        if (req.body.data) {
            for (let i = 0; i < req.body.data.length; i++) {
                let queryStr = [];
                let q = req.body.data[i].split("&");
                for (let j = 0; j < q.length; j++) {
                    let [key, value] = q[j].split("=");
                    if (key == "status") {
                        let statusArr = value.split(",").map(e => `curStatus=${e}`);
                        queryStr.push(`(${statusArr.join(" or ")})`);
                    } else if (key == "author") {
                        queryStr.push(`(author=\'${value}\')`);
                    }
                }
                stru["data"][`COUNT((${queryStr.join(' and ')}) or null) as ${"op"+(i+1)}`] = 0;
            }
        }
        try {
            let result = await dbController.ControlAPI_obj_async(stru);
            let arr = [];
            for (var key in result[0]){
                arr.push(result[0][key]);
            }
            utils.sendResponse(res, 200, {"errorCode": 0, "msg": "", "data" : arr});
        } catch(error) {
            utils.sendResponse(res, 404, {"errorCode": CONFIG.ErrorCode.SEARCH_DATA_FAIL, "msg": "查找知识数量失败 " + error})
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
        if (req.query.department) {
            searchBy_items.push("department LIKE " +  dbController.typeTransform(`%${req.query.department}%`));
        }
        if (req.query.applicant) {
            searchBy_items.push("applicant LIKE " +  dbController.typeTransform(`%${req.query.applicant}%`));
        }
        if (req.query.kTitle) {
            searchBy_items.push("kTitle LIKE " +  dbController.typeTransform(`%${req.query.kTitle}%`));
        }
        if (req.query.timeInterval) {
            let [start, end] = req.query.timeInterval.split(",");
            searchBy_items.push(`(
                (discoverTime >= ${dbController.typeTransform(start)} and discoverTime <= ${dbController.typeTransform(end)}) 
                or
                (resolveTime >= ${dbController.typeTransform(start)} and resolveTime <= ${dbController.typeTransform(end)})
            )`);
        }
        if (req.query.current) {
            let [start, end] = req.query.current.split(",");
            searchBy_items.push(`(
                FROM_UNIXTIME(modifyTime, 'YYYY-MM-DD') >= ${dbController.typeTransform(start)} and FROM_UNIXTIME(modifyTime, 'YYYY-MM-DD') <= ${dbController.typeTransform(end)}
            )`);
        }
        if (req.query.status) {
            let statusArr = req.query.status.split(",").map(e => `curStatus=${e}`);
            searchBy_items.push(`(${statusArr.join(" or ")})`);
            let [type, name, t] = req.query.token.split("_");
            if (type == CONFIG.UserType.dataEntry && parseInt(req.query.status) <= CONFIG.Status.SUBMIT_SUCC) {
                searchBy_items.push("author = " +  dbController.typeTransform(name))
            } else if (type == CONFIG.UserType.manager && parseInt(req.query.status) < CONFIG.Status.SUBMIT_SUCC) {
                searchBy_items.push("author = \'\'")
            }
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
