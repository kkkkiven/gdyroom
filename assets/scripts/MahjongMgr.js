var mahjongSprites = [];

cc.Class({
    extends: cc.Component,

    properties: {

        bottomAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
    },
    onLoad:function(){
        if(cc.vv == null){
            return;
        }
        cc.vv.pokerImg = this;
    },

    getSpriteFrameByMJID:function(mjid){
        var spriteFrameName = "MiddlePoker_"+mjid;
        spriteFrameName = spriteFrameName;
        return this.bottomAtlas.getSpriteFrame(spriteFrameName);
    },
    

});
