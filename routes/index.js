var express = require('express');
var _fs = require('fs');
var router = express.Router();
var service_controller = require('../controller/serviceCtr');
var keyword_controller = require('../controller/keywordCtr');
var model = require('../model/model');
var controller = require('../controller/controller');
var pagination = require('../public/static/admin/js/pagination.js');
var secondList = {};
var firstCode;
var uuid = require('node-uuid');

router.all('*', function(req, res, next) {
    res.locals.main = false;
    var path = req.path;
    console.log('path', path);
    if (path == '/') { //首页
        res.locals.main = true;
    } else if (path == '/products/list') { //产品中心


    }
    next();
});

/* 国际化 */
router.get("/i18n/:locale", function(req, res) {
    res.cookie('locale', req.params.locale, {
        maxAge: 1000 * 60 * 60 * 24
    });
    res.send(JSON.stringify("Success"));
});

/* 首页 */
router.get('/', function(req, res, next) {
    var newsListSql, hotListSql;
    if (res.locals.inlanguage == 'en') {
        newsListSql = model.news.queryLastTwoEn;
        hotListSql = model.hot.queryProductEn;
    } else {
        newsListSql = model.news.queryLastTwoZh;
        hotListSql = model.hot.queryProductZh;
    }
    controller.selectFun(res, newsListSql, [], function(newsList) {
        controller.selectFun(res, hotListSql, [], function(hotList) {
            var title = res.__('title_main');
            var keyword = res.__('keyword_main');
            var describes = res.__('describes_main');
            console.log('title---->', title);
            console.log('keyword---->', keyword);
            console.log('describes---->', describes);
            res.render('home/index', {
                title: title,
                keyword: keyword,
                describes: describes,
                newsList: newsList,
                hotList: hotList
            });
        });
    });
});


/*产品中心*/
router.get('/products/list', function(req, res, next) {
    res.locals.fcode = req.query.fCode;
    res.locals.code = req.query.code;
    var page = { limit: 30, num: 1 };
    if (req.query.p) {
        page['num'] = req.query.p < 1 ? 1 : req.query.p;
    }
    var startp = (page.num - 1) * page.limit;
    var endp = page.limit;
    var href = '/products/list?fCode=' + req.query.fCode + '&code=' + req.query.code;
    var pagehelp = { currentpage: page.num, pagesize: 30, pagecount: 30, href: href };
    controller.selectFun(res, model.productModel.queryProductCount, [req.query.code], function(count) {
        var pagecount = count[0].count;
        pagehelp['pagecount'] = pagecount;
        var pagehtml = pagination.pagehtml(pagehelp);
        if (pagecount === 0) {
            res.render('home/products', {
                secondCode: req.query.code,
                list: [],
                locals: pagehtml,
                firstCode: req.query.fCode
            });
        }
        var sql;
        if (res.locals.inlanguage == 'en') {
            sql = model.productModel.queryProductListEn;
        } else {
            sql = model.productModel.queryProductListZh;
        }

        //先查询一级目录名称和二级目录名称
        var firstProductNameSQL = model.productNameModel.firstProductName;
        var secondProductNameSQL = model.productNameModel.secondProductName;
        controller.selectFun(res, firstProductNameSQL, [req.query.fCode], function(result) {
            console.log('firstProductNameSQL------>', result[0]);
            var firstName;
            if (res.locals.inlanguage == 'en') {
                firstName = result[0].productNameEn;
            } else {
                firstName = result[0].productNameCh;
            }
            console.log('firstName------>', firstName);
            controller.selectFun(res, secondProductNameSQL, [req.query.code], function(result) {
                console.log('secondProductNameSQL------>', result[0]);
                var secondName;
                if (res.locals.inlanguage == 'en') {
                    secondName = result[0].productNameEn;
                } else {
                    secondName = result[0].productNameCh;
                }
                console.log('secondName------>', secondName);
                var title = firstName + '_' + secondName + '_' + res.__('Company');
                var keyword = firstName + '_' + secondName;
                var describes = res.__('describes_details_1') + firstName + '_' + secondName + res.__('describes_details_2') + firstName + '_' + secondName + res.__('describes_details_3');
                console.log('title------>', title);
                console.log('keyword------>', keyword);
                console.log('describes------>', describes);
                //查询列表
                controller.selectFun(res, sql, [req.query.code, startp, endp], function(result) {
                    console.log('查询列表----->', result);
                    res.render('home/products', {
                        title: title,
                        keyword: keyword,
                        describes: describes,
                        secondCode: req.query.code,
                        list: result,
                        locals: pagehtml,
                        firstCode: req.query.fCode
                    });
                });
            });
        });

    });
});

/*产品详情*/
router.get('/details', function(req, res, next) {
    var sql;
    var listSql;
    if (res.locals.inlanguage == 'en') {
        sql = model.productModel.queryProductEn;
        listSql = model.productModel.queryProductListEn;
    } else {
        sql = model.productModel.queryProductZh;
        listSql = model.productModel.queryProductListZh;
    }
    controller.selectFun(res, listSql, [req.query.sCode, 0, 12], function(list) {
        controller.selectFun(res, sql, [req.query.id], function(result) {
            var title = '';
            var keyword = '';
            var describes = '';
            if (result[0]) {
                title = result[0].name + '_' + res.__('Company');
                keyword = result[0].name;
                describes = res.__('describes_details_1') + result[0].name + res.__('describes_details_2') + result[0].name + res.__('describes_details_3');
            }
            res.render('home/details', {
                title: title,
                keyword: keyword,
                describes: describes,
                pro: result[0],
                locale: req.cookies.locale,
                list: list,
                secondCode: req.query.sCode
            }, function(err, html) {
                console.log('content----->', html);
                _fs.writeFileSync('../public/details/' + req.query.sCode + '.html', html);
                res.redirect('/details/' + req.query.sCode + '.html');
            });
        });
    });
});

/*解决方案*/
router.get('/case', function(req, res, next) {
    res.render('home/case', {
        title: res.__('caseTitle'),
        keyword: res.__('indexTitle'),
        describes: res.__('indexTitle'),
    });
});

/*关于我们*/
router.get('/aboutus', function(req, res, next) {
    res.render('home/aboutus', {
        title: '关于我们',
        keyword: res.__('indexTitle'),
        describes: res.__('indexTitle'),
    });
});

/*服务支持,服务保障,服务流程*/
function queryService(req, res, title, type, pathname) {
    req.type = res.locals.type = type;
    service_controller.queryService(req, res, function(result) {
        if (result.length <= 0) {
            result[0] = '';
        }
        res.render('home/' + pathname, {
            title: title + '_' + res.__('Company'),
            keyword: res.__('indexTitle'),
            describes: res.__('indexTitle'),
            content: result[0],
        });
    });
}
router.get('/ServiceSupport', function(req, res, next) {
    var title = res.__('ServiceSupport');
    queryService(req, res, title, 1, 'ServiceSupport');
});
router.get('/ServiceGuarantee', function(req, res, next) {
    var title = res.__('ServiceGuarantee');
    queryService(req, res, title, 2, 'ServiceGuarantee');
});
router.get('/ServiceProcess', function(req, res, next) {
    var title = res.__('ServiceProcess');
    queryService(req, res, title, 3, 'ServiceProcess');
});

/*公司简介,公司荣誉,公司文化*/
router.get('/companyinfo', function(req, res, next) {
    res.render('home/companyinfo', {
        title: res.__('CompanyProfile') + '-' + res.__('Company'),
        keyword: res.__('indexTitle'),
        describes: res.__('indexTitle'),
        type: 1,
    });
});
router.get('/companyhonor', function(req, res, next) {
    res.render('home/companyhonor', {
        title: res.__('CompanyHonor') + '-' + res.__('Company'),
        keyword: res.__('indexTitle'),
        describes: res.__('indexTitle'),
        type: 2,
    });
});
router.get('/companyculture', function(req, res, next) {
    res.render('home/companyculture', {
        title: res.__('CompanyCulture') + '-' + res.__('Company'),
        type: 3,
    });
});
router.get('/contactus', function(req, res, next) {
    res.render('home/contactus', {
        title: res.__('ContactUs') + '-' + res.__('Company'),
        keyword: res.__('indexTitle'),
        describes: res.__('indexTitle'),
        type: 4,
    });
});

/*新闻中心*/
function queryData(res, req, pathname, _type, _title) {
    var page = { limit: 10, num: 1 };
    if (req.query.p) {
        page['num'] = req.query.p < 1 ? 1 : req.query.p;
    }
    var startp = (page.num - 1) * page.limit;
    var endp = page.limit;
    var href = pathname + '?n=10';
    var pagehelp = { currentpage: page.num, pagesize: 10, pagecount: 10, href: href };
    var queryCount = model.news.queryCount;
    controller.selectFun(res, queryCount, [_type], function(count) {
        pagehelp['pagecount'] = count[0].count;
        var pagehtml = pagination.pagehtml(pagehelp);
        var sql;
        if (res.locals.inlanguage == 'en') {
            sql = model.news.queryNewsListEn;
        } else {
            sql = model.news.queryNewsListZh;
        }
        controller.selectFun(res, sql, [_type, startp, endp], function(result) {
            console.log(result);
            res.render('home/news', {
                title: _title,
                keyword: res.__('indexTitle'),
                describes: res.__('indexTitle'),
                list: result,
                locals: pagehtml,
                type: _type,
            });
        });
    });
}
/*新闻中心*/
router.get('/NewsCenter', function(req, res, next) {
    queryData(res, req, 'EntreprisesNews', 'all', res.__('EntreprisesNews'));
});
/*新闻中心-企业动态*/
router.get('/EntreprisesNews', function(req, res, next) {
    queryData(res, req, 'EntreprisesNews', 1, res.__('EntreprisesNews'));
});
/*新闻中心-产品资讯*/
router.get('/ProductInformation', function(req, res, next) {
    queryData(res, req, 'ProductInformation', 2, res.__('ProductInformation'));
});

//新闻详情
router.get('/archives/:id/:type', function(req, res, next) {
    var id = req.params.id;
    var type = req.params.type;
    console.log('newdetails-----', id);
    var sql, listSql, nextSql, lastSql;
    if (res.locals.inlanguage == 'en') {
        sql = model.news.queryNewEn;
        listSql = model.news.queryNewsListEn;
        nextSql = model.news.queryNextEn;
        lastSql = model.news.queryLastEn;
    } else {
        sql = model.news.queryNewZh;
        listSql = model.news.queryNewsListZh;
        nextSql = model.news.queryNextZh;
        lastSql = model.news.queryLastZh;
    }
    controller.selectFun(res, sql, [id], function(result) {
        var describes = '',
            newsContent = '',
            newsName = '';
        console.log('result---->', result[0]);
        if (result[0]) {
            describes = result[0].description.substring(0, 200);
            newsContent = result[0];
            newsName = result[0].name;
        }

        controller.selectFun(res, listSql, [1, 0, 5], function(entrepriseNewsList) {
            controller.selectFun(res, listSql, [2, 0, 5], function(productInformationList) {
                controller.selectFun(res, nextSql, [id, type], function(nextlist) {
                    var next;
                    if (nextlist[0]) {
                        next = nextlist[0];
                    }
                    controller.selectFun(res, lastSql, [id, type], function(lastlist) {
                        var last;
                        if (lastlist[0]) {
                            last = lastlist[0];
                        }
                        console.log('last---->', last);
                        res.render('home/news-detail', {
                            title: newsName + '_' + res.__('Company'),
                            keyword: newsName,
                            describes: describes,
                            last: last,
                            next: next,
                            news: newsContent,
                            type: type,
                            entrepriseNewsList: entrepriseNewsList,
                            productInformationList: productInformationList,
                        });
                    });
                });
            });
        });

    });
});

//关键词和描述管理
router.get('/keyword/:who', function(req, res, next) {
    var param = req.params;
    param = param.who;
    req.number = param;
    keyword_controller.queryKeyword(req, res, function(result) {
        console.log('关键词---->', reuslt[0]);
        var content = '';
        var keyword = '',
            describes = '';
        if (result.length > 0) {
            keyword = result[0].keyword;
            describes = result[0].describes;
        }
        res.render('admin/keyword', {
            title: '关键词设置',
            cpage: param,
        });
    });
});
router.post('/addKeyword', function(req, res, next) {
    keyword_controller.addKeyword(req, res, next);
});
module.exports = router;
