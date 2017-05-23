function loadImage(url,code,callback){
    console.log("loadimag==== > ",url);
    cc.loader.load(url,function (err,tex) {
        var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        console.log("load=== > ",url);
        callback(code,spriteFrame);
    });
};

function getBaseInfo(userid,callback){
    if(cc.vv.baseInfoMap == null){
        cc.vv.baseInfoMap = {};
    }
    
    if(cc.vv.baseInfoMap[userid] != null){
        callback(userid,cc.vv.baseInfoMap[userid]);
    }
    else{
        cc.vv.http.sendRequest('/base_info',{userid:userid},function(ret){
            var url = null;
            if(ret.headimgurl){
               url = ret.headimgurl + ".jpg";
            }
            var info = {
                name:ret.name,
                sex:ret.sex,
                url:url,
            }
            cc.vv.baseInfoMap[userid] = info;
            callback(userid,info);
            
        },cc.vv.http.master_url);   
    }  
};

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
    },

    // use this for initialization
    onLoad: function () {
        this.setupSpriteFrame();
    },
    
    setUserID:function(userid){
        if(cc.sys.isNative == false){
            return;
        }
        if(!userid){
            return;
        }
        if(cc.vv.images == null){
            cc.vv.images = {};
        }
        
        var self = this;
        getBaseInfo(userid,function(code,info){
           if(info && info.url){
                loadImage(info.url,userid,function (err,spriteFrame) {
                    self._spriteFrame = spriteFrame;
                    self.setupSpriteFrame();
                });   
            } 
        });
    },
    setUserHeadurl:function(url){
        if(cc.sys.isNative == false){
            return;
        }
        console.log("setUserHea=== > " , url);
        if(url == ""){
            return;
        }
        if(cc.vv.images == null){
            cc.vv.images = {};
        }
        console.log("setUserHea111=== > " , url);
        var self = this;
        loadImage(url,null,function (err,spriteFrame) {
            console.log("fuck to run here")
            self._spriteFrame = spriteFrame;
            self.setupSpriteFrame();
        });
    },
    
    setupSpriteFrame:function(){
        if(this._spriteFrame){
            var spr = this.getComponent(cc.Sprite);
            if(spr){
                spr.spriteFrame = this._spriteFrame;    
            }
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
