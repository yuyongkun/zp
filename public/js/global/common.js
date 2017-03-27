(function() {
    /*百度分享*/
    function share(obj) {
        var _obj = obj || {},
            _setShareInfo = _obj.setShareInfo;
        window._bd_share_config = {
            common: {
                bdText: '', //自定义分享内容
                bdDesc: '', //自定义分享摘要
                bdUrl: '', //自定义分享url地址
                bdPic: '', //自定义分享图片
                bdCustomStyle: "",
                onBeforeClick: _setShareInfo,
                onAfterClick: function() {
                    //                        common.msg.info('分享成功');
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
    };
    share({
        setShareInfo: function(cmd, config) {
            config.bdText = '';
            config.bdDesc = '';
            config.bdPic = '';
            config.bdUrl = '';
            return config;
        }
    });

    //广告位
    function banner() {
        var now = 0,
            $span = $("#carousel-num").find('span'),
            $li = $("#index-pic").find('ul li'),
            total = $li.length;
        var roll = function() {
            $span.removeClass('carousel-cur');
            if (now == total - 1) {
                now = 0;
            } else {
                now = now + 1;
            }
            for (i = 0; i < total; i++) {
                $li.eq(i).css("display", "none");
            }

            $li.eq(now).fadeIn(400);
            $span.eq(now).addClass('carousel-cur');
        };
        var int = setInterval(roll, 5000);
        $span.bind('mouseenter mouseleave', function(e) {
            if (e.type === 'mouseenter') {
                window.clearInterval(int);
                if ($(this).index() != now) {
                    now = $(this).index() - 1;
                    roll();
                }
            } else {
                int = setInterval(roll, 5000);
            }
        });
        $li.bind('mouseenter mouseleave', function(e) {
            if (e.type === 'mouseenter') {
                window.clearInterval(int);
            } else {
                int = setInterval(roll, 5000);
            }
        });
    }
    banner();
    //轮播
    function zpad() {
        var speed = 50;

        var tab = document.getElementById("demo");

        var tab1 = document.getElementById("demo1");

        var tab2 = document.getElementById("demo2");

        tab2.innerHTML = tab1.innerHTML;

        function Marquee() {

            if (tab2.offsetWidth - tab.scrollLeft <= 0)

                tab.scrollLeft -= tab1.offsetWidth
            else {
                tab.scrollLeft++;

            }

        }

        var MyMar = setInterval(Marquee, speed);

        tab.onmouseover = function() {
            clearInterval(MyMar)
        };

        tab.onmouseout = function() {
            MyMar = setInterval

                (Marquee, speed)
        };
    }
    zpad();
})();
