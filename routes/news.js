var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var model=require('../model/model');
var controller=require('../controller/controller');

var pagination = require('../public/static/admin/js/pagination.js');

router.get('/new', function(req, res, next) {
	res.render('admin/news/newNews', { title: '发布新闻'});
});
router.post('/saveNews', function(req, res, next) {
	res.render('admin/news/newNews', { title: '发布新闻'});
});

module.exports = router;