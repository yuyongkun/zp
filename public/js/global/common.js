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

   
})();
