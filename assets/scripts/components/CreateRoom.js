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
        _difenxuanze:null,
        _zimo:null,
        _wanfaxuanze:null,
        _zuidafanshu:null,
        _jushuxuanze:null,
        _dianganghua:null,
        _leixingxuanze:null,
        _shuangui:null,
        _tifa:null,

        _laizi:null,
        _leftone:null,
        _leftking:null,
        _roundfan:null,
        _kingvstwo:null,
        _leftfan:null,


    },

    // use this for initialization
    onLoad: function () {
        var isReview =  cc.vv.dataMgr.getGameReview();
        var isTest =  cc.vv.dataMgr.getGameTest();
        this._leixingxuanze = [];
        var t = this.node.getChildByName("scroll").getChildByName("view").getChildByName("content").getChildByName("leixingxuanze");
        var tip = this.node.getChildByName("bg").getChildByName("koukatishi");
        if(isReview){
            t.active = false;
            tip.active = false;
        }
        if(cc.vv.dataMgr.DEBUG) console.log("istest ==== > " ,i,isTest,isTest==false);
        if(isTest == false && t.children[1]){
            t.children[1].active = false;
        }
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._leixingxuanze.push(n);
            }
        }
        this._difenxuanze = [];
        var t = this.node.getChildByName("scroll").getChildByName("view").getChildByName("content").getChildByName("difenxuanze");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._difenxuanze.push(n);
            }
        }
        this._bupaixuanze = [];
        var t =this.node.getChildByName("scroll").getChildByName("view").getChildByName("content").getChildByName("bupaixuanze");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._bupaixuanze.push(n);
            }

        }




        //console.log(this._wanfaxuanze);
        
        this._zuidafanshu = [];
        var t = this.node.getChildByName("scroll").getChildByName("view").getChildByName("content").getChildByName("zuidafanshu");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._zuidafanshu.push(n);
            }
        }
        //console.log(this._zuidafanshu);
        
        this._jushuxuanze = [];
        var t = this.node.getChildByName("scroll").getChildByName("view").getChildByName("content").getChildByName("xuanzejushu");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._jushuxuanze.push(n);
            }
        }

        this._zhuangfaxuanze = [];
        var t = this.node.getChildByName("scroll").getChildByName("view").getChildByName("content").getChildByName("zhuanfaxuanze");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._zhuangfaxuanze.push(n);
            }
        }

        var t = this.node.getChildByName("content").getChildByName("laizi");
        this._laizi = t.getComponent("CheckBox");
        var t = this.node.getChildByName("content").getChildByName("leftone");
        this._leftone = t.getComponent("CheckBox");
        var t = this.node.getChildByName("content").getChildByName("leftking");
        this._leftking = t.getComponent("CheckBox");
        var t = this.node.getChildByName("content").getChildByName("roundfan");
        this._roundfan = t.getComponent("CheckBox");
        var t = this.node.getChildByName("content").getChildByName("kingvstwo");
        this._kingvstwo = t.getComponent("CheckBox");
        var t = this.node.getChildByName("content").getChildByName("leftfan");
        this._leftfan = t.getComponent("CheckBox");



    },
    
    onBtnBack:function(){
        this.node.active = false;
    },
    
    onBtnOK:function(){
        this.node.active = false;
        this.createRoom();
    },
    
    createRoom:function(){
        var self = this;
        var onCreate = function(ret){
            if(ret.errcode !== 0){
                cc.vv.wc.hide();
                //console.log(ret.errmsg);
                if(ret.errcode == 2222){
                    cc.vv.alert.show("","房卡不足，创建房间失败!");
                }
                else{
                    cc.vv.alert.show("","创建房间失败,错误码:" + ret.errcode);
                }
            }
            else{
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };



        var type = 0;
        for(var i = 0; i < self._leixingxuanze.length; ++i){
            if(self._leixingxuanze[i].checked){
                type = i;
                break;
            }     
        }
        
        if(type == 0){
            type = "tdk";
        }
        else{
            type = "test";
        }
        var zuidafanshu = 0;
        for(var i = 0; i < self._zuidafanshu.length; ++i){
            if(self._zuidafanshu[i].checked){
                zuidafanshu = i;
                break;
            }
        }


        var bupai = 0;
        for(var i = 0; i < self._bupaixuanze.length; ++i){
            if(self._bupaixuanze[i].checked){
                bupai = i;
                break;
            }
        }

        var zhuang = 0;
        for(var i = 0; i < self._zhuangfaxuanze.length; ++i){
            if(self._zhuangfaxuanze[i].checked){
                zhuang = i;
                break;
            }
        }

        var difen = 0;
        for(var i = 0; i < self._difenxuanze.length; ++i){
            if(self._difenxuanze[i].checked){
                difen = i;
                break;
            }
        }
        var jushuxuanze = 0;
        for(var i = 0; i < self._jushuxuanze.length; ++i){
            if(self._jushuxuanze[i].checked){
                jushuxuanze = i;
                break;
            }     
        }
        var leftone =   this._leftone.checked;
        if(leftone){
            leftone = 1 ;
        }else{
            leftone = 0 ;
        }

        var laizi = this._laizi.checked;
        if(laizi){
            laizi = 1 ;
        }else{
            laizi = 0 ;
        }

        var leftking = this._leftking.checked;
        if(leftking){
            leftking = 1 ;
        }else{
            leftking = 0 ;
        }

        var leftfan = this._leftfan.checked;
        if(leftfan){
            leftfan = 1 ;
        }else{
            leftfan = 0 ;
        }

        var kingvs2 = this._kingvstwo.checked;
        if(kingvs2){
            kingvs2 = 2 ;
        }else{
            kingvs2 = 0 ;
        }

        var roundfan = this._roundfan.checked;
        if(roundfan){
            roundfan = 1 ;
        }else{
            roundfan = 0 ;
        }




        var isReview =  cc.vv.dataMgr.getGameReview();


        var conf;
        if(isReview){
            conf = {
                type:"test",
                difen:difen,
                jushu:jushuxuanze,
                maxfan:zuidafanshu,
                bupai:bupai,
                zhuang:zhuang,

                laizi:laizi,
                leftone:leftone,
                leftking:leftking,
                roundfan:roundfan,
                kingvs2:kingvs2,
                leftfan:leftfan,
            };
        }else{
            conf = {
                type:type,
                difen:difen,
                jushu:jushuxuanze,
                maxfan:zuidafanshu,
                bupai:bupai,
                zhuang:zhuang,

                laizi:laizi,
                leftone:leftone,
                leftking:leftking,
                roundfan:roundfan,
                kingvs2:kingvs2,
                leftfan:leftfan,
            };
        }
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            conf:JSON.stringify(conf)
        };
        if(cc.vv.dataMgr.DEBUG) console.log(data);
        cc.vv.wc.show("正在创建房间");
        cc.vv.http.sendRequest("/create_private_room",data,onCreate);   
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
