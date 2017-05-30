(function() {
    window.Common = {
        autoEvent: function() {
            function bdHM(){
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?cb23fa08fcd024ff3edcd697c5025892";
              document.body.appendChild(hm); 
            }
            bdHM();
           
        }(),
        /*
         * 常用提示框
         * CFB.msg.info("你好");      蓝色    普通提示信息
         * CFB.msg.warning("你好");   红色    错误提示信息
         * CFB.msg.error("你好");     警示色  警告提示信息
         * CFB.msg.success("你好");   绿色    成功提示信息
         * CFB.msg.info("你好",5000); 停留5秒
         * */
        msg: function() {
            var m = {};
            var method = ["info", "error", "warning", "success"];
            for (var i = 0; i < method.length; i++) {
                m[method[i]] = (function() {
                    var type = method[i];
                    return function(message, timeout) {
                        Common.tip(message, type, timeout);
                    };
                })();
            }
            return m;
        }(),

        /*
         * 信息提示
         * */
        tip: function(message, type, timeout) {
            var _tip = {};
            type = type || 'info';
            timeout = timeout / 1000 || 2.5;
            var div = document.getElementById("_tips");
            if (!div) {
                var htmTip = '<div id="_tips" class="_tips"><span id="tip_icon" class="tip_icon"></span><span id="tip_text" class="tip_text"></span></div>';
                Common.appendHTML(document.body, htmTip);
            }
            var text = document.getElementById("tip_text");
            text.innerHTML = message;
            div = document.getElementById("_tips");
            tip = document.getElementById("tip_icon");
            tip.style.backgroundImage = 'url(/images/tip-icon.png)';
            if (type == 'success') {
                tip.style.backgroundPosition = '0 0';
                div.style.backgroundColor = '#18b536';
            } else if (type == 'error') {
                tip.style.backgroundPosition = '-37px 0';
                div.style.backgroundColor = '#E60707';
            } else if (type == 'warning') {
                tip.style.backgroundPosition = '-78px 0';
                div.style.backgroundColor = '#F5A700';
            }
            //处理ie里面提示框不显示
            var browser = navigator.appName,
                b_version = navigator.appVersion,
                version = b_version.split(";"),
                trim_Version = version[1].replace(/[ ]/g, "");
            if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
                // div.style.filter = 'alpha(opacity:0)';
                div.style.top = '0px';
                $(div).animate({
                    opacity: 1
                }, 500);

                if (_tip.timmer) {
                    clearTimeout(_tip.timmer);
                    _tip.timmer = null;
                }
                _tip.timmer = setTimeout(function() {
                    $(div).animate({
                        opacity: 0,
                        top: '-90px'
                    }, 500);
                }, 1500);

            } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
                div.style.top = '90px';
                $(div).animate({
                    opacity: 1
                }, 500);
                if (_tip.timmer) {
                    clearTimeout(_tip.timmer);
                    _tip.timmer = null;
                }
                _tip.timmer = setTimeout(function() {
                    $(div).animate({
                        opacity: 0,
                        top: '0px'
                    }, 500);
                }, 1500);
            } else {
                div.style.webkitAnimation = 'none';
                div.style.animation = 'none';
                if (_tip.timmer) {
                    clearTimeout(_tip.timmer);
                    _tip.timmer = null;
                }
                _tip.timmer = setTimeout(function() {
                    div.style.webkitAnimation = 'tip ' + timeout + 's';
                    div.style.animation = 'tip ' + timeout + 's';
                }, 120);
            }
        },
        /*百度统计*/
        bdHM: function() {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?271e81312a4cee99e3ea081f73a588d9";
            document.body.appendChild(hm);

            var hm2 = document.createElement("script");
            hm2.src = "//hm.baidu.com/hm.js?b02070d558abca9a01a875104381a593";
            document.body.appendChild(hm2);
        }(),
        appendHTML: function(container, htm) {
            var pnode = document.createElement('div'),
                nodes = null,
                fragment = document.createDocumentFragment();
            pnode.innerHTML = htm;
            cnodes = pnode.childNodes;
            for (var i = 0, len = cnodes.length; i < len; i++) {
                fragment.appendChild(cnodes[i].cloneNode(true));
            }
            container.appendChild(fragment);
            nodes = null;
            fragment = null;
        },
        /*百度分享*/
        share: function(obj) {
            obj = obj || {},
                _setShareInfo = obj.setShareInfo;
            window._bd_share_config = {
                common: {
                    bdText: '', //自定义分享内容
                    bdDesc: '', //自定义分享摘要
                    bdUrl: '', //自定义分享url地址
                    bdPic: '', //自定义分享图片
                    bdCustomStyle: "",
                    onBeforeClick: _setShareInfo,
                    onAfterClick: function() {
                        //                        Common.msg.info('分享成功');
                    }
                },
                //分享按钮设置
                share: [{
                    tag: "share_1"
                }, {
                    tag: "share_2"
                }]
            };
            //插件的JS加载部分
            with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = location.protocol + '/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];

        }({
            setShareInfo: function(cmd, config) {
                config.bdText = '';
                config.bdDesc = '';
                config.bdPic = '';
                config.bdUrl = '';
                return config;
            }
        })
    };
})();
