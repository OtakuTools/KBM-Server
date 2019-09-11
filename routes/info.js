var express = require('express');
var infoSystem = require('../controller/infoController');
var userSystem = require('../controller/userController');
var router = express.Router();

/* GET users listing. */
router.post('/add', userSystem.userLoginCheck, infoSystem.userPermissionCheck, infoSystem.addInfo);

router.post('/modify', userSystem.userLoginCheck, infoSystem.userPermissionCheck, infoSystem.modifyInfo);

router.post('/updateStatus', userSystem.userLoginCheck, infoSystem.userPermissionCheck, infoSystem.modifyInfoStatus);

router.post('/getBadge', userSystem.userLoginCheck, infoSystem.userPermissionCheck, infoSystem.searchInfoCount);

router.get('/delete', userSystem.userLoginCheck, infoSystem.userPermissionCheck, infoSystem.deleteInfo);

router.get('/getInfo', userSystem.userLoginCheck, infoSystem.userPermissionCheck, infoSystem.getInfo);

router.get('/getSeq', userSystem.userLoginCheck, infoSystem.userPermissionCheck, infoSystem.getSeq);

router.get('/search', userSystem.userLoginCheck, infoSystem.userPermissionCheck, infoSystem.searchInfo);

router.get('/getUser', userSystem.userLoginCheck, infoSystem.userPermissionCheck, userSystem.userGetCurInfo);

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
