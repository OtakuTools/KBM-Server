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

    UserType : {
        admin : "admin", // 系统管理员
        manager : "manager", // 审计经理
        dataEntry : "dataentry", // 录入员
        kbAdmin : "kbAdmin" // 知识库管理员
    }
};

module.exports = CONFIG;