cc.Class({
    extends: cc.Component,

    properties: {

        _gameOver:null,
        _seats:[],
        _isGameEnd:false,
        _iszhuang:null,
        win:null,
        lose:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        if(cc.vv.dataMgr.conf == null){
            return;
        }
        this._gameOver = this.node.getChildByName("game_over");
        var seats = this._gameOver.getChildByName("seats");
        for(var i = 0; i < seats.children.length; ++i){
            this._seats.push(seats.children[i].getComponent("Seat"));
        }

        this.win = cc.find("Canvas/game_over/youwin");
        this.lose = cc.find("Canvas/game_over/youlose");
        var btnBegin = cc.find("Canvas/game_over/btnShare");
        if(btnBegin){
            cc.vv.utils.addClickEvent(btnBegin,this.node,"GameOver","onBtnReadyClicked");
        }
        var btnClose = cc.find("Canvas/game_over/btnClose");
        if(btnClose){
            cc.vv.utils.addClickEvent(btnClose,this.node,"GameOver","onBtnCloseClicked");
        }


        //初始化网络事件监听器
        var self = this;
         // this.node.on('game_over',function(data){self.onGameOver(data.detail);});
        this.node.on('game_over',function(data){
            self._gameOver.active = true;
            self.onGameOver(data.detail);
        });
        this.node.on('game_end',function(data){
            self._gameOver.active = false;
        });

    },


    onGameOver:function(data){
        console.log("----------onGmeOver",data);
        var i = 0 ;
        var seats = cc.vv.dataMgr.seats;
        if(data && data.results ){
            for(var k in data.results){
                var name = cc.vv.dataMgr.getNameById(k);
                console.log("game ove name -- > " , name);
                var seat = data.results[k];
                if(k == cc.vv.userMgr.userId){
                    if(seat.win == 1){
                        this.win.active = true;
                        this.lose.active = false;
                    }else{
                        this.win.active = false;
                        this.lose.active = true;
                    }
                }
                var createor = cc.vv.dataMgr.getIsCreatorById(seat.userId);
                this._seats[i].setResInfo(name,seat.score,false, false);
                this._seats[i].setID(seat.userId);
                this._seats[i].setHolds(seat.holds);
                this._seats[i].setFan(seat.fan);
                this._seats[i].setWin(seat.win == 1);
                console.log("fuck to on game " , seat.holds);
                i = i +1;
            }

        }
    },

    onBtnReadyClicked:function(){
        cc.vv.net.send('ready');
        this._gameOver.active = false;
    },
    
    onBtnShareClicked:function(){
        if(cc.vv.dataMgr.DEBUG) console.log("onBtnShareClicked");
    },

    onBtnCloseClicked:function(){
        cc.vv.net.send('ready');
        this._gameOver.active = false;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
