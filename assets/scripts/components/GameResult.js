cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _gameresult:null,
        timeNow:null,
        _seats:[],
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        this._gameresult = this.node.getChildByName("game_result");
        // this._gameresult.active = true;
        
        var seats = this._gameresult.getChildByName("seats");
        for(var i = 0; i < seats.children.length; ++i){
            this._seats.push(seats.children[i].getComponent("Seat"));   
        }
        var timeN =  this._gameresult.getChildByName("nowTime").getComponent(cc.Label);
        this.timeNow = timeN;
        var btnClose = cc.find("Canvas/game_result/btnClose");
        if(btnClose){
            cc.vv.utils.addClickEvent(btnClose,this.node,"GameResult","onBtnCloseClicked");
        }
        
        var btnShare = cc.find("Canvas/game_result/btnShare");
        var isReview =  cc.vv.dataMgr.getGameReview();
        if(isReview){
            btnShare.active = false;
        }

        if(btnShare){
            cc.vv.utils.addClickEvent(btnShare,this.node,"GameResult","onBtnShareClicked");
        }

        //初始化网络事件监听器
        var self = this;
        this.node.on('game_end',function(data){self.onGameEnd(data.detail);});
    },
    
    showResult:function(seat,info,isZuiJiaPaoShou){


    },

    onGameEnd:function(endinfo){
        this._gameresult.active = true ;
        var seats = cc.vv.dataMgr.seats;


        var time1 = new Date().Format("yyyy-MM-dd hh:mm:ss");
        this.timeNow.string = time1;

        var maxscore = -1;
        for(var i = 0; i < seats.length; ++i){
            var seat = seats[i];
            if(seat.score > maxscore){
                maxscore = seat.score;
            }
        }

        for(var i = 0; i < seats.length; ++i){
            var seat = seats[i];
            var isBigwin = false;

            if(endinfo[seat.userid]){
                var scroe = endinfo[seat.userid].totalscore - 2000;
                if(cc.vv.dataMgr.DEBUG) console.log("seat.userid == > " ,seat.userid ,scroe);
                if(scroe > 0){
                    isBigwin = scroe == maxscore;
                }
                var createor = cc.vv.dataMgr.getIsCreatorById(seat.userid);
                this._seats[i].setResInfo(seat.name,scroe,isBigwin, createor);
                this._seats[i].setID(seat.userid);
            }

        }
    },
    
    onBtnCloseClicked:function(){
        cc.director.loadScene("hall");
    },
    
    onBtnShareClicked:function(){
        cc.vv.anysdkMgr.shareResult();
    }
});
