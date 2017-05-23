cc.Class({
    extends: cc.Component,

    properties: {
        lblRoomNo:{
            default:null,
            type:cc.Label
        },
        phoneinfo:{
            default:null,
            type:cc.Node
        },
        _seats:[],
        _seats2:[],
        _ready:[],
        _begin:[],
        _timeLabel:null,
        _voiceMsgQueue:[],
        _lastPlayingSeat:null,
        _playingSeat:null,
        _lastPlayTime:null,
        _Begin:null,
        _parseTime:null,
        _Ready:null,
        _listenerIdOne:null,
        _listenerIdTwo:null,
        netPings:null,
        netPingsNode:null,
        wanfatishi:null,

    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }

        this.initEventHandlers();
        this.initView();
        this.initSeats();
        cc.vv.anysdkMgr.getPhoneInfo();
    },
    
    initView:function(){
        var prepare = this.node.getChildByName("prepare");
        var seats = prepare.getChildByName("seats");
        for(var i = 0; i < seats.children.length; ++i){
            this._seats.push(seats.children[i].getComponent("Seat"));
        }
        this.refreshBtns();
        this.lblRoomNo = cc.find("Canvas/prepare/infobar/Z_room_txt/New Label").getComponent(cc.Label);
        this.wanfatishi = cc.find("Canvas/wanfatishi");



        // this._timeLabel = cc.find("Canvas/prepare/infobar/time").getComponent(cc.Label);
        if(!this.phoneinfo){
            this.phoneinfo = cc.find("Canvas/bg/phoneinfo");
        }
        this._timeLabel = cc.find("Canvas/bg/phoneinfo/time/timenow").getComponent(cc.Label);
        this.lblRoomNo.string = cc.vv.dataMgr.getRoomId();
        this.netPings = cc.find("Canvas/prepare/nettime").getComponent(cc.Label);
        this.netPingsNode =  cc.find("Canvas/prepare/nettime");
        var gameChild = this.node.getChildByName("game");
        var sides = ["myself","right","rightup","leftup","left"];
        for(var i = 0; i < sides.length; ++i){
            var sideNode = gameChild.getChildByName(sides[i]);
            var seat = sideNode.getChildByName("seat");
            this._seats2.push(seat.getComponent("Seat"));
        }

        var  btnReady = cc.find("Canvas/prepare/btnReady");
        if(btnReady){
            btnReady.active = false ;
            this._Ready = btnReady;
            cc.vv.utils.addClickEvent(btnReady,this.node,"MJRoom","onBtnReadyClick");
        }

        var  btnBegin = cc.find("Canvas/prepare/btnBegin");
        if(btnBegin){
            // btnBegin.active = true ;
            this._Begin  = btnBegin;
            cc.vv.utils.addClickEvent(btnBegin,this.node,"MJRoom","onBtnBeginClick");
        }


        var btnWechat = cc.find("Canvas/prepare/btnWeichat");

        var isReview =  cc.vv.dataMgr.getGameReview();
        if(isReview){
            btnWechat.active = false;
        }

        if(btnWechat){
            cc.vv.utils.addClickEvent(btnWechat,this.node,"MJRoom","onBtnWeichatClicked");
        }
        this.schedule(this.netPing, 0.5);
        // this.schedule(this.phoneInfo, 5);

        this.roomRule();

        // if( cc.vv.dataMgr.getGameSync()){
        //     this.wanfatishi.active = false;
        // }else{
        //     this.wanfatishi.active = true;
        // }

    },


    roomRule:function () {
        var conf = cc.vv.dataMgr.getGameConfig();
        cc.vv.dataMgr.setKingVsTwo(conf.kingvs2);
        console.log("roolRule -=== > "  , conf);
        var jushu =  this.wanfatishi.getChildByName("haveCreateRoom").getChildByName("normalplay").getChildByName("xuanzejushu");


        if(conf.maxGames == 4){
            jushu.getChildByName("yiliu").active = false;
            jushu.getChildByName("eight").active = false;
            jushu.getChildByName("fours").active = true;
        }else if(conf.maxGames == 8){
            jushu.getChildByName("yiliu").active = false;
            jushu.getChildByName("eight").active = true;
            jushu.getChildByName("fours").active = false;
        }else if(conf.maxGames == 16){
            jushu.getChildByName("yiliu").active = true;
            jushu.getChildByName("eight").active = false;
            jushu.getChildByName("fours").active = false;
        }


        var difen =  this.wanfatishi.getChildByName("haveCreateRoom").getChildByName("normalplay").getChildByName("difenxuanze");

        if(conf.baseScore == 1){
            difen.getChildByName("yifen").active = true;
            difen.getChildByName("erfen").active = false;
            difen.getChildByName("wufen").active = false;
        }else if (conf.baseScore == 2){
            difen.getChildByName("yifen").active = false;
            difen.getChildByName("erfen").active = true;
            difen.getChildByName("wufen").active = false;
        }else if(conf.baseScore == 5){
            difen.getChildByName("yifen").active = false;
            difen.getChildByName("erfen").active = false;
            difen.getChildByName("wufen").active = true;
        }



        var fanshu =  this.wanfatishi.getChildByName("haveCreateRoom").getChildByName("normalplay").getChildByName("zuidafanshu");

        if(conf.maxfan == 4){
            fanshu.getChildByName("sifan").active = true;
            fanshu.getChildByName("bafan").active = false;
            fanshu.getChildByName("yiliufan").active = false;
        }else if(conf.maxfan == 8){
            fanshu.getChildByName("sifan").active = false;
            fanshu.getChildByName("bafan").active = true;
            fanshu.getChildByName("yiliufan").active = false;
        }else if(conf.maxfan == 16){
            fanshu.getChildByName("sifan").active = false;
            fanshu.getChildByName("bafan").active = false;
            fanshu.getChildByName("yiliufan").active = true;
        }




        var zhuangwei =  this.wanfatishi.getChildByName("haveCreateRoom").getChildByName("normalplay").getChildByName("zhuanfaxuanze");

        if(conf.zhuang == 0 ){
            zhuangwei.getChildByName("lunzhuang").active = true;
            zhuangwei.getChildByName("yingzhuang").active = false;
            zhuangwei.getChildByName("sanzhuang").active = false;
        }else if(conf.zhuang == 1 ){
            zhuangwei.getChildByName("lunzhuang").active = false;
            zhuangwei.getChildByName("yingzhuang").active = true;
            zhuangwei.getChildByName("sanzhuang").active = false;
        }else if(conf.zhuang == 2 ){
            zhuangwei.getChildByName("lunzhuang").active = false;
            zhuangwei.getChildByName("yingzhuang").active = false;
            zhuangwei.getChildByName("sanzhuang").active = true;
        }


        var bupai =  this.wanfatishi.getChildByName("haveCreateRoom").getChildByName("normalplay").getChildByName("bupaixuanze");

        if(conf.bupai == 0 ){
            bupai.getChildByName("quanbu").active = true;
            bupai.getChildByName("mobu").active = false;
        }else if(conf.bupai == 1){
            bupai.getChildByName("quanbu").active = false;
            bupai.getChildByName("mobu").active = true;
        }



        var laizi = this.wanfatishi.getChildByName("haveCreateRoom").getChildByName("chooseplay").getChildByName("laizi");
        if(conf.laizi == 1){
            laizi.active = true;
        }else{
            laizi.active = false;
        }


        var kingvstwo = this.wanfatishi.getChildByName("haveCreateRoom").getChildByName("chooseplay").getChildByName("kingvstwo");
        if(conf.kingvs2 == 2){
            kingvstwo.active = true;
        }else{
            kingvstwo.active = false;
        }


        var roundfan = this.wanfatishi.getChildByName("haveCreateRoom").getChildByName("chooseplay").getChildByName("roundfan");
        if(conf.roundfan == 1){
            roundfan.active = true;
        }else{
            roundfan.active = false;
        }



        var lfone = this.wanfatishi.getChildByName("haveCreateRoom").getChildByName("chooseplay").getChildByName("leftone");
        if(conf.leftone == 1){
            lfone.active = true;
        }else{
            lfone.active = false;
        }


        var leftfan = this.wanfatishi.getChildByName("haveCreateRoom").getChildByName("chooseplay").getChildByName("leftfan");

        if(conf.leftfan == 1){
            leftfan.active = true;
        }else{
            leftfan.active = false;
        }

        var leftking = this.wanfatishi.getChildByName("haveCreateRoom").getChildByName("chooseplay").getChildByName("leftking");

        if(conf.leftking == 1){
            leftking.active = true;
        }else{
            leftking.active = false;
        }


    },


    refreshBtns:function(){
        var prepare = this.node.getChildByName("prepare");
        var btnExit = prepare.getChildByName("btnExit");
        var btnDispress = prepare.getChildByName("btnDissolve");
        var btnWeichat = prepare.getChildByName("btnWeichat");
        var btnBack = prepare.getChildByName("btnBack");
        var isIdle = cc.vv.dataMgr.numOfGames == 0;
        btnExit.active = !cc.vv.dataMgr.isOwner() && isIdle;
        btnDispress.active = cc.vv.dataMgr.isOwner() && isIdle;
        btnWeichat.active = isIdle;
        btnBack.active = isIdle;
    },
    phoneInfo:function () {
        // cc.vv.anysdkMgr.getPhoneInfo();
        if(!this.phoneinfo){
            this.phoneinfo = cc.find("Canvas/bg/phoneinfo");
        }
        var netType = cc.vv.anysdkMgr.netWorkType
        var strength = cc.vv.anysdkMgr.netWortStrength;
        var batteryLevel = cc.vv.anysdkMgr.batteryLevel;;
        if(netType < 5 ){
            this.phoneinfo.getChildByName("mobilenet").active = true;
            this.phoneinfo.getChildByName("wifinet").active = false;
            for(var i = 0 ; i < 5 ; ++ i ){
                if(i == strength){
                    this.phoneinfo.getChildByName("mobilenet").getChildByName("net_"+i).active = true;
                }else{
                    this.phoneinfo.getChildByName("mobilenet").getChildByName("net_"+i).active = false;
                }

            }
        }
        else if(netType == 5 ){
            this.phoneinfo.getChildByName("mobilenet").active = false;
            this.phoneinfo.getChildByName("wifinet").active = true;
            for(var i = 0 ; i < 5 ; ++ i ){
                if(i == strength){
                    this.phoneinfo.getChildByName("wifinet").getChildByName("wifi_"+i).active = true;
                }else{
                    this.phoneinfo.getChildByName("wifinet").getChildByName("wifi_"+i).active = false;
                }

            }
        }


    },


        initEventHandlers:function(){
        var self = this;

        cc.eventManager.removeCustomListeners(cc.game.EVENT_HIDE);
        cc.eventManager.removeCustomListeners(cc.game.EVENT_SHOW);


        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){
            if(cc.vv.dataMgr.DEBUG) console.log("游戏进入后台");
            self._parseTime = new Date().getTime();
            // cc.vv.net.close();
            // cc.vv.dataMgr.setRunInBack(true);
            // cc.vv.net.close();
        });
          cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){
              if(cc.vv.dataMgr.DEBUG) console.log("重新回到游戏!");
              // cc.vv.dataMgr.setRunInBack(false);
            if(new Date().getTime() - self._parseTime > 10*1000){
                cc.vv.net.close();
            }
        });

        this.node.on('new_user',function(data){
            self.initSingleSeat(data.detail);
        });


        
        this.node.on('user_state_changed',function(data){
            if(cc.vv.dataMgr.DEBUG) console.log("user satate change ");
            self.initSingleSeat(data.detail);
            // self.initSeats();
        });


        this.node.on('net_change',function(data){
            self.netChange(data.detail);
        });

        this.node.on('bettery_change',function(data){
            self.betteryChang(data.detail);
        });
        this.node.on('netStrength_change',function(data){
            self.netStrengthChang(data.detail);
        });


            this.node.on('game_begin',function(data){
            self.refreshBtns();
            self.initSeats();
        });

        this.node.on('ready_status',function(data){
            if(cc.vv.dataMgr.DEBUG) console.log("====ready_status==========>>>");
        });

        this.node.on('cant_start_',function(data){
            if(cc.vv.dataMgr.DEBUG) console.log("====cant_start_==========>>>");
            self.CantStart(data.detail);
        });



        this.node.on('game_num',function(data){
            self.refreshBtns();
        });

        this.node.on('voice_msg',function(data){
            var data = data.detail;
            self._voiceMsgQueue.push(data);
            self.playVoice();
        });
        
        this.node.on('chat_push',function(data){
            var data = data.detail;
            if(cc.vv.dataMgr.DEBUG) console.log("chat_push====== > " , data);
            var idx = cc.vv.dataMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.dataMgr.getLocalIndex(idx);
            self._seats[localIdx].chat(data.content);
            self._seats2[localIdx].chat(data.content);
        });
        
        this.node.on('quick_chat_push',function(data){
            var data = data.detail;
            var idx = cc.vv.dataMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.dataMgr.getLocalIndex(idx);
            
            var index = data.content;
            var info = cc.vv.chat.getQuickChatInfo(index);
            self._seats[localIdx].chat(info.content);
            self._seats2[localIdx].chat(info.content);
            
            cc.vv.audioMgr.playSFX(info.sound);
        });
        
        this.node.on('emoji_push',function(data){
            var data = data.detail;
            var idx = cc.vv.dataMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.dataMgr.getLocalIndex(idx);
            if(cc.vv.dataMgr.DEBUG) console.log(data);
            self._seats[localIdx].emoji(data.content);
            self._seats2[localIdx].emoji(data.content);
        });
    },

    initSeats:function(){
        //如果是房主 显示开局按钮
        if(cc.vv.dataMgr.getIsCreatorById(cc.vv.userMgr.userId) && cc.vv.dataMgr.getNumOfGames() == 0  ){
            this._Begin.active  = true;
            this._Ready.active  = false;
        }else{
            this._Ready.active  = true;
            this._Begin.active  = false;
        }
        var seats = cc.vv.dataMgr.seats;
        for(var i = 0; i < seats.length; ++i){
            this.initSingleSeat(seats[i]);
        }
    },


    netChange:function (netType) {

        console.log("netChange========>>. " , netType);

        if(!this.phoneinfo){
            this.phoneinfo = cc.find("Canvas/bg/phoneinfo");
        }
        if(parseInt(netType) == 2 ) {
            this.phoneinfo.getChildByName("mobilenet").active = true;
            this.phoneinfo.getChildByName("wifinet").active = false;
        }else if(parseInt(netType) == 1 ){
            this.phoneinfo.getChildByName("mobilenet").active = false;
            this.phoneinfo.getChildByName("wifinet").active = true;
        }
    },
    netStrengthChang:function (strength) {

        console.log("netString cheang =-- > " , strength);

        if(!this.phoneinfo){
            this.phoneinfo = cc.find("Canvas/bg/phoneinfo");
        }
        var netType = cc.vv.anysdkMgr.netWorkType;
        console.log("netType=======" , netType);
        if(parseInt(netType) == 2 ){
            this.phoneinfo.getChildByName("mobilenet").active = true;
            this.phoneinfo.getChildByName("wifinet").active = false;
            for(var i = 0 ; i < 5 ; ++ i ){
                console.log("mobilenet===strength====" , strength);
                if(i == strength){
                    this.phoneinfo.getChildByName("mobilenet").getChildByName("net_"+i).active = true;
                }else{
                    this.phoneinfo.getChildByName("mobilenet").getChildByName("net_"+i).active = false;
                }
            }
        }
        else if(parseInt(netType) == 1 ){
            this.phoneinfo.getChildByName("mobilenet").active = false;
            this.phoneinfo.getChildByName("wifinet").active = true;
            for(var i = 0 ; i < 5 ; ++ i ){
                console.log("wifinet===strength====" , strength);
                if(i == strength){
                    this.phoneinfo.getChildByName("wifinet").getChildByName("wifi_"+i).active = true;
                }else{
                    this.phoneinfo.getChildByName("wifinet").getChildByName("wifi_"+i).active = false;
                }

            }
        }

    },


    betteryChang:function (batteryLevel) {
        if(!this.phoneinfo){
            this.phoneinfo = cc.find("Canvas/bg/phoneinfo");
        }
        if(batteryLevel < 0.15){
            this.phoneinfo.getChildByName("battery").getChildByName("battery_1").active = true;
            this.phoneinfo.getChildByName("battery").getChildByName("battery_3").active = false;
        }else {
            this.phoneinfo.getChildByName("battery").getChildByName("battery_1").active = false;
            this.phoneinfo.getChildByName("battery").getChildByName("battery_3").active = true;
            this.phoneinfo.getChildByName("battery").getChildByName("battery_3").scaleX = batteryLevel;
        }
    },




    initSingleSeat:function(seat){
        var iscreator = cc.vv.dataMgr.getIsCreatorById(cc.vv.userMgr.userId);
        var index = cc.vv.dataMgr.getLocalIndex(seat.seatindex);
        var isOffline = !seat.online;
        if(cc.vv.dataMgr.DEBUG) console.log("fuck to isOneine " , isOffline);
        var isZhuang = seat.zhuang
        this._seats[index].setInfo(seat.name,seat.score,seat.userid);
        this._seats[index].setReady(seat.ready);
        this._seats[index].setOffline(isOffline);
        this._seats[index].setID(seat.userid);
        this._seats[index].voiceMsg(false);
        this._seats[index].setCreator(seat.iscreator)
        this._seats[index].setKick(iscreator);
        this._seats2[index].setInfo(seat.name,seat.score,seat.userid);
        this._seats2[index].setZhuang(isZhuang);
        this._seats2[index].setID(seat.userid);
        this._seats2[index].setOffline(isOffline);
        this._seats2[index].voiceMsg(false);
        this._seats2[index].refreshXuanPaiState();
    },

    CantStart:function (error) {

        // var isCreator = cc.vv.dataMgr.getIsCreatorById(cc.vv.userMgr.userId);
        // if (isCreator){
        //     this._Begin.active = true;
        //
        // }
        if(cc.vv.dataMgr.getIsCreatorById(cc.vv.userMgr.userId) ){
            this._Begin.active  = true;
            if (error == 1 ){
                cc.vv.alert.show("","您不是房主不能开始!");
            }else if (error ==2 ){
                cc.vv.alert.show("","其他玩家未准备!");
            }else if (error ==3 ){
                cc.vv.alert.show("","其他玩家不在线!");
            }else if (error == 4){
                cc.vv.alert.show("","邀请好友之后再进行游戏!");
            }



        }

    },


    onBtnSettingsClicked:function(){
        cc.vv.popupMgr.showSettings();   
    },

    onBtnBackClicked:function(){
        cc.vv.alert.show("","返回大厅房间仍会保留，快去邀请大伙来玩吧！",function(){
            cc.director.loadScene("hall");    
        },true);
    },
    
    onBtnChatClicked:function(){
        
    },

    onBtnReadyClick:function () {
        if(cc.vv.dataMgr.DEBUG) console.log("fuck on btn ready click kkk");
        cc.vv.net.send('ready');
        this._Ready.active = false ;
    },

    netPing: function netPing() {
        if(cc.vv.net.timeOutPool.length > 1 ){
            this.netPingsNode.setColor(cc.color(167, 152, 152, 255));
            this.netPings.string = "网络糟糕";
        }else if (cc.vv.net.pingTime < 200) {
            this.netPingsNode.setColor(cc.color(0, 255, 0, 255));
            this.netPings.string = "网络良好";
        } else if (cc.vv.net.pingTime > 200 && cc.vv.net.pingTime < 500) {
            this.netPingsNode.setColor(cc.color(240, 200, 0, 255));
            this.netPings.string = "网络正常";
        }else{
            this.netPingsNode.setColor(cc.color(167, 152, 152, 255));
            this.netPings.string = "网络糟糕";
        }
    },


    onBtnBeginClick:function () {
        var self = this;
        if(cc.vv.dataMgr.DEBUG) console.log("fuck on btn onBtnBeginClick click kkk",cc.vv.dataMgr.getPlayerSeatsLength());
        var playCount = cc.vv.dataMgr.getPlayerSeatsLength();
        if(playCount < 5 ){
            cc.vv.alert.show("","人数不足够5人，是否开始游戏？",function(){
                cc.vv.net.send('startGame');
                self._Begin.active = false ;
            },true);
        }else{
            console.log("start game ");
            cc.vv.net.send('startGame');
        }




    },
    onBtnWeichatClicked:function(){
        var title = "<干瞪眼>";
        cc.vv.anysdkMgr.share("干瞪眼" + title,"房号:" + cc.vv.dataMgr.getRoomId()+ "\n 玩法:"+cc.vv.gameNetMgr.getWanfa() + " \n不服来战");
    },
    onBtnDissolveClicked:function(){
        var isReview =  cc.vv.dataMgr.getGameReview();
        if(isReview){
            cc.vv.alert.show("","是否确定解散？",function(){
                cc.vv.net.send("dispress");
            },true);
        }else{
            cc.vv.alert.show("","解散房间不扣房卡，是否确定解散？",function(){
                cc.vv.net.send("dispress");
            },true);
        }

    },
    onBtnExit:function(){
        cc.vv.net.send("exit");
    },
    
    playVoice:function(){
        if(this._playingSeat == null && this._voiceMsgQueue.length){
            if(cc.vv.dataMgr.DEBUG) console.log("playVoice2");
            var data = this._voiceMsgQueue.shift();
            var idx = cc.vv.dataMgr.getSeatIndexByID(data.sender);
            var localIndex = cc.vv.dataMgr.getLocalIndex(idx);
            this._playingSeat = localIndex;
            this._seats[localIndex].voiceMsg(true);
            this._seats2[localIndex].voiceMsg(true);
            var msgInfo = JSON.parse(data.content);
            var msgfile = "voicemsg.amr";
            if(cc.vv.dataMgr.DEBUG) console.log(msgInfo.msg.length);
            cc.vv.voiceMgr.writeVoice(msgfile,msgInfo.msg);
            cc.vv.voiceMgr.play(msgfile);
            this._lastPlayTime = Date.now() + msgInfo.time;
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var minutes = Math.floor(Date.now()/1000/60);
        if(this._lastMinute != minutes){
            this._lastMinute = minutes;
            var date = new Date();
            var h = date.getHours();
            h = h < 10? "0"+h:h;
            
            var m = date.getMinutes();
            m = m < 10? "0"+m:m;
            if(this._timeLabel){
                this._timeLabel.string = "" + h + ":" + m;
            }

        }
        if(this._lastPlayTime != null){
            if(Date.now() > this._lastPlayTime + 200){
                this.onPlayerOver();
                this._lastPlayTime = null;    
            }
        }
        else{
            this.playVoice();
        }
    },

    onOptionClicked:function(event){

        console.log("===event====",event.target.name);
        if(event.target.name == "btnBegin"){
            // cc.vv.net.send('ready');
            if(cc.vv.dataMgr.DEBUG) console.log("11event.target.name--->"  ,event.target.name);
        }
        else if(event.target.name == "btnReady"){
            // cc.vv.net.send('ready');
            if(cc.vv.dataMgr.DEBUG) console.log("22event.target.name--->"  ,event.target.name);
        } else if(event.target.name == "guize"){
            this.wanfatishi.getChildByName("fangjianguize").active = false;
            this.wanfatishi.getChildByName("haveCreateRoom").active = true;
        } else if(event.target.name == "wanfa"){
            this.wanfatishi.getChildByName("fangjianguize").active = true;
            this.wanfatishi.getChildByName("haveCreateRoom").active = false;

        }else if(event.target.name == "btn_back"){
            this.wanfatishi.active = false;
        }else if(event.target.name == "btn_info"){
            console.log("fucn to wafatishi");
            this.wanfatishi.active = true;
        }
    },

    onPlayerOver:function(){
        cc.vv.audioMgr.resumeAll();
        if(cc.vv.dataMgr.DEBUG) console.log("onPlayCallback:" + this._playingSeat);
        var localIndex = this._playingSeat;
        this._playingSeat = null;
        this._seats[localIndex].voiceMsg(false);
        this._seats2[localIndex].voiceMsg(false);
    },
    
    onDestroy:function(){
        if(cc.vv){
            cc.vv.voiceMgr.stop();
            cc.vv.voiceMgr.onPlayCallback = null;
        }

    }
});
