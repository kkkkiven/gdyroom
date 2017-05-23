cc.Class({
    extends: cc.Component,

    properties: {
        _sprIcon:null,
        _zhuang:null,
        _ready:null,
        _offline:null,
        _lblName:null,
        _Creator:null,
        _lblScore:null,
        _scoreBg:null,
        _dayingjia:null,
        _voicemsg:null,
        
        _chatBubble:null,
        _emoji:null,
        _lastChatTime:-1,
        
        _userName:"",
        _score:0,
        _btnKick:null,
        _iscreator:false,
        _isOffline:false,
        _isReady:false,
        _btnBegin:null,
        _isZhuang:false,
        _isCreator:false,
        _userId:null,
        _robot:null,
        _holds:null,
        _fan:null,
        _win:null,


    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        this._sprIcon = this.node.getChildByName("icon").getComponent("ImageLoader");
        this._lblName = this.node.getChildByName("name").getComponent(cc.Label);
        this._lblScore = this.node.getChildByName("score").getComponent(cc.Label);
        this._Creator = this.node.getChildByName("fangzhu");
        this._btnKick = this.node.getChildByName("btnKick");
        this._voicemsg = this.node.getChildByName("voicemsg");
        this._holds = this.node.getChildByName("holds");
        this._win = this.node.getChildByName("win");
        var fa_fan = this.node.getChildByName("beishu");
        if(fa_fan){
            this._fan = fa_fan.getComponent(cc.Label);
        }


        this.refreshXuanPaiState();
        
        if(this._voicemsg){
            this._voicemsg.active = false;
        }
        
        if(this._sprIcon && this._sprIcon.getComponent(cc.Button)){
            cc.vv.utils.addClickEvent(this._sprIcon,this.node,"Seat","onIconClicked");    
        }
        if(this._btnKick){
            cc.vv.utils.addClickEvent(this._btnKick,this.node,"Seat","onKickClick");
        }
        this._offline = this.node.getChildByName("offline");
        
        this._ready = this.node.getChildByName("ready");
        
        this._zhuang = this.node.getChildByName("zhuang");
        this._robot = this.node.getChildByName("robot");

        this._scoreBg = this.node.getChildByName("Z_money_frame");
        this._nddayingjia = this.node.getChildByName("dayingjia");
        
        this._chatBubble = this.node.getChildByName("ChatBubble");
        if(this._chatBubble != null){
            this._chatBubble.active = false;
        }
        
        this._emoji = this.node.getChildByName("emoji");
        if(this._emoji != null){
            this._emoji.active = false;
        }
        this.refresh();
        
        if(this._sprIcon && this._userId){
            this._sprIcon.setUserID(this._userId);
        }
    },

    onKickClick:function(){
        if(this._userId != null && this._userId > 0) {
            var seat = cc.vv.dataMgr.getSeatByID(this._userId);
            cc.vv.net.send("kick",seat.seatindex);

        }
    },


    setKick:function (isCreator) {
        if(this._btnKick ){
            if(isCreator){
                this._btnKick.active = true;
            }else{
                this._btnKick.active = false;
            }
        }
    },

    sortPoker:function(holds){
        holds.sort(function(a,b){
            return a < b;
        });
    },

    setHolds:function (holddata) {
        this.sortPoker(holddata);
        if(this._holds){
            var myholds = this._holds;
            for (var j = 0; j < myholds.childrenCount; ++j) {
                console.log("fuck to holdda -- > ",holddata[j]);
                var nc = myholds.children[j];
                if(holddata[j]!=null){
                    nc.active = true;
                    var sprite = nc.getComponent(cc.Sprite);
                    sprite.spriteFrame =  cc.vv.pokerImg.getSpriteFrameByMJID(holddata[j]);
                }else{
                    nc.active = false;
                }
            }
        }

    },
    onIconClicked:function(){
        var iconSprite = this._sprIcon.node.getComponent(cc.Sprite);
        if(this._userId != null && this._userId > 0){
           var seat = cc.vv.dataMgr.getSeatByID(this._userId);
            var sex = 0;
            if(cc.vv.baseInfoMap){
                var info = cc.vv.baseInfoMap[this._userId];
                if(info){
                    sex = info.sex;
                }                
            }
            cc.vv.userinfoShow.show(seat.name,seat.userid,iconSprite,sex,seat.ip);         
        }
    },
    
    refresh:function(){
        if(this._lblName != null){
            this._lblName.string = this._userName;
        }

        if(this._lblScore != null){
            this._lblScore.string = this._score;
        }        
        
        if(this._nddayingjia != null){
            this._nddayingjia.active = this._dayingjia == true;
        }
        
        if(this._offline){
            this._offline.active = this._isOffline && this._userName != "";
        }
        if(this._robot){
            this._robot.active = this._isOffline && this._userName != "";
        }

        if(this._btnKick ){
            if(cc.vv.dataMgr.getIsCreatorById(cc.vv.userMgr.userId )){

                this._btnKick.active = true;
            }else{
                this._btnKick.active = false;
            }
        }

        if(this._Creator){
            this._Creator.active = this._iscreator == true;
        }

        if(this._ready){
            this._ready.active = this._isReady && (cc.vv.dataMgr.numOfGames > 0);
        }
        
        if(this._zhuang){
            this._zhuang.active = this._isZhuang;
        }
        
        this.node.active = this._userName != null && this._userName != ""; 
    },



    setResInfo:function(name,score,isbigwin,iscreator){
        this._userName = name;
        this._score = score;
        if(this._score > 0 ){
            this._score = "+"+this._score;
        }
        if(this._score == null){
            this._score = 0;
        }
        this._iscreator = iscreator;
        this._dayingjia == isbigwin;

        if(this._nddayingjia != null){
            this._nddayingjia.active = this._dayingjia == true;
        }
        if(this._Creator != null){
            this._Creator.active = this._iscreator == true;
        }

        if(this._scoreBg != null){
            this._scoreBg.active = this._score != null;
        }

        if(this._lblScore != null){
            this._lblScore.node.active = this._score != null;
        }

        this.refresh();
    },




    setInfo:function(name,score,iscreator){
        this._userName = name;
        this._score = score;
        if(this._score == null){
            this._score = 0;
        }
        this._iscreator = iscreator;

        if(this._scoreBg != null){
            this._scoreBg.active = this._score != null;
        }

        if(this._lblScore != null){
            this._lblScore.node.active = this._score != null;
        }

        this.refresh();
    },
    
    setZhuang:function(value){
        if(this._zhuang){
            this._isZhuang = value
            this._zhuang.active = value;
        }
    },
    setCreator:function(value){
            this._isCreator = value
    },

    setReady:function(isReady){

        this._isReady = isReady;
        if(this._ready){
            this._ready.active = this._isReady;
        }
    },
    
    setID:function(id){
        var idNode = this.node.getChildByName("id");
        if(idNode){
            var lbl = idNode.getComponent(cc.Label);
            lbl.string = "ID:" + id;            
        }
        
        this._userId = id;
        if(this._sprIcon){
            this._sprIcon.setUserID(id); 
        }
    },


    setFan:function (fan) {
      if(this._fan){
          this._fan.string = fan + "倍";
      }
    },


    setWin:function (win) {

        if(this._win){
            if(win){
                this._win.active = true;
            }else{
                this._win.active = false;
            }

        }
    },


    setOffline:function(isOffline){
        this._isOffline = isOffline;
        if(this._offline){
            this._offline.active = this._isOffline && this._userName != "";
            this._robot.active = this._isOffline && this._userName != "";
        }
    },
    
    chat:function(content){
        if(this._chatBubble == null || this._emoji == null){
            return;
        }
        this._emoji.active = false;
        this._chatBubble.active = true;
        this._chatBubble.getComponent(cc.Label).string = content;
        this._chatBubble.getChildByName("New Label").getComponent(cc.Label).string = content;
        this._lastChatTime = 3;
    },
    
    emoji:function(emoji){
        //emoji = JSON.parse(emoji);
        if(this._emoji == null || this._emoji == null){
            return;
        }
        if(cc.vv.dataMgr.DEBUG) console.log(emoji);
        this._chatBubble.active = false;
        this._emoji.active = true;
        this._emoji.getComponent(cc.Animation).play(emoji);
        this._lastChatTime = 3;
    },
    
    voiceMsg:function(show){
        if(this._voicemsg){
            this._voicemsg.active = show;
        }
    },
    
    refreshXuanPaiState:function(){


        var seat = cc.vv.dataMgr.getSeatByID(this._userId);
        if(seat){
        }
    },
   
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._lastChatTime > 0){
            this._lastChatTime -= dt;
            if(this._lastChatTime < 0){
                this._chatBubble.active = false;
                this._emoji.active = false;
                this._emoji.getComponent(cc.Animation).stop();
            }
        }
    },
});
