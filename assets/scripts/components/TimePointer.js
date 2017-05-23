cc.Class({
    extends: cc.Component,

    properties: {
        _arrow:null,
        _pointer:null,
        _fengquan:null,
        _timeLabel:null,
        _time:-1,
        _alertTime:-1,
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        var gameChild = this.node.getChildByName("game");
        this._arrow = gameChild.getChildByName("arrow");
        this._fengquan = this._arrow.getChildByName("fengpointer");
          this._fengquand = this._arrow.getChildByName("fengpointerd");
            this._fengquann = this._arrow.getChildByName("fengpointern");
              this._fengquanx = this._arrow.getChildByName("fengpointerx");
                this._fengquanb = this._arrow.getChildByName("fengpointerb");

         this._pointer = this._arrow.getChildByName("pointer");
        this.initPointer();

        this._timeLabel = this._arrow.getChildByName("lblTime").getComponent(cc.Label);
        this._timeLabel.string = "00";
        // this._timeLabel.setLocalZOrder(100);
        var self = this;
        
        this.node.on('game_begin',function(data){
            self.initPointer();
        });

        this.node.on('game_chupai',function(data){
            self.initPointer();
            self._time = 10;
            self._alertTime = 3;
        });
    },
    
    initPointer:function(){
        if(cc.vv == null){
            return;
        }
        this._arrow.active = cc.vv.gameNetMgr.gamestate == "playing";
        if(!this._arrow.active){
            return;
        }
        var turn = cc.vv.gameNetMgr.turn;
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(turn);
        for(var i = 0; i < this._pointer.children.length; ++i){
            this._pointer.children[i].active = i == localIndex;
        }
        var fengquan = cc.vv.gameNetMgr.fengquan;

        for(var i = 0; i < this._fengquan.children.length; ++i){
            this._fengquan.children[i].active = i == fengquan;
        }

        for(var i = 0; i < this._fengquand.children.length; ++i){
            this._fengquand.children[i].active = i == (cc.vv.gameNetMgr.seatIndex+0)%4;
        }
         for(var i = 0; i < this._fengquann.children.length; ++i){
            this._fengquann.children[i].active = i == (cc.vv.gameNetMgr.seatIndex+1)%4;
        }
         for(var i = 0; i < this._fengquanx.children.length; ++i){
            this._fengquanx.children[i].active = i == (cc.vv.gameNetMgr.seatIndex+2)%4;
        }
         for(var i = 0; i < this._fengquanb.children.length; ++i){
            this._fengquanb.children[i].active = i == (cc.vv.gameNetMgr.seatIndex+3)%4;
        }





    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._time > 0){
            this._time -= dt;
            if(this._alertTime > 0 && this._time < this._alertTime){
                cc.vv.audioMgr.playSFX("timeup_alarm.mp3");
                this._alertTime = -1;
            }
            var pre = "";
            if(this._time < 0){
                this._time = 0;
            }
            
            var t = Math.ceil(this._time);
            if(t < 10){
                pre = "0";
            }
            this._timeLabel.string = pre + t; 
        }
    },
});
