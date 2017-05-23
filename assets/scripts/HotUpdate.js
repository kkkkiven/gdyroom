cc.Class({
    extends: cc.Component,

    properties: {
        manifestUrl: cc.RawAsset,
        updatePanel: cc.Node,
        info: cc.Label,
        fileProgress: cc.ProgressBar,
        byteProgress: cc.ProgressBar,
        retryBtn: cc.Node,
        updateBtn: cc.Node,
        _updating: false,
        _canRetry: false,
    },

    checkCb: function (event) {
        console.log('Code: ' + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.info.string = "本地更新配置出错，请尝试重新启动.";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.info.string = "下载更新文件失败，请尝试重新启动.";
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.info.string = "当前已经是最新版本.";
                cc.director.loadScene("loading");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.info.string = '发现新版本，请在Wifi条件下进行更新.';
                this.updatePanel.active = true;
                this.fileProgress.progress = 0;
                this.byteProgress.progress = 0;
                break;
            default:
                return;
        }
        
        cc.eventManager.removeListener(this._checkListener);

        this._checkListener = null;
        this._updating = false;
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.info.string = "本地更新配置出错，请尝试重新启动.";
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.byteProgress.progress = event.getPercent() / 100;
                this.fileProgress.progress = event.getPercentByFile() / 100;

                var msg = event.getMessage();
                if (msg) {
                    this.info.string = '更新文件: ' + msg;
                    console.log(event.getPercent().toFixed(2) + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.info.string = "下载更新文件失败，请尝试重新启动.";
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.info.string = "当前已经是最新版本.";
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.info.string = '更新完成. ' + event.getMessage();
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.info.string = '更新失败，请尝试重新更新. ' + event.getMessage();
                this.retryBtn.active = true;
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.info.string = '更新失败: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.info.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var aaaa = JSON.stringify(searchPaths);
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            var bbb = JSON.stringify(newPaths);
            console.log("bbbbbbbbbbbb   " + bbb);
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            var ccc = JSON.stringify(searchPaths);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', ccc);

            var ddd = cc.sys.localStorage.getItem('HotUpdateSearchPaths');
            console.log("dddddddddddd   " + ddd);
            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.sys.localStorage.removeItem("wx_account");
            cc.sys.localStorage.removeItem("wx_sign");
            var info = this.info;
            var time = 3;
            setInterval(function() {
                info.string = "更新完成，"+time+"秒自动重启游戏.";
                time -= 1;
                if(time < 0) {

                    cc.game.restart();
                }
            }, 1000);
        }
    },
    
    retry: function () {
        if (!this._updating && this._canRetry) {
            this.retryBtn.active = false;
            this._canRetry = false;
            
            this.info.string = '正在尝试重新更新...';
            this._am.downloadFailedAssets();
        }
    },
    
    checkUpdate: function () {
        if (this._updating) {
            this.info.string = '检查更新 ...';
            return;
        }
        if (!this._am.getLocalManifest().isLoaded()) {
            this.info.string = "本地更新配置出错，请尝试重新启动.";
            return;
        }
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._am.checkUpdate();
        this._updating = true;
    },

    hotUpdate: function () {
        if (this._am && !this._updating) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            this._failCount = 0;
            this._am.update();
            this.updateBtn.active = false;
            this._updating = true;
        }
    },

    onGetIosAndroidInfo:function(handler){
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        var extraUrl = "http://update-tdk.bestwpb.cn:12350/gdy/configs.json?ac=1";
        xhr.open("GET",extraUrl, true);
        if (cc.sys.isNative){
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
        }
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                // console.log("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                try {
                    var ret = JSON.parse(xhr.responseText);
                    if(handler !== null){
                        handler(ret);
                    }                        /* code */
                } catch (e) {
                    // console.log("err:" + e);
                    //handler(null);
                }
                finally{
                    if(cc.vv && cc.vv.wc){
                        //       cc.vv.wc.hide();
                    }
                }
            }
        };
        if(cc.vv && cc.vv.wc){
            //cc.vv.wc.show();
        }
        xhr.send();
    },


    onUpdateCheckInfo:function () {
        if (!cc.sys.isNative) {
            return;
        }
        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'blackjack-remote-asset');

        var searchPaths = jsb.fileUtils.getSearchPaths();
        var aaaa = JSON.stringify(searchPaths);
        this._am = new jsb.AssetsManager(this.manifestUrl, storagePath);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this._am.setVersionCompareHandle(function (versionA, versionB) {
            console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        });

        var info = this.info;
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                info.string = "Verification passed : " + relativePath;
                return true;
            }
            else {
                info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });

        this.info.string = 'Hot update is ready, please check or directly update.';

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(1);
            this.info.string = "Max concurrent tasks count have been limited to 1";
        }

        this.fileProgress.progress = 0;
        this.byteProgress.progress = 0;
        this.checkUpdate();
    },

    // use this for initialization
    onLoad: function () {
        var self = this ;
            this.onGetIosAndroidInfo(function (ret) {
                cc.sys.localStorage.setItem('AndroidTest', ret.android.test);
                cc.sys.localStorage.setItem('AndroidReview', ret.android.review);
                cc.sys.localStorage.setItem('IOSTest', ret.ios.test);
                cc.sys.localStorage.setItem('IOSReview', ret.ios.review);
                if(cc.sys.os == cc.sys.OS_ANDROID){
                    self.onUpdateCheckInfo();
                }else if(cc.sys.os == cc.sys.OS_IOS){
                    if(ret.ios.review){
                        cc.director.loadScene("loading");
                    }else{
                        self.onUpdateCheckInfo();
                    }
                }


            });


    },

    onDestroy: function () {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
        }
    }
});
