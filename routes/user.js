var express = require('express');
var userSystem = require('../controller/userController');
var router = express.Router();

/* GET users listing. */
router.post('/login', userSystem.userLogin);

router.post('/regist', userSystem.userRegist);

router.post('/update', userSystem.userCheck, userSystem.userUpdate);

router.get('/delete', userSystem.userCheck, userSystem.userDelete);

router.get('/logout', userSystem.userLogout);

router.get('/information', userSystem.userCheck, userSystem.userGetInfo);

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
