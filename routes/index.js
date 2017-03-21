var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '新乡市艾达机械设备有限公司' });
});
router.get('/list', function(req, res, next) {
  res.render('list', { title: 'Express' });
});
module.exports = router;
