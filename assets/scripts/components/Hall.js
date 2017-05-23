var Net = require("Net")
var Global = require("Global")


Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}
cc.Class({
    extends: cc.Component,

    properties: {
        lblName:cc.Label,
        lblMoney:cc.Label,
        lblGems:cc.Label,
        lblID:cc.Label,
        lblNotice:cc.Label,
        joinGameWin:cc.Node,
        createRoomWin:cc.Node,
        bg_gems:cc.Node,
        lblgemsNode:cc.Node,
        btn_add_gems:cc.Node,
        givepanel:cc.Node,
        give_gems:cc.Node,
        settingsWin:cc.Node,
        userid:cc.EditBox,
        gemcount:cc.EditBox,
        helpWin:cc.Node,
        history:cc.Node,
        xiaoxiWin:cc.Node,
        relogin:cc.Node,
        btnJoinGame:cc.Node,
        btnReturnGame:cc.Node,
        sprHeadImg:cc.Sprite,
        queryHeadImg:cc.Sprite,
        targetId:cc.Label,
        targetName:cc.Label,
        dailiInfo:cc.Label,
        targetData:null,
        updatePanel:cc.Node,
        updaetInfo:cc.Label,

    },
    
    initNetHandlers:function(){
        var self = this;
    },
    
    onShare:function(){
        cc.vv.anysdkMgr.share("骗五张（填坑）","填大坑（又叫骗五张），包含了半坑，全坑，带鬼的玩法。");
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(!cc.vv){
            cc.director.loadScene("loading");
            return;
        }
        this.initLabels();
        cc.vv.anysdkMgr.getPhoneInfo();
        if(cc.vv.dataMgr.getRoomId()== null){
            this.btnJoinGame.active = true;
            this.btnReturnGame.active = false;
        }
        else{
            this.btnJoinGame.active = false;
            this.btnReturnGame.active = true;
        }
        
        //var params = cc.vv.args;
        cc.vv.dataMgr.isGameEnd = false;
        var roomId = cc.vv.userMgr.oldRoomId
        if(cc.vv.dataMgr.DEBUG) console.log("room id ===== > " , cc.vv.userMgr.oldRoomId);

        if( roomId != null){
            cc.vv.userMgr.oldRoomId = null;
            cc.vv.userMgr.enterRoom(roomId);
        }
        
        var imgLoader = this.sprHeadImg.node.getComponent("ImageLoader");
        imgLoader.setUserID(cc.vv.userMgr.userId);
        cc.vv.utils.addClickEvent(this.sprHeadImg.node,this.node,"Hall","onBtnClicked");
        
        
        this.addComponent("UserInfoShow");
        
        this.initButtonHandler("Canvas/right_bottom/btn_shezhi");
        this.initButtonHandler("Canvas/right_bottom/btn_zhanji");
        this.initButtonHandler("Canvas/right_bottom/btn_help");
        this.initButtonHandler("Canvas/right_bottom/btn_xiaoxi");
        this.helpWin.addComponent("OnBack");
        this.xiaoxiWin.addComponent("OnBack");
        
        if(!cc.vv.userMgr.notice){
            cc.vv.userMgr.notice = {
                version:null,
                msg:"数据请求中...",
            }
        }
        
        if(!cc.vv.userMgr.gemstip){
            cc.vv.userMgr.gemstip = {
                version:null,
                msg:"数据请求中...",
            }
        }
        var isReview =  cc.vv.dataMgr.getGameReview();
        if(isReview){
            this.lblgemsNode.active = false;
            this.btn_add_gems.active = false;
            this.give_gems.active = false;
            this.bg_gems.active = false;
            var btnClose = cc.find("Canvas/btnJoinGame");
            btnClose.active = false;
        }
        this.lblNotice.string = cc.vv.userMgr.notice.msg;
        this.refreshInfo();
        this.refreshNotice();
        this.refreshGemsTip();
        cc.vv.audioMgr.playBGM("bgMain.mp3");

        var self = this ;
        this.onGetUpdateInfo(function (ret) {
                if(ret && ret.info !== ""){
                    var version = ret.version;
                    var oldVersion = cc.sys.localStorage.getItem('OldVersion');
                    if(version != oldVersion){
                        self.updatePanel.active = true;
                        self.updaetInfo.string = ret.info;
                        cc.sys.localStorage.setItem('OldVersion', ret.version);
                    }

                }
            });

        this.onGetDailiInfo(function (ret) {
            if(ret && ret.info !== ""){
                self.dailiInfo.string = ret.info;
            }
        });




    },


    onGetDailiInfo:function(handler){
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        var extraUrl = cc.vv.http.updateUrl+"/gdy/daili.json?ac=1";
        xhr.open("GET",extraUrl, true);
        if (cc.sys.isNative){
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
        }
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                if(cc.vv.dataMgr.DEBUG) console.log("http res("+ xhr.responseText.length + "):" + xhr.responseText);
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





    onGetUpdateInfo:function(handler){
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        var extraUrl = cc.vv.http.updateUrl+"/gdy/updates.json?ac=1";
        xhr.open("GET",extraUrl, true);
        if (cc.sys.isNative){
            xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
        }
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                if(cc.vv.dataMgr.DEBUG) console.log("http res("+ xhr.responseText.length + "):" + xhr.responseText);
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


    refreshInfo:function(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                if(cc.vv.dataMgr.DEBUG) console.log(ret.errmsg);
            }
            else{
                if(ret.gems != null){
                    this.lblGems.string = ret.gems;    
                }
            }
        };

        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_user_status",data,onGet.bind(this));
    },
    
    refreshGemsTip:function(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                if(cc.vv.dataMgr.DEBUG) console.log(ret.errmsg);
            }
            else{
                cc.vv.userMgr.gemstip.version = ret.version;
                cc.vv.userMgr.gemstip.msg = ret.msg.replace("<newline>","\n");
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            type:"fkgm",
            version:cc.vv.userMgr.gemstip.version
        };
        cc.vv.http.sendRequest("/get_message",data,onGet.bind(this));
    },
    
    refreshNotice:function(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                if(cc.vv.dataMgr.DEBUG) console.log(ret.errmsg);
            }
            else{
                cc.vv.userMgr.notice.version = ret.version;
                cc.vv.userMgr.notice.msg = ret.msg;
                this.lblNotice.string = ret.msg;
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            type:"notice",
            version:cc.vv.userMgr.notice.version
        };
        cc.vv.http.sendRequest("/get_message",data,onGet.bind(this));
    },
    
    initButtonHandler:function(btnPath){
        var btn = cc.find(btnPath);
        cc.vv.utils.addClickEvent(btn,this.node,"Hall","onBtnClicked");        
    },
    
    
    
    initLabels:function(){



        this.lblName.string = cc.vv.userMgr.userName;
        this.lblMoney.string = cc.vv.userMgr.coins;
        this.lblGems.string = cc.vv.userMgr.gems;
        this.lblID.string = "ID:" + cc.vv.userMgr.userId;
    },


    testPoker:function () {
        var testPoker = [];
        testPoker.push(1133)
        testPoker.push(1134)
        testPoker.push(1034)
        testPoker.push(1170)
        testPoker.push(1160)

        var lastPoker = [];
        lastPoker.push(1151)
        var lzVlue = 5;
        var res =cc.vv.poker.getHints(testPoker,lastPoker,lzVlue);
        // var res =  cc.vv.poker.tryOutCard(testPoker,lastPoker,lzVlue,0);
        console.log("try out of cart === > "  , res)
    },

    onBtnClicked:function(event){
        if(event.target.name == "btn_shezhi"){
            this.settingsWin.active = true;
            // cc.vv.anysdkMgr.getPhoneInfo();
            //  this.testPoker();
        }
        else if(event.target.name == "btn_help"){
            this.helpWin.active = true;
        }
        else if(event.target.name == "btn_xiaoxi"){
            this.xiaoxiWin.active = true;
        }
        else if(event.target.name == "btn_zhanji"){
            this.history.active = true;
        }

        else if(event.target.name == "head"){
            cc.vv.userinfoShow.show(cc.vv.userMgr.userName,cc.vv.userMgr.userId,this.sprHeadImg,cc.vv.userMgr.sex,cc.vv.userMgr.ip);
        }
    },
    
    onJoinGameClicked:function(){
        this.joinGameWin.active = true;
    },
    onUpdatePanelClose:function(){
        if(cc.vv.dataMgr.DEBUG) console.log("hide update panel ")
        this.updatePanel.active = false;
    },

    onQuerybtnClick:function(){

        var userid = this.userid.string;
        if(cc.vv.dataMgr.DEBUG) console.log("查询＝＝＝＝",userid);
        var URL = cc.vv.http.giveUrl;
        // var URL = "http://192.168.1.150:9100";
        var self = this ;
        var onGetUserInfoOk = function (data) {
            if(data.errcode == 0 ){
                self.targetData ={};
                self.targetData.name = data.name;
                self.targetData.headimgurl = data.headimgurl;
                if(data.headimgurl != "" && data.headimgurl != null){
                    var imgLoader = self.queryHeadImg.node.getComponent("ImageLoader");
                    imgLoader.setUserHeadurl(data.headimgurl+".jpg");
                }
                self.targetData.token = data.token;
                self.targetData.time = data.time;
                self.targetName.string = data.name;
            }else if(data.errcode == 1){
                cc.vv.alert.show("","验证错误，为了您的账号安全请重新登陆");
                self.relogin.active = true;
            }else if(data.errcode == 2){
                cc.vv.alert.show("","查询无此人，请输入正确的ID");
            }

        }
            var data = {};
            data.account = cc.vv.userMgr.account;
            data.targetid = userid;
            data.sign = cc.vv.userMgr.sign;
            var xhr = cc.vv.http.sendRequest("/get_userinfo",data,function(ret){
                xhr = null;
                if(cc.vv.dataMgr.DEBUG) console.log("fuck to 正在连接服务器");
                onGetUserInfoOk(ret);
            },URL);
    },

    onGivebtnClick:function(){
        var gemcount = this.gemcount.string;
        gemcount = parseInt(gemcount);
        if (isNaN(gemcount) || gemcount < 0 || gemcount > 1000 ){
            cc.vv.alert.show("","请输入正确的数量");
            return;
        }
        var self = this;
        cc.vv.alert.show("","是否赠送"+this.targetData.name+"  "+gemcount+"张房卡",function(){
            // var URL = "http://192.168.1.150:9100";
            var URL = cc.vv.http.giveUrl;
            var userid = self.userid.string;
            var data = {};
            data.account = cc.vv.userMgr.account;
            data.token = self.targetData.token;
            data.time = self.targetData.time;
            data.num = gemcount;
            data.targetid = userid;
            data.sign = cc.vv.userMgr.sign;

            var onGetUserInfoOk = function (data) {
                if(cc.vv.dataMgr.DEBUG) console.log("fuck to 正在连接服务器ok ==>",data );
                if(data.errcode == 0 ){
                    cc.vv.alert.show("","赠送成功");
                    self.lblGems.string = parseInt(self.lblGems.string) - gemcount;
                    self.givepanel.active = false;
                }else if(data.errcode == 1) {
                    cc.vv.alert.show("","验证错误，为了您的账号安全请重新登陆");
                    self.relogin.active = true;
                }else if(data.errcode == 2) {
                    cc.vv.alert.show("","交易签名错误，为了您的账号安全请重新登陆");
                    self.relogin.active = true;
                }else if(data.errcode == 3) {
                    cc.vv.alert.show("","获取房卡信息失败");
                }else if(data.errcode == 4) {
                    cc.vv.alert.show("","房卡不足");
                }else if(data.errcode == 5) {
                    cc.vv.alert.show("","扣除房卡失败");
                }else if(data.errcode == 6) {
                    cc.vv.alert.show("","增加房卡失败，请联系管理员");
                }else if(data.errcode == 7) {
                    cc.vv.alert.show("","赠送失败，数量错误,最多只能赠送1000张");
                }else{
                    cc.vv.alert.show("","数量错误"+gemcount);
                }
            }
            var xhr = cc.vv.http.sendRequest("/transform_gems",data,function(ret){
                xhr = null;
                if(cc.vv.dataMgr.DEBUG) console.log("fuck to 正在连接服务器");
                onGetUserInfoOk(ret);
            },URL);

        },true);



    },


    onclosebtnClick:function(){
        this.givepanel.active = false;
    },
    onReloginBtnClick:function(){
        cc.sys.localStorage.removeItem("wx_account");
        cc.sys.localStorage.removeItem("wx_sign");
        cc.director.loadScene("login");
    },

    onReturnGameClicked:function(){
        if(cc.vv.dataMgr.getRoomId() != null || cc.vv.dataMgr.getRoomId() > 0 ){
            cc.director.loadScene("mjgame");
        }
    },
    
    onBtnAddGemsClicked:function(){
       cc.vv.alert.show("提示",cc.vv.userMgr.gemstip.msg);
       this.refreshInfo();
    },

    onBtnGiveGemsClicked:function(){
        this.givepanel.active = true;
    },

    onCreateRoomClicked:function(){
        if(cc.vv.dataMgr.getRoomId() != null){
            cc.vv.alert.show("提示","房间已经创建!\n必须解散当前房间才能创建新的房间");
            return;
        }
        if(cc.vv.dataMgr.DEBUG) console.log("onCreateRoomClicked");
        this.createRoomWin.active = true;   
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var x = this.lblNotice.node.x;
        x -= dt*100;
        if(x + this.lblNotice.node.width < -1000){
            x = 500;
        }
        this.lblNotice.node.x = x;
        
        if(cc.vv && cc.vv.userMgr.roomData != null){
            cc.vv.userMgr.enterRoom(cc.vv.userMgr.roomData);
            cc.vv.userMgr.roomData = null;
        }
    },
});
