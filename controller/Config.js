var CONFIG = {
    ErrorCode : {
        GET_LOG_FAIL: 1,
        PERMISSION_FAIL: 233,

        LOGINCHECK_FAIL: 100,
        LOGIN_FAIL: 101,
        REGIST_FAIL: 102,
        UPDATE_USER_FAIL: 103,
        DELETE_USER_FAIL: 104,
        GET_USER_FAIL: 105,
        LOGOUT_FAIL: 106,

        INSERT_DATA_FAIL: 201,
        UPDATE_DATA_FAIL: 202,
        DELETE_DATA_FAIL: 203,
        SELECT_DATA_FAIL: 204,
        SEARCH_DATA_FAIL: 205,
        GET_SEQ_FAIL: 206,
    },

    Status: {
        CREATE_SUCC: 0,  // 新建
        MODIFY_SUCC: 1,  // 修改
        SUBMIT_SUCC: 2,  // 提交申请
        AUDIT_SUCC: 3,   // 审批
        INBOUND_SUCC: 4, // 入库
        DELETE_SUCC: 5,  // 移库

        CREATE_FAIL: 10,
        MODIFY_FAIL: 11,
        SUBMIT_FAIL: 12,
        AUDIT_FAIL: 13,
        INBOND_FAIL: 14,
        DELETE_FAIL: 15
    },

    UserType : {
        admin : "admin", // 系统管理员
        manager : "manager", // 审计经理
        dataEntry : "dataentry", // 录入员
        kbAdmin : "kbAdmin" // 知识库管理员
    }
};

module.exports = CONFIG;