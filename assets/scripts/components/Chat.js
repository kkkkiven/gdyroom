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
        _chatRoot:null,
        _tabQuick:null,
        _tabEmoji:null,
        _iptChat:null,
        
        _quickChatInfo:null,
        _btnChat:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        cc.vv.chat = this;

        this._btnChat = this.node.getChildByName("btn_chat");
        this._btnChat.active = cc.vv.replayMgr.isReplay() == false;

        this._chatRoot = this.node.getChildByName("chat");
        this._chatRoot.active = false;

        this._tabQuick = this._chatRoot.getChildByName("quickchatlist");
        this._tabEmoji = this._chatRoot.getChildByName("emojis");

        this._iptChat = this._chatRoot.getChildByName("iptChat").getComponent(cc.EditBox);

        this._quickChatInfo = {};
        this._quickChatInfo["item0"] = {index:0,content:"快点啦，人家还要去做面膜呐",sound:"game_girl_chat_6.mp3"};
        this._quickChatInfo["item1"] = {index:1,content:"朋友，你牌品不好，容易断线",sound:"game_boy_chat_5.mp3"};
        this._quickChatInfo["item2"] = {index:2,content:"不要走，决战到天亮！",sound:"fix_msg_3.mp3"};
        this._quickChatInfo["item3"] = {index:3,content:"胜负已分，快投降吧",sound:"game_boy_chat_6.mp3"};
        this._quickChatInfo["item4"] = {index:4,content:"这么慢，我到要看看你搬什么救兵",sound:"game_boy_chat_4.mp3"};
        this._quickChatInfo["item5"] = {index:5,content:"看你骨骼惊奇，绝对是打牌的好手，再来一局",sound:"game_boy_chat_9.mp3"};
        this._quickChatInfo["item6"] = {index:6,content:"无尽的等待，无尽的寂寞啊",sound:"game_girl_chat_4.mp3"};
        this._quickChatInfo["item7"] = {index:7,content:"快点啊，都等到我花儿都谢谢了！",sound:"fix_msg_1.mp3"};
        this._quickChatInfo["item8"] = {index:8,content:"快快快，甭考验本大王耐心！",sound:"game_boy_chat_3.mp3"};
        this._quickChatInfo["item9"] = {index:9,content:"你的牌打得也太好了！",sound:"fix_msg_4.mp3"};
        this._quickChatInfo["item10"] = {index:10,content:"怎么又断线了，网络怎么这么差啊！",sound:"fix_msg_2.mp3"};
        this._quickChatInfo["item11"] = {index:11,content:"不要吵了，专心玩游戏吧！",sound:"fix_msg_9.mp3"};
        this._quickChatInfo["item12"] = {index:12,content:"你是妹妹还是哥哥啊？",sound:"fix_msg_5.mp3"};
        this._quickChatInfo["item13"] = {index:13,content:"和你合作真是太愉快了！",sound:"fix_msg_6.mp3"};
        this._quickChatInfo["item14"] = {index:14,content:"大家好，很高兴见到各位！",sound:"fix_msg_7.mp3"};
        this._quickChatInfo["item15"] = {index:15,content:"各位，真是不好意思，我得离开一会儿。",sound:"fix_msg_8.mp3"};
        this._quickChatInfo["item16"] = {index:16,content:"长夜无心睡眠，小女子这厢有理",sound:"game_girl_chat_2.mp3"};
        this._quickChatInfo["item17"] = {index:17,content:"现不出牌姐姐我回月亮宫喽",sound:"game_girl_chat_3.mp3"};
        this._quickChatInfo["item18"] = {index:18,content:"财运来的时候，真是挡也挡不住啊",sound:"game_boy_chat_8.mp3"};
        this._quickChatInfo["item19"] = {index:19,content:"我去洗白白哦，明天再约哦",sound:"game_girl_chat_9.mp3"};
        this._quickChatInfo["item20"] = {index:20,content:"妹子！能告诉我你的联系方式嘛",sound:"game_boy_chat_1.mp3"};
        this._quickChatInfo["item21"] = {index:21,content:"长夜漫漫，没想到姑娘也没睡",sound:"game_boy_chat_2.mp3"};
        this._quickChatInfo["item22"] = {index:22,content:"这么慢，奴家都急死啦",sound:"game_girl_chat_5.mp3"};

    },
    
    getQuickChatInfo:function(index){
        var key = "item" + index;
        return this._quickChatInfo[key];   
    },
    
    onBtnChatClicked:function(){
        this._chatRoot.active = true;
    },
    
    onBgClicked:function(){
        this._chatRoot.active = false;
    },
    
    onTabClicked:function(event){
        if(event.target.name == "tabQuick"){
            this._tabQuick.active = true;
            this._tabEmoji.active = false;
        }
        else if(event.target.name == "tabEmoji"){
            this._tabQuick.active = false;
            this._tabEmoji.active = true;
        }
    },
    
    onQuickChatItemClicked:function(event){
        this._chatRoot.active = false;
        var info = this._quickChatInfo[event.target.name];
        cc.vv.net.send("quick_chat",info.index); 
    },
    
    onEmojiItemClicked:function(event){
        if(cc.vv.dataMgr.DEBUG) console.log(event.target.name);
        this._chatRoot.active = false;
        cc.vv.net.send("emoji",event.target.name);
    },
    
    onBtnSendChatClicked:function(){
        if(cc.vv.dataMgr.DEBUG) console.log("fuck to chat ==222= > " , this._iptChat.string);
        this._chatRoot.active = false;
        if(this._iptChat.string == ""){
            if(cc.vv.dataMgr.DEBUG) console.log("fuck to chat =111== > " , this._iptChat.string);
            return;
        }
        if(cc.vv.dataMgr.DEBUG) console.log("fuck to chat =333== > " , this._iptChat.string);
        cc.vv.net.send("chat",this._iptChat.string);
        this._iptChat.string = "";
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
