var express = require('express');
var userSystem = require('../controller/userController');
var logSystem = require('../controller/logController');
var router = express.Router();

/* GET users listing. */
router.post('/login', userSystem.userLogin);

router.post('/regist', userSystem.userRegist);

router.post('/update', userSystem.userLoginCheck, userSystem.userPermissionCheck, userSystem.userUpdate);

router.post('/delete', userSystem.userLoginCheck, userSystem.userPermissionCheck, userSystem.userDelete);

router.get('/logout', userSystem.userLogout);

router.get('/information', userSystem.userLoginCheck, userSystem.userPermissionCheck, userSystem.userGetInfo);

router.get('/log', userSystem.userLoginCheck, userSystem.userPermissionCheck, logSystem.getLog);

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
