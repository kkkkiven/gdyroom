cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _isCapturing:false,
        iapPlugin:null,
        netWorkType:0,
        netWortStrength:0,
        batteryLevel:0,
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    init:function(){
        console.log("fuck to anysdk init--->");

        this.ANDROID_API = "com/bestwpb/kkkzldmgdy/WXAPI";
        this.IOS_API = "AppController";
    },

    login:function(){

        cc.sys.localStorage.setItem('LOGIN', true);
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_API, "Login", "()V");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "login");
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
            //  jsb.reflection.callStaticMethod(this.ANDROID_API, "Login", "()V");
        }
    },


    getNetworkType:function (netType) {
        if(cc.sys.os == cc.sys.OS_ANDROID){
            console.log("android ==============",netType);
            if(netType == "MOBILE"){
                this.netWorkType = 2;
            }else if(netType == "WIFI"){
                this.netWorkType = 1;
            }else{
                this.netWorkType = 0;
            }
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            if(netType == 0 ){
                console.log("===========  没有网络")
            }else if(netType == 2 ){
                console.log("===========  4g")
            }
            else if(netType == 1 ){
                console.log("=========== wifi")
            }
            this.netWorkType = netType;
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
            //  jsb.reflection.callStaticMethod(this.ANDROID_API, "Login", "()V");
        }


        cc.vv.gameNetMgr.dispatchEvent('net_change', this.netWorkType);
        this.getSingnalStrength();
    },



    getPhoneInfo:function () {
        this.getSingnalStrength();
        this.getBattery();
        this.getNetwork();

    },


    getNetwork:function () {
        if(cc.sys.os == cc.sys.OS_ANDROID){
            // jsb.reflection.callStaticMethod(this.ANDROID_API, "getNetworkType", "()V");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "getNetworkType");
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
            //  jsb.reflection.callStaticMethod(this.ANDROID_API, "Login", "()V");
        }
    },

    getBattery:function () {

        if(cc.sys.os == cc.sys.OS_ANDROID){
            // jsb.reflection.callStaticMethod(this.ANDROID_API, "getBatteryLevel", "()V");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "getBatteryLeve");
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
            //  jsb.reflection.callStaticMethod(this.ANDROID_API, "Login", "()V");
        }
    },

    getSingnalStrength:function () {

        if(cc.sys.os == cc.sys.OS_ANDROID){
            // jsb.reflection.callStaticMethod(this.ANDROID_API, "Login", "()V");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "getSignalStrength");
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
            //  jsb.reflection.callStaticMethod(this.ANDROID_API, "Login", "()V");
        }
    },

    returnSingnalStrength:function (lengthString) {
        if(parseInt(lengthString) == 0 ){
            lengthString = 3;
        }
        this.netWortStrength = lengthString;
        cc.vv.gameNetMgr.dispatchEvent('netStrength_change',lengthString);
        console.log("getSingnalStrength========= > " , lengthString);
    },

    getBatteryLeve:function (level) {

        console.log("getBatteryLeve========= > " , level);
        if(cc.sys.os == cc.sys.OS_ANDROID){
            this.batteryLevel = level;
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            this.batteryLevel = level;
        }
        else{
            this.batteryLevel = 0.8;
        }

        console.log("getBatteryLeve========= > " , level);
        cc.vv.gameNetMgr.dispatchEvent('bettery_change',level);
    },

    share:function(title,desc){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_API, "Share", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",cc.vv.SI.appweb,title,desc);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "share:shareTitle:shareDesc:",cc.vv.SI.appweb,title,desc);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
        }
    },


    shareResult:function(){
        if(this._isCapturing){
            return;
        }
        this._isCapturing = true;
        var size = cc.director.getWinSize();
        var currentDate = new Date();
        var fileName = "result_share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if(jsb.fileUtils.isFileExist(fullPath)){
            jsb.fileUtils.removeFile(fullPath);
        }
        var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height));
        texture.setPosition(cc.p(size.width/2, size.height/2));
        texture.begin();
        cc.director.getRunningScene().visit();
        texture.end();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);

        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if(jsb.fileUtils.isFileExist(fullPath)){
                var height = 100;
                var scale = height/size.height;
                var width = Math.floor(size.width * scale);

                if(cc.sys.os == cc.sys.OS_ANDROID){
                    jsb.reflection.callStaticMethod(self.ANDROID_API, "ShareIMG", "(Ljava/lang/String;II)V",fullPath,width,height);
                }
                else if(cc.sys.os == cc.sys.OS_IOS){
                    jsb.reflection.callStaticMethod(self.IOS_API, "shareIMG:width:height:",fullPath,width,height);
                }
                else{
                    console.log("platform:" + cc.sys.os + " dosn't implement share.");
                }
                self._isCapturing = false;
            }
            else{
                tryTimes++;
                if(tryTimes > 10){
                    console.log("time out...");
                    return;
                }
                setTimeout(fn,50);
            }
        }
        setTimeout(fn,50);
    },

    test:function (code) {
        console.log("======onLoginResp=========",code);
        var fn = function(ret){
            if(ret.errcode == 0){
                cc.sys.localStorage.setItem("wx_account",ret.account);
                cc.sys.localStorage.setItem("wx_sign",ret.sign);
            }
            cc.vv.userMgr.onAuth(ret);
        }
        cc.vv.http.sendRequest("/wechat_auth",{code:code,os:cc.sys.os},fn);
    },

    onLoginResp:function(code){
        console.log("======onLoginResp=========",code);
        var fn = function(ret){
            if(ret.errcode == 0){
                cc.sys.localStorage.setItem("wx_account",ret.account);
                cc.sys.localStorage.setItem("wx_sign",ret.sign);
            }
            cc.vv.userMgr.onAuth(ret);
        }
        cc.vv.http.sendRequest("/wechat_auth",{code:code,os:cc.sys.os},fn);
    },
});
