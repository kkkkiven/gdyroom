cc.Class({
    extends: cc.Component,

    properties: {
        gameRoot:{
            default:null,
            type:cc.Node
        },
        prepareRoot:{
            default:null,
            type:cc.Node
        },
        bottomAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        gameover:{
            default:null,
            type:cc.Node,
        },
        pokerItem:{
            default:null,
            type:cc.Node,
        },
        beipai:{
            default:null,
            type:cc.Node
        },
        phoneinfo:{
            default:null,
            type:cc.Node
        },
        roominfo:{
            default:null,
            type:cc.Node
        },
        fapaiqi:{
            default:null,
            type:cc.Node
        },
        //
        _myMJArr:[],
        _timeLabel:null,
        _options:null,
        _selectedMJ:null,
        _mjcount:null,
        _gamecount:null,
        _playEfxs:[],

        _optNum:-1,
        _optAction:null,
        _gameChild:null,
        _btnReady:null,
        barCopy:null,

        firstTrun:true,
        _fapaiPos:null,
        _jieSuanAnimaltiom:null,
        _jieSuanPanel:null,
        _resoultTimeOut:null,
        _updateTimeOut:null,
        _sides:null,
        netPings: null,
        netPingsNode: null,
        chupaiArr:[],
        chupaiIds:[],
        minPoker:null,
        fanshu:null,
        paishu:null,
        lunshu:null,
        lzAnimation:null,
        lzBg:null,
        laizi:null,
        laiziAniFlag:false,
        tongbu:false,

        tishiIndex:0,


        BUCHU:1,
        CHUPAI:2,
        TISHI:3,

    },

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
        this.addComponent("NoticeTip");
        this.addComponent("GameOver");
        this.addComponent("MJRoom");
        this.addComponent("GameResult");
        this.addComponent("Chat");
        this.addComponent("PopupMgr");
        this.addComponent("ReConnect");
        this.addComponent("Voice");
        this.addComponent("UserInfoShow");
        this.initView();
        this.initEventHandlers();
        this.gameRoot.active = false;
        this.prepareRoot.active = true;
        this.initWanfaLabel();
        this.onGameBeign();
        this.onTouchPoker();
        cc.vv.audioMgr.playBGM("horse/bgBet.mp3");
    },

    initView:function(){

        this._timeLabel = cc.find("Canvas/bg/phoneinfo/time/timenow").getComponent(cc.Label);
        if(!this.phoneinfo){
            this.phoneinfo = cc.find("Canvas/bg/phoneinfo");
        }

        this.netPings = cc.find("Canvas/game/nettime").getComponent(cc.Label);
        this.netPingsNode = cc.find("Canvas/game/nettime");
        this.lzAnimation = cc.find("Canvas/game/lzanimation");
        this.lzBg = cc.find("Canvas/game/laizibg");
        this.laizi = cc.find("Canvas/game/laizibg/laizi").getComponent(cc.Sprite);
        var sides = ["myself","right","rightup","leftup","left"];
        this._sides = sides;
        var fapaisides = [{x:31,y:-555},{x:530,y:-165},{x:530,y:110},{x:-620,y:110},{x:-620,y:-135}];
        this._fapaiPos = fapaisides;
        //搜索需要的子节点
        var gameChild = this.node.getChildByName("game");
        this._btnReady = gameChild.getChildByName('ready');
        this._gameChild = gameChild;
        this._gamecount = this.roominfo.getChildByName('jushu').getComponent(cc.Label);
        this._gamecount.string = "" + (cc.vv.dataMgr.numOfGames+1) + "/" + cc.vv.dataMgr.maxNumOfGames + "";
        var roomNum = this.roominfo.getChildByName('fanghao').getComponent(cc.Label);
        roomNum.string = "房号:"+cc.vv.dataMgr.getRoomId();

        this.paishu = this.roominfo.getChildByName('shengpai').getComponent(cc.Label);
        this.paishu.string = cc.vv.dataMgr.getPaiCount();


        this.lunshu = this.roominfo.getChildByName('lunshu').getComponent(cc.Label);
        this.lunshu.string = cc.vv.dataMgr.getLunCount();

        this.fanshu = this.roominfo.getChildByName('beishu').getComponent(cc.Label);
        this.fanshu.string = cc.vv.dataMgr.getFanCout();

        var myselfChild = gameChild.getChildByName("myself");
        var doAction = myselfChild.getChildByName("doAction");


        var myholds = myselfChild.getChildByName("holds");
        this._options = doAction;


        for(var i = 0; i < myholds.children.length; ++i){
            var sprite = myholds.children[i].getComponent(cc.Sprite);
            this._myMJArr.push(sprite);
            sprite.spriteFrame = null;
        }
        var realwidth = cc.director.getVisibleSize().width;
        myholds.scaleX *= realwidth/1280;
        myholds.scaleY *= realwidth/1280;
        for(var i = 0; i < sides.length; ++i){
            var side = sides[i];
            var sideChild = gameChild.getChildByName(side);
            sideChild.active = false ;
            this._playEfxs.push(sideChild.getChildByName("jiesuan").getComponent(cc.Animation));
        }

    },

    onTouchPoker:function () {

        // 创建一个事件监听器 OneByOne 为单点触摸
        var touchFlag = 1;
        var self = this;

        var seats = cc.vv.dataMgr.seats;
        var index = cc.vv.dataMgr.getSeatIndexByID(cc.vv.userMgr.userId);
        var seatData = seats[index];
        this.sortHolds(seatData);
        console.log("fuck to setaDa" ,seatData );

        var myselfChild = this._gameChild.getChildByName("myself");
        var touchBe;
        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞掉事件，不再向下传递。
            onTouchBegan: function (touch, event) {     //实现 onTouchBegan 事件处理回调函数
                // 获取当前触摸点相对于按钮所在的坐标
                touchBe = touch.getLocation();
                for(var i = 1 ; i < 17 ; ++ i ){
                    var spriteName = "Canvas/game/myself/holds/poker"+i+"";
                   var sprite =  cc.find(spriteName);
                    var locationInNode = sprite.convertToNodeSpace(touch.getLocation());
                    var s = sprite.getContentSize();
                    var rect = cc.rect(0, 0, s.width-38, s.height);

                    if (cc.rectContainsPoint(rect, locationInNode)) {       // 判断触摸点是否在按钮范围内
                        if(sprite.y == 0 ){
                            sprite.y = 15;
                            self.chupaiArr.push(seatData.holds[i-1]);
                        }else{
                            sprite.y = 0;
                            self.selectDelete(seatData.holds[i-1]);
                        }
                    }
                }

                return true;
            },
            onTouchMoved: function (touch, event) {         //实现onTouchMoved事件处理回调函数, 触摸移动时触发
                // 移动当前按钮精灵的坐标位置

                if(Math.abs( touch.getLocation().x -touchBe.x) < 15  ){
                    return ;
                }

                for(var i = 1 ; i < 17 ; ++ i ){
                    var spriteName = "Canvas/game/myself/holds/poker"+i+"";
                    var sprite =  cc.find(spriteName);
                    var locationInNode = sprite.convertToNodeSpace(touch.getLocation());
                    var s = sprite.getContentSize();
                    var rect = cc.rect(0, 0, s.width-38, s.height);

                    if (cc.rectContainsPoint(rect, locationInNode)) {       // 判断触摸点是否在按钮范围内
                        if(touchFlag % 2 == 1 ){
                            if(sprite.y == 0 ){
                                sprite.y = 15;
                                self.chupaiArr.push(seatData.holds[i-1]);
                            }
                        }
                        else{
                            sprite.y = 0;
                            self.selectDelete(seatData.holds[i-1]);
                        }
                    }
                }
            },
            onTouchEnded: function (touch, event) {         // 实现onTouchEnded事件处理回调函数
                touchFlag = touchFlag + 1 ;
            }
        });
        for(var i = 1 ; i < 17 ; ++ i ){

            var spriteName = "Canvas/game/myself/holds/poker"+i+"";
            var sprite =  cc.find(spriteName);
            cc.eventManager.addListener(listener1.clone(), sprite);
        }

    },

    selectDelete:function (value) {
      for(var i = 0 ; i < this.chupaiArr.length ; ++ i ){
          if(this.chupaiArr[i] == value){
              this.chupaiArr.splice(i,1);
          }
      }
    },


    initEventHandlers:function(){
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        //初始化事件监听器
        var self = this;


        this.node.on('game_tongbu',function(data){
            if(cc.vv.dataMgr.DEBUG) console.log("tong bu run ");
            self.onGameBeign();
            self.syncInitMahjongs();
        });

        this.node.on('game_holds',function(data){
           self.initMahjongs();
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
            self._gamecount.string = "" + (cc.vv.dataMgr.getNumOfGames()+1) + "/" + cc.vv.dataMgr.maxNumOfGames + "";
            self.onGameBeign();
        });
        this.node.on('game_turn',function(data){
            self.showTrun(data.detail);
        });

        this.node.on('holds_add',function(data){
            self.HoldAdd(data.detail);
            if(cc.vv.dataMgr.DEBUG) console.log("hold add sync ======o=o=o=o==o=o=")


        });

        this.node.on('game_pass',function(data){
            // self.HoldAdd(data);
            if(cc.vv.dataMgr.DEBUG) console.log("game_passso=o=o==o=o=")
            self.playSound(10,0);

        });


        this.node.on('new_round',function(data){
            // self.HoldAdd(data);
            if(cc.vv.dataMgr.DEBUG) console.log("new_round add sync ======o=o=o=o==o=o=",data)
            self.paishu.string = cc.vv.dataMgr.getPaiCount();
            self.lunshu.string =cc.vv.dataMgr.getLunCount();
            self.fanshu.string =cc.vv.dataMgr.getFanCout();

        });
        this.node.on('error_card',function(data){
            // self.HoldAdd(data);
            if(cc.vv.dataMgr.DEBUG) console.log("hold add sync ======o=o=o=o==o=o=")
            self.showAction(data.detail);
        });



        this.node.on('game_chupai',function(data){
            // self.HoldAdd(data);
            if(cc.vv.dataMgr.DEBUG) console.log("hgame_chupai ======o=o=o=o==o=o=",data.detail);
            self.hideOptions();
            self.chuPai(data.detail);
            self.chupaiIds = data.detail.ids;

        });





        this.node.on('user_ready_changed',function(data){
            self.UserStateChange(data.detail);
        });
        this.node.on('new_option',function(data){
            console.log("new option ==== > " , data.detail);
            self.showAction(data.detail);
        });


        this.node.on('game_option',function(data){
            var index = cc.vv.dataMgr.getSeatIndexByID(data.detail.userId);
            var localIndex = cc.vv.dataMgr.getLocalIndex(index);
            var seatData =  cc.vv.dataMgr.getSeatDataByIndex(index);

            if(data.detail.auto){
                self.showRobot(seatData,localIndex);
            }
            var sound = data.detail.op;
            // self.playSound(sound);


        });

        this.node.on('game_num',function(data){
            self._gamecount.string = "" + (cc.vv.dataMgr.numOfGames+1) + "/" + cc.vv.dataMgr.maxNumOfGames + "";
        });

        this.node.on('game_over_one',function(data){
            if(self.barCopy) {
                self.barCopy.totalLength = 0 ;
                self.barCopy = null;
            }
             self.showResult(data.detail);
        });
    },


    initWanfaLabel:function(){
        var wanfa = cc.find("Canvas/prepare/infobar/wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.gameNetMgr.getWanfa();
    },


    onGameBeign:function(){
        if(cc.vv.dataMgr.gamestate == "" ){
            return;
        }
        for(var i = 0; i < this._playEfxs.length; ++i){
            this._playEfxs[i].node.active = false;
        }
        this.fapaiqi.removeAllChildren();

        this.firstTrun = true;
        this.gameRoot.active = true;
        // this._jieSuanPanel.active = false;
        this.prepareRoot.active = false;

        var self = this ;
        self._updateTimeOut =  setTimeout(self.schedule(this.oneSecUpdate, 0.01),3000);
        this.schedule(this.addHoldUpdate, 0.1);
        this.schedule(this.netPing, 0.5);
        // this.schedule(this.phoneInfo, 5); console.log("fuck to trure opt === > ")
        console.log("fuck to trure opt === > ",cc.vv.dataMgr.turnOpt)


        if(cc.vv.dataMgr.getGameSync()){
            this.tongbu = true;
        }

        if (cc.vv.dataMgr.turnOpt!= -1 ){
            this.showTrun(cc.vv.dataMgr.turnOpt);
            var index = cc.vv.dataMgr.getSeatIndexByID(cc.vv.userMgr.userId);
            if(cc.vv.dataMgr.turnOpt == index ){
                this.showAction(cc.vv.dataMgr.turnOpt);
            }
            cc.vv.dataMgr.turnOpt= -1;
        }




        if(cc.vv.dataMgr.getGameSync()){
            this.syncInitMahjongs();
            cc.vv.dataMgr.resetGameSync();
        }else{
            this.initMahjongs();
        }

        if(cc.vv.dataMgr.curaction != null){
            cc.vv.dataMgr.curaction = null;
        }
    },


    showRobot:function (seatdata,index) {
        var sideChild = this._gameChild.getChildByName(this._sides[index]);
        var robot = sideChild.getChildByName("seat").getChildByName("robot");
        robot.active = true;
    },

    faPai:function (seatdata,pai,isGong) {
        this.fapaiqi.removeAllChildren()
        cc.vv.audioMgr.playSFX("card.mp3");

        if(seatdata.holds == null){
            return;
        }
        // var pp = cc.vv.poker.num2Obj(pai,cc.vv.dataMgr.getLzNum());
        seatdata.holds.push(pai);
        var index = cc.vv.dataMgr.getLocalIndex(seatdata.seatindex);
        // var faPos = this._fapaiPos[index];
        // var beipai = cc.instantiate(this.beipai);
        // beipai.active = true;
        // beipai.setPosition(cc.p(0,0));
        // this.fapaiqi.addChild(beipai)
        // var moveTo1 =cc.moveTo(0.1, faPos);
        // var action1 = cc.fadeTo(0.1, 0);
        // beipai.runAction(cc.sequence(moveTo1, action1));
        var sideChild = this._gameChild.getChildByName(this._sides[index]);
        sideChild.getChildByName("pokercount").active = true;
        var pokerCount = sideChild.getChildByName("pokercount").getComponent(cc.Label);
        var holds = seatdata.holds;
        pokerCount.string = holds.length;
        this.showPoker(seatdata);
    },

    phoneInfo:function () {
        // cc.vv.anysdkMgr.getPhoneInfo();
        var netType = cc.vv.anysdkMgr.netWorkType
        var strength = cc.vv.anysdkMgr.netWortStrength;
        var batteryLevel = cc.vv.anysdkMgr.batteryLevel;
        if(!this.phoneinfo){
            this.phoneinfo = cc.find("Canvas/bg/phoneinfo");
        }
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

       if(batteryLevel < 0.15){
           this.phoneinfo.getChildByName("battery").getChildByName("battery_1").active = true;
           this.phoneinfo.getChildByName("battery").getChildByName("battery_3").active = false;
       }else{
           this.phoneinfo.getChildByName("battery").getChildByName("battery_1").active = false;
           this.phoneinfo.getChildByName("battery").getChildByName("battery_3").active = true;
           this.phoneinfo.getChildByName("battery").getChildByName("battery_3").scaleX = batteryLevel;

       }
    },


    netChange:function (netType) {
        if(netType < 5 ) {
            this.phoneinfo.getChildByName("mobilenet").active = true;
            this.phoneinfo.getChildByName("wifinet").active = false;
        }else if(netType == 5 ){
            this.phoneinfo.getChildByName("mobilenet").active = false;
            this.phoneinfo.getChildByName("wifinet").active = true;
        }
    },
    netStrengthChang:function (strength) {
        var netType = cc.vv.anysdkMgr.netWorkType;
        if(!this.phoneinfo){
            this.phoneinfo = cc.find("Canvas/bg/phoneinfo");
        }
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

    clearChuPai:function () {

        for(var i = 0 ; i < 5 ; ++ i ){
            var sideChild = this._gameChild.getChildByName(this._sides[i]);
            this._playEfxs[i].node.active = false;
            var pokerHold = sideChild.getChildByName("pokerholds");
            if(i == 1 || i == 2 ){
                pokerHold.x = pokerHold.x+pokerHold.childrenCount *30;
            }
            pokerHold.removeAllChildren();

        }
    },

    chuPai:function (data) {
        this.clearChuPai();

        // if( !this.tongbu ){
        //     this.hideOptions();
        // }
        //
        // this.tongbu = false;

        console.log("chupai ======= > " , data )
        var ids = data.ids ; //玩家出的牌
        var pokerType = data.type; //玩家出的牌型
        var num = data.num ; //玩家剩下的牌
        var uid = data.uid ;//玩家的ID
        var fan = data.fan;
        var lastUid = data.lastUid;
        var soundVlue = parseInt((ids[0]- 1000)/10);
        if(this.fanshu){
           this.fanshu.string = fan + "";
        }

        var index  = cc.vv.dataMgr.getSeatIndexByID(uid);
        var localIndex = cc.vv.dataMgr.getLocalIndex(index)
        if(pokerType == cc.vv.poker.SINGLE){   //播放动画与声音
           if(lastUid != 0 ){
               this.playSound(9,soundVlue);
           }else{
               this.playSound(pokerType,soundVlue);
           }

        }else if(pokerType == cc.vv.poker.PAIR){
            if(lastUid != 0 ){
                this.playSound(9,soundVlue);
            }else{
                this.playSound(pokerType,soundVlue);
            }
        }else if(pokerType == cc.vv.poker.DAN_SHUN){
            if(lastUid != 0 ){
                this.playSound(9,soundVlue);
            }else{
                this.playSound(pokerType,soundVlue);
            }
            this._playEfxs[localIndex].node.active = true;
            this._playEfxs[localIndex].play("play_shunzi");
        }else if(pokerType == cc.vv.poker.SHUANG_SHUN){
            if(lastUid != 0 ){
                this.playSound(9,soundVlue);
            }else{
                this.playSound(pokerType,soundVlue);
            }
            this._playEfxs[localIndex].node.active = true;
            this._playEfxs[localIndex].play("play_liandui");
        }else if(pokerType == cc.vv.poker.SOFT_BOMB){
            this.playSound(pokerType,soundVlue);
            this._playEfxs[localIndex].node.active = true;
            this._playEfxs[localIndex].play("play_softbom");
        }else if(pokerType == cc.vv.poker.HARD_BOMB){
            this.playSound(pokerType,soundVlue);
            this._playEfxs[localIndex].node.active = true;
            this._playEfxs[localIndex].play("play_hardbom");
            this._playEfxs[localIndex].node.active = true;
        }else if(pokerType == cc.vv.poker.BB_BOMB){
            this.playSound(pokerType,soundVlue);
            this._playEfxs[localIndex].node.active = true;
            this._playEfxs[localIndex].play("play_bbzha");
        }else if(pokerType == cc.vv.poker.ROCKET){
            this.playSound(pokerType,soundVlue);
            this._playEfxs[localIndex].node.active = true;
            this._playEfxs[localIndex].play("play_rocket");
        }
        cc.vv.audioMgr.playSFX("common/sound_card_out.mp3");
        if(pokerType > 4 ){
            cc.vv.audioMgr.playSFX("common/boom_effect.mp3");
        }

        var sideChild = this._gameChild.getChildByName(this._sides[localIndex]);
        var pokerHold = sideChild.getChildByName("pokerholds");
        var pokerCount = sideChild.getChildByName("pokercount").getComponent(cc.Label);
        pokerCount.string = num;
        for(var i = 0 ; i < ids.length ; ++ i ){
            var node = cc.instantiate(this.pokerItem);
            node.x = pokerHold.childrenCount*50;
            var sprite = node.getComponent(cc.Sprite);
            sprite.spriteFrame = this.getSpriteFrameByMJID(ids[i]);
            pokerHold.addChild(node);
        }
        if(localIndex == 1 || localIndex == 2 ){
            pokerHold.x = pokerHold.x - pokerHold.childrenCount *30;
        }

        var indx  = cc.vv.dataMgr.getSeatIndexByID(cc.vv.userMgr.userId);
        var seatdata = cc.vv.dataMgr.getSeatDataByIndex(indx);

        var hold = cc.vv.poker.obj2Nums(seatdata.holds);
        var res =cc.vv.poker.getHints(hold,ids,cc.vv.dataMgr.getLzNum(),cc.vv.dataMgr.getKingVsTwo());

        if(res.results.length > 0 ){
            this.hideOrShowAction(this.TISHI);
        }else{
            this.hideOrShowAction(this.BUCHU)
        }

        if(uid == cc.vv.userMgr.userId){
            seatdata.holds = cc.vv.dataMgr.selfCard;
            this.showPoker(seatdata);
        }
    },



    playSound:function (type,value) {
        console.log("fuck to .... ",type,value)
        var soundName = "";
        if(type == 1){
            soundName = "male/"+value+".mp3";
        }else if(type ==2 ){
            soundName = "male/dui"+value+".mp3";
        }else if(type ==3 ){
            soundName = "male/shunzi.mp3";
        }else if(type ==4 ){
            soundName = "male/liandui.mp3";
        }else if(type ==5 ){
            soundName = "male/zhadan.mp3";
        }else if(type ==6 ){
            soundName = "male/zhadan.mp3";
        }else if(type ==7 ){
            soundName = "male/wangzha.mp3";
        }else if(type ==9 ){
            var ran = parseInt((Math.random()*100)%3)+1;
            soundName = "male/dani"+ran+".mp3";
        }else if(type ==10 ){
            var ran = parseInt((Math.random()*100)%3)+1;
            soundName = "male/buyao"+ran+".mp3";
        }
         cc.vv.audioMgr.playSFX(soundName);
    },

    addHoldUpdate:function (dt) {
        var holdPool = cc.vv.dataMgr.getAddHoldPool();
        if(holdPool.length > 0 && this.laiziAniFlag){
            var seats = cc.vv.dataMgr.seats;
            var userdat = cc.vv.dataMgr.getAddHoldPool().pop();
            var index = cc.vv.dataMgr.getSeatIndexByID(userdat.id);
            this.faPai(seats[index],userdat.data,userdat.gong);
        }
    },

    oneSecUpdate:function (dt) {
        if (this.barCopy){
            this.barCopy.totalLength-=0.001;
            if(this.barCopy.totalLength <=0 ){
                this.barCopy.totalLength= 1;
            }
        }
    },


    syncInitMahjongs:function(){

        var syncData = cc.vv.dataMgr.getGameSyncData();
        this.firstTrun = false;
        this.laiziAniFlag = true;

        if(cc.vv.dataMgr.getLzNum() > 0 ){
            this.lzBg.active = true;
            console.log("syncinit -- > ",this.laizi ,cc.vv.dataMgr.getLzNum() );
            if(this.laizi){

                var lz = cc.vv.dataMgr.getLzNum();
                var value = 1000+lz*10 + 7 ;
                this.laizi.spriteFrame = this.getSpriteFrameByMJID(value);
                cc.find("Canvas/game/laizibg/laizi").active = true;
            }

        }else{
            this.lzBg.active = false;
        }


        if(syncData.lastUid != 0 ){
            var chupaiData = {};
            chupaiData.ids = syncData.ids;
            this.chupaiIds = syncData.ids;
            chupaiData.uid = syncData.lastUid;
            chupaiData.type = syncData.type;
            this.chuPai(chupaiData);
        }else{
            this.hideOrShowAction(this.CHUPAI);
        }
        console.log("syncData==== >",syncData )

        var seats = syncData.seats;
        console.log("syncInitma= ==== > " ,seats );

        for(var k in seats){
            var seatData = seats[k];
            if(seatData.holds.length == 0 ){
                return;
            }
            var idx = cc.vv.dataMgr.getSeatIndexByID(k);
            seatData.seatindex = idx;
           this.showPoker(seatData);
        }
    },

    HoldAdd:function (data) {
        for(var i = 0 ; i < data.others.length ; ++ i ){
            var index = cc.vv.dataMgr.getSeatIndexByID(data.others[i].uid);
            var localindex = cc.vv.dataMgr.getLocalIndex(index);
            var sideChild = this._gameChild.getChildByName(this._sides[localindex]);
            var pokerCount = sideChild.getChildByName("pokercount").getComponent(cc.Label);
            pokerCount.string =data.others[i].len;
        }
    },

    
    showPoker:function (seatdata) {
        var index = cc.vv.dataMgr.getLocalIndex(seatdata.seatindex);
        var sideChild = this._gameChild.getChildByName(this._sides[index]);
        var pokerCount = sideChild.getChildByName("pokercount").getComponent(cc.Label);
        sideChild.active = true
        var myholds = sideChild.getChildByName("holds");
        seatdata.holds = cc.vv.poker.num2Objs(seatdata.holds,cc.vv.dataMgr.getLzNum());
        var holds = this.sortHolds(seatdata);
        pokerCount.string = holds.length;

        if(index == 0 ){
            myholds.x = 540+(6-holds.length)*35;
        }
        for (var j = 0; j < myholds.childrenCount; ++j) {
            var nc = myholds.children[j];
            if(holds[j]!=null){
                nc.active = true;
                var sprite = nc.getComponent(cc.Sprite);
                sprite.spriteFrame = this.getSpriteFrameByMJID(holds[j].sortValue);
                sprite.value = holds[j].sortValue;
            }else{
                nc.active = false;
            }
        }
    },
    

    getSpriteFrameByMJID:function(mjid){
        var spriteFrameName = "MiddlePoker_"+mjid;
        spriteFrameName = spriteFrameName;
        return this.bottomAtlas.getSpriteFrame(spriteFrameName);
    },


    sortMJ:function(holds){
        holds.sort(function(a,b){
            return a.sortValue < b.sortValue;
        });
    },



    initMahjongs:function(){
        var seats = cc.vv.dataMgr.seats;
        if(cc.vv.dataMgr.DEBUG) console.log("initMaCjongs === > ＞＞ >> ＞＞ ",seats);
        //初始化手牌各个玩家的
        if(cc.vv.dataMgr.getLzNum() > 0 ){
            var lzname = "laizi_"+cc.vv.dataMgr.getLzNum()+"";
            if(cc.vv.dataMgr.DEBUG) console.log("lzname  initMaCjongs === > ＞＞ >> ＞＞ ",lzname);
            this.lzAnimation.getChildByName(lzname).active = true;
            this.lzAnimation.getChildByName(lzname).getComponent(cc.Animation).play(lzname);
            this.lzBg.active = true;
            var self = this;
            var fn = function () {
                cc.vv.audioMgr.playSFX("common/laizi_effect.mp3");
            }
            setTimeout(fn , 100);
            var fn1 = function () {
                if(cc.vv.dataMgr.getLzNum() > 0 ){
                    self.lzBg.active = true;
                    if(self.laizi){
                        var lz = cc.vv.dataMgr.getLzNum();
                        var value = 1000+lz*10 + 7 ;
                        self.laizi.spriteFrame = self.getSpriteFrameByMJID(value);
                        cc.find("Canvas/game/laizibg/laizi").active = true;
                    }
                }else{
                    this.lzBg.active = false;
                }
                self.laiziAniFlag = true;
            }
            setTimeout(fn1 , 1800);

        }else{
            this.laiziAniFlag = true;
            this.lzBg.active = false;
        }




        for(var k= 0 ; k < seats.length ; k ++){
            var seatData = seats[k];
            if (seatData.holds == null){
                continue ;
            }
            if( seatData.holds.length == 0 ){
                continue;
            }
            var index = cc.vv.dataMgr.getLocalIndex(seats[k].seatindex);
            var sideChild = this._gameChild.getChildByName(this._sides[index]);
            sideChild.active = true
            var myholds = sideChild.getChildByName("holds");
            var holds = this.sortHolds(seats[k]) ;
            for (var j = 0; j < myholds.childrenCount; ++j) {
                var nc = myholds.children[j];
                if(holds[j]!=null){

                }else{
                    nc.active = false;
                }
            }
        }

    },

    showResult:function (data) {
        this.hideOptions();
        cc.find("Canvas/game/laizibg/laizi").active = false;
        this.laiziAniFlag = false;
        this.lzBg.active = false;
        this.tongbu = false;
        var seats = cc.vv.dataMgr.getGameSeats();
        for(var k in data.results){

            var index = cc.vv.dataMgr.getSeatIndexByID(k);
            var locl = cc.vv.dataMgr.getLocalIndex(index);
            var sideChild = this._gameChild.getChildByName(this._sides[locl]);
            if(k == cc.vv.userMgr.userId){
                if(data.results[k].spring == 1){
                    this._playEfxs[locl].node.active = true;
                    this._playEfxs[locl].play("play_spring");
                }
                if(data.results[k].win == 1){
                    cc.vv.audioMgr.playSFX("win.mp3");
                }else{
                    cc.vv.audioMgr.playSFX("lose.mp3");
                }
            }
            sideChild.getChildByName("pokercount").active = false;
            var seatData = seats[index];
            seatData.score = data.results[k].totalscore;
            if(seatData.holds.length == 0 ){
                continue;
            }
        }


    },
    UserStateChange:function(data){

        this.clearChuPai();
        var seats = cc.vv.dataMgr.seats;
        if(data.userid == cc.vv.userMgr.userId && data.ready){
            //初始化手牌各个玩家的
            this._btnReady.active = false;
            for(var k= 0 ; k < seats.length ; k ++){
                seats[k].holds=[];
                var sideChild = this._gameChild.getChildByName(this._sides[k]);
                sideChild.getChildByName("seat").getChildByName("robot").active = false;
                var myholds = sideChild.getChildByName("holds");
                for (var j = 0; j < myholds.childrenCount; ++j) {
                    var nc = myholds.children[j];
                    nc.active = false;
                }
            }
        }
        if (cc.vv.dataMgr.gamestate != "playing" && cc.vv.dataMgr.gamestate != "begin" && data.ready){
            var index = cc.vv.dataMgr.getSeatIndexByID(data.userid);
            var inx = cc.vv.dataMgr.getLocalIndex(index)
            var seatData = cc.vv.dataMgr.getSeatDataByIndex(index);
            seatData.holds = [];
            var sideChild = this._gameChild.getChildByName(this._sides[inx]);
            sideChild.getChildByName("seat").getChildByName("ready").active = true;
        }
    },


    showTrun:function(turnId) {

        if(this.barCopy){
            this.barCopy.totalLength = 0 ;
            this.barCopy = null;
        }
        var localIndex = cc.vv.dataMgr.getLocalIndex(turnId);
        var sideChild = this._gameChild.getChildByName(this._sides[localIndex]);
        var bar = sideChild.getChildByName("seat").getChildByName("timecountdown").getComponent(cc.ProgressBar);

        var self = this ;

        var fn = function () {
            self.barCopy = bar;
            self.barCopy.totalLength = 1;
        }

        if(this.firstTrun){
            this.firstTrun = false;
            setTimeout(fn,2500);

        }else{
            this.barCopy = bar;
            this.barCopy.totalLength = 1;
        }
    },

    hideOptions:function(){
        var self = this ;
        for(var i = 0; i < self._options.childrenCount; ++i){
            self._options.getChildByName("buchu").active = false;
            self._options.getChildByName("tishi").active = false;
            self._options.getChildByName("chupai").active = false;
        }

    },

    addOption:function(btnName){
        for(var i = 0; i < this._options.childrenCount; ++i){
            var btn = this._options.getChildByName(btnName);
            if(btn.active == false){
                btn.active = true;
                return;
            }
        }
    },

    hideOrShowAction:function (flag) {
        if(flag == this.CHUPAI){
            this._options.getChildByName("buchu").getChildByName("yes").active = false;
            this._options.getChildByName("buchu").getChildByName("no").active = true;
            this._options.getChildByName("tishi").getChildByName("yes").active = false;
            this._options.getChildByName("tishi").getChildByName("no").active = true;
            this._options.getChildByName("chupai").getChildByName("yes").active = true;
            this._options.getChildByName("chupai").getChildByName("no").active = false;
        }else if(flag == this.TISHI){
            this._options.getChildByName("buchu").getChildByName("yes").active = true;
            this._options.getChildByName("buchu").getChildByName("no").active = false;
            this._options.getChildByName("tishi").getChildByName("yes").active = true;
            this._options.getChildByName("tishi").getChildByName("no").active = false;
            this._options.getChildByName("chupai").getChildByName("yes").active = true;
            this._options.getChildByName("chupai").getChildByName("no").active = false;
        }else if(flag == this.BUCHU){
            this._options.getChildByName("buchu").getChildByName("yes").active = true;
            this._options.getChildByName("buchu").getChildByName("no").active = false;
            this._options.getChildByName("tishi").getChildByName("yes").active = false;
            this._options.getChildByName("tishi").getChildByName("no").active = true;
            this._options.getChildByName("chupai").getChildByName("yes").active = false;
            this._options.getChildByName("chupai").getChildByName("no").active = true;
        }

    },

    showAction:function(data){
        if((data.ops && data.ops.length != 0) || data == 1  ){
           this.hideOrShowAction(this.CHUPAI);
        }
        this.addOption("buchu");
        this.addOption("tishi");
        this.addOption("chupai");
    },



    onOptionClicked:function(event){

        if(event.target.name == "buchu"){

            if(this._options.getChildByName("buchu").getChildByName("no").active ){
                return ;
            }
            console.log("buchupai ============ > ");
            this.tishiIndex = 0 ;
            cc.vv.net.send("pass");
            this.clearChoosePoker();
            this.hideOptions();
        }
        else if(event.target.name == "tishi"){
            console.log("tishi ============ > ");
            if(this._options.getChildByName("tishi").getChildByName("no").active ){
                return ;
            }
            var hold  = cc.vv.dataMgr.getSelfData().holds;
            this.sortMJ(hold);
            var holdss = cc.vv.poker.obj2Nums(hold);
            var res = cc.vv.poker.getHints(holdss,this.chupaiIds,cc.vv.dataMgr.getLzNum(),cc.vv.dataMgr.getKingVsTwo());
            console.log("tishi ======= > " ,res ,hold);


            if(res.results.length > 0 ){
                if(this.tishiIndex < res.results.length){
                    this.clearChoosePoker();
                    for(var i = 0 ; i < res.results[this.tishiIndex].length ; ++i ){

                        for(var j = 0 ; j < hold.length ; ++j){
                            if(cc.vv.poker.num2Obj(res.results[this.tishiIndex][i],cc.vv.dataMgr.getLzNum()).sortValue == hold[j].sortValue){
                                var name = "Canvas/game/myself/holds/poker"+(j+1)+"";
                                this.chupaiArr.push(res.results[this.tishiIndex][i]);
                                cc.find(name).y = 15;
                            }
                        }
                    }
                }
            }
            this.tishiIndex =   this.tishiIndex + 1 ;
            if(this.tishiIndex == res.results.length){
                this.tishiIndex = 0 ;
            }
        }
        else if(event.target.name == "chupai"){
            var chupai = [];
            for(var i = 0 ; i < this.chupaiArr.length ; ++i ){
                if(this.chupaiArr[i]){
                    chupai.push(cc.vv.poker.obj2Num( this.chupaiArr[i]));
                }
            }
            console.log("chupai ============ >" , chupai);
            if(chupai.length == 0 ){
                return ;
            }
            cc.vv.net.send("chupai",chupai);
            this.tishiIndex = 0 ;
            this.clearChoosePoker();

        }
        else if(event.target.name == "ready"){
            this._btnReady.active = false;
            cc.vv.net.send("ready");
        }
    },

    clearChoosePoker:function () {
        this.chupaiArr=[];
        for(var i = 1 ; i < 17 ; ++ i ){
            var spriteName = "Canvas/game/myself/holds/poker"+i+"";
            var sprite =  cc.find(spriteName);
            sprite.y = 0 ;
        }
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

    sortHolds:function(seatData){
        var holds = seatData.holds;
        if(holds == null){
            return null;
        }
        //如果手上的牌的数目是2,5,8,11,14，表示最后一张牌是刚摸到的牌
        this.sortMJ(holds);
        return holds;
    },



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

    },


    onDestroy:function(){
        if(cc.vv.dataMgr.DEBUG) console.log("onDestroy");
        if(cc.vv){
            // cc.vv.gameNetMgr.clear();
            if (this._resoultTimeOut){
                clearTimeout(this._resoultTimeOut);
              }
            if (this._updateTimeOut){
                clearTimeout(this._updateTimeOut);
            }

            cc.vv.dataMgr.clear()
        }
    }
});
