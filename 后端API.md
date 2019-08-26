### 后端API

```javascript
/**
 * User部分
 */

/**
 * POST user/login
 */
// ======== Send =======
{
    username: string,
    password: string
}
// ======== Recieve =======
{
    errorCode: int
    msg: string
    data: object
}

/**
 * POST user/regist
 */
// ======== Send =======
{
    username: string,
    password: string,
    type: string
}
// ======== Recieve =======
{
    errorCode: int
    msg: string
}

/**
 * POST user/update?token=xxxxx
 */
// ======== Send =======
{
    username: string,
    password: string,
    type: string
}
// ======== Recieve =======
{
    errorCode: int
    msg: string
}

/**
 * POST user/delete?token=xxxxx
 */
// ======== Send =======
{
    username: string
}
// ======== Recieve =======
{
    errorCode: int
    msg: string
}

/**
 * POST user/offline?token=xxxxx
 */
// ======== Send =======
{
    username: string
}
// ======== Recieve =======
{
    errorCode: int
    msg: string
}

/**
 * GET user/logout?token=xxxx
 */
// ======== Send =======

// ======== Recieve =======
{
    errorCode: int
    msg: string
}

/**
 * GET user/information?token=xxxx
 * 查询所有用户
 */
// ======== Send =======

// ======== Recieve =======
{
    errorCode: int
    msg: string,
    data: object
}

/**
 * Info部分
 */

/**
 * POST info/add?token=xxxx
 */
// ======== Send =======
{
    "sequence" : string,
    "department": string,
    "applicant" : string,
    "knowledgeType" : string,
    "discoverTime" : string,
    "resolveTime" : string,
    "lastfor" : string,
    "kTitle" : string,
    "kContent" : string,
    "kMethod" : string,
    "author": string
}
// ======== Recieve =======
{
    errorCode: int
    msg: string
}

/**
 * POST info/modify?token=xxxx
 */
// ======== Send =======
{
    "sequence" : string,
    "department": string,
    "applicant" : string,
    "knowledgeType" : string,
    "discoverTime" : string,
    "resolveTime" : string,
    "lastfor" : string,
    "kTitle" : string,
    "kContent" : string,
    "kMethod" : string,
    "author": string
}
// ======== Recieve =======
{
    errorCode: int
    msg: string
}

/**
 * POST info/updateStatus?token=xxxx
 */
// ======== Send =======
{
    "curStatus" : int,
    "auditor": string
}
// ======== Recieve =======
{
    errorCode: int
    msg: string
}

/**
 * GET info/delete?token=xxxx&sequence=yyyy
 */
// ======== Send =======

// ======== Recieve =======
{
    errorCode: int
    msg: string
}

/**
 * GET info/getInfo?token=xxxx&sequence=yyyy
 */
// ======== Send =======

// ======== Recieve =======
{
    errorCode: int
    msg: string
    data: object
}

/**
 * GET info/getSeq?token=xxxx
 */
// ======== Send =======

// ======== Recieve =======
{
    errorCode: int
    msg: string
    data: object
}

/**
 * GET info/search?token=xxxx(&status=yyyy)(&department=yyyy)(&applicant=yyyy)(&page=yyyy&pageSize=yyyy)(&sortOrder=yyyy)
 */
// ======== Send =======

// ======== Recieve =======
{
    errorCode: int
    msg: string
    data: object
}
```







