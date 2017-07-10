var express = require('express');
var _fs = require('fs');
var router = express.Router();
var service_controller = require('../controller/serviceCtr');
var keyword_controller = require('../controller/keywordCtr');
var model = require('../model/model');
var controller = require('../controller/controller');
var pagination = require('../public/static/admin/js/pagination.js');
var secondList = {};
var uuid = require('node-uuid');

router.all('*', function(req, res, next) {
    res.locals.main = false;
    var path = req.path;
    console.log('path', path);
    if (path == '/') { //首页
        res.locals.main = true;
    }
    var firstSQL;
    var secondSQL;

    if (res.locals.inlanguage == 'en') {
        firstSQL = model.index.firstListEn;
        secondSQL = model.index.secondListEn;
    } else {
        firstSQL = model.index.firstListZh;
        secondSQL = model.index.secondListZh;
    }

    controller.selectFun(res, firstSQL, [], function(result) {
        var firstProList = result;
        console.log('result------>', firstProList);
        var arr = [];
        firstProList.forEach(function(filename, idx) {
            var code = filename.productCode;
            controller.selectFun(res, secondSQL, [code], function(result) {
                console.log('idx------>',idx);
                console.log('filename------>',filename);
                var secondProList=result;
                console.log('secondProList------>',result);
                var secondCode;
                var secondName;
                if(secondProList[0]){
                	secondName=secondProList[0].productName;
                	secondCode=secondProList[0].productCode;
                }
              
                console.log('second------>',secondCode);
                arr.push({
                    firstCode:firstProList[idx].productCode,
                    firstName:firstProList[idx].productName,
                    secondCode:secondCode,
                    secondName:secondName,
                    secondProList:secondProList,
                });
                if (arr.length == firstProList.length) {
                    res.locals.proList = arr;
                    console.log('proList------>', res.locals.proList);
                    next();
                }
            });
        });
    });

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
router.get('/productsC/:code', function(req, res, next) {
    var page = { limit: 30, num: 1 };
    if (req.query.p) {
        page['num'] = req.query.p < 1 ? 1 : req.query.p;
    }
    var startp = (page.num - 1) * page.limit;
    var endp = page.limit;
    var href = '/productsC/Center.html';
    var pagehelp = { currentpage: page.num, pagesize: 30, pagecount: 30, href: href };
    controller.selectFun(res, model.index.queryPCCount, [], function(count) {
        var pagecount = count[0].count;
        pagehelp['pagecount'] = pagecount;
        var pagehtml = pagination.pagehtml(pagehelp);

        var sql;
        if (res.locals.inlanguage == 'en') {
            sql = model.index.queryPListEn;
        } else {
            sql = model.index.queryPListZh;
        }
        var title = res.__('productCenterTitle');
        var keyword = res.__('productCenterKey');
        var describes = res.__('productCenterdescribes');


        //查询列表
        controller.selectFun(res, sql, [startp, endp], function(result) {
            var param = {
                title: title,
                keyword: keyword,
                describes: describes,
                locals: pagehtml,
                name: res.__('ProductCenter'),
                firstCode: '',
                firstName: '',
                secondCode: '',
                secondName: '',
            };
            if (pagecount <= 0) {
                param.list = [];
            } else {
                param.list = result;
            }
            res.render('home/products', param);
        });
    });
});

/*产品中心*/
router.get('/productsF/:code', function(req, res, next) {
    var code = req.params.code.substring(0, req.params.code.indexOf('.'));
    var page = { limit: 30, num: 1 };
    if (req.query.p) {
        page['num'] = req.query.p < 1 ? 1 : req.query.p;
    }
    var startp = (page.num - 1) * page.limit;
    var endp = page.limit;
    var href = '/productsF/' + code + '.html';
    var pagehelp = { currentpage: page.num, pagesize: 30, pagecount: 30, href: href };
    controller.selectFun(res, model.index.queryPFCount, [code], function(count) {
        var pagecount = count[0].count;
        pagehelp['pagecount'] = pagecount;
        var pagehtml = pagination.pagehtml(pagehelp);

        var sql;
        if (res.locals.inlanguage == 'en') {
            sql = model.index.queryProductListEn;
        } else {
            sql = model.index.queryProductListZh;
        }

        //先查询一级目录名称和二级目录名称
        var firstProductNameSQL = model.productNameModel.firstProductName;
        controller.selectFun(res, firstProductNameSQL, [code], function(result) {
            console.log('firstProductNameSQL------>', result[0]);
            var firstName;
            if (res.locals.inlanguage == 'en') {
                firstName = result[0].productNameEn;
            } else {
                firstName = result[0].productNameCh;
            }
            console.log('firstName------>', firstName);
            var title = firstName + '_' + res.__('Company');
            var keyword = firstName;
            var describes = res.__('describes_details_1') + firstName + '_' + res.__('describes_details_2') + firstName + '_' + res.__('describes_details_3');

            //查询列表
            controller.selectFun(res, sql, [code, startp, endp], function(result) {
                var param = {
                    title: title,
                    keyword: keyword,
                    describes: describes,
                    firstCode: code,
                    firstName: firstName,
                    secondCode: '',
                    secondName: '',
                    locals: pagehtml,
                };
                console.log('param', param);
                if (pagecount <= 0) {
                    param.list = [];
                } else {
                    param.list = result;
                }
                res.render('home/products', param);
            });
        });
    });
});

/*产品中心*/
router.get('/products/:FCode/:code', function(req, res, next) {
    var code = req.params.code.substring(0, req.params.code.indexOf('.'));
    var fcode = req.params.FCode;
    var page = { limit: 30, num: 1 };
    if (req.query.p) {
        page['num'] = req.query.p < 1 ? 1 : req.query.p;
    }
    var startp = (page.num - 1) * page.limit;
    var endp = page.limit;
    var href = '/products/' + fcode + '/' + code + '.html';
    var pagehelp = { currentpage: page.num, pagesize: 30, pagecount: 30, href: href };
    controller.selectFun(res, model.productModel.queryProductCount, [code], function(count) {
        var pagecount = count[0].count;
        pagehelp['pagecount'] = pagecount;
        var pagehtml = pagination.pagehtml(pagehelp);

        var sql;
        if (res.locals.inlanguage == 'en') {
            sql = model.productModel.queryProductListEn;
        } else {
            sql = model.productModel.queryProductListZh;
        }

        //先查询一级目录名称和二级目录名称
        var firstProductNameSQL = model.productNameModel.firstProductName;
        var secondProductNameSQL = model.productNameModel.secondProductName;
        controller.selectFun(res, firstProductNameSQL, [fcode], function(result) {
            console.log('firstProductNameSQL------>', result[0]);
            var firstName;
            if (res.locals.inlanguage == 'en') {
                firstName = result[0].productNameEn;
            } else {
                firstName = result[0].productNameCh;
            }
            console.log('firstName------>', firstName);
            controller.selectFun(res, secondProductNameSQL, [code], function(result) {
                console.log('secondProductNameSQL------>', result[0]);
                var secondName;
                if (res.locals.inlanguage == 'en') {
                    secondName = result[0].productNameEn;
                } else {
                    secondName = result[0].productNameCh;
                }
                var title = firstName + '_' + secondName + '_' + res.__('Company');
                var keyword = firstName + '_' + secondName;
                var describes = res.__('describes_details_1') + firstName + '_' + secondName + res.__('describes_details_2') + firstName + '_' + secondName + res.__('describes_details_3');
                //查询列表
                controller.selectFun(res, sql, [code, startp, endp], function(result) {
                    var param = {
                        title: title,
                        keyword: keyword,
                        describes: describes,
                        firstCode: fcode,
                        secondCode: code,
                        locals: pagehtml,
                        firstName: firstName,
                        secondName: secondName,
                        name: secondName
                    };
                    if (pagecount <= 0) {
                        param.list = [];
                    } else {
                        param.list = result;
                    }
                    res.render('home/products', param);
                });
            });
        });

    });
});

/*产品详情*/
router.get('/details/:SCode/:id', function(req, res, next) {
    var sql;
    var listSql;
    var SCode = req.params.SCode;
    var id = req.params.id.substring(0, req.params.id.indexOf('.'));
    console.log(SCode);
    if (res.locals.inlanguage == 'en') {
        sql = model.index.queryProductEn;
        listSql = model.productModel.queryProductListEn;
    } else {
        sql = model.index.queryProductZh;
        listSql = model.productModel.queryProductListZh;
    }
    controller.selectFun(res, listSql, [SCode, 0, 12], function(list) {
        controller.selectFun(res, sql, [id], function(result) {
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
                secondCode: SCode,
                name: keyword
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
        keyword: res.__('indexTitle'),
        describes: res.__('indexTitle'),
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
    var queryCount = model.news.queryCountAll;
    var arr = [];
    if (_type == 1 || _type == 2) {
        arr = [_type];
        queryCount = model.news.queryCount;
    }
    controller.selectFun(res, queryCount, arr, function(count) {
        pagehelp['pagecount'] = count[0].count;
        var pagehtml = pagination.pagehtml(pagehelp);
        var sql;
        var arr = [];
        if (_type == 3) {
            if (res.locals.inlanguage == 'en') {
                sql = model.news.queryNewsListEnAll;
            } else {
                sql = model.news.queryNewsListZhAll;
            }
            arr = [startp, endp];
        } else {
            if (res.locals.inlanguage == 'en') {
                sql = model.news.queryNewsListEn;
            } else {
                sql = model.news.queryNewsListZh;
            }
            arr = [_type, startp, endp];
        }
        console.log('sql----->', sql);
        controller.selectFun(res, sql, arr, function(result) {
            console.log('newslist----->', result);
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
router.get('/newsCenter', function(req, res, next) {
    queryData(res, req, 'newsCenter', 3, res.__('NewsCenter'));
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
router.get('/archives/:type/:id', function(req, res, next) {
    var type = req.params.type;
    var id = req.params.id.substring(0, req.params.id.indexOf('.'));
    console.log('newdetails-----', id);
    var sql, listSql, nextSql, lastSql;
    if (res.locals.inlanguage == 'en') {
        sql = model.index.queryNewEn;
        listSql = model.news.queryNewsListEn;
        nextSql = model.index.queryNextEn;
        lastSql = model.index.queryLastEn;
    } else {
        sql = model.index.queryNewZh;
        listSql = model.news.queryNewsListZh;
        nextSql = model.index.queryNextZh;
        lastSql = model.index.queryLastZh;
    }
    controller.selectFun(res, sql, [id], function(result) {
        var describes = '',
            newsContent = '',
            newsName = '';
        console.log('result---->', result[0]);
        if (result[0]) {
            describes = result[0].description.replace(/<[^>]+>/g, "").substring(0, 200);
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
