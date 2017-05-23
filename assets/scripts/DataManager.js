/**
 * Created by Joker on 17/2/26.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        maxNumOfGames:0,
        numOfGames:0,
        numOfPlayer:0,
        seatIndex:-1,
        localIndex:-1,
        roomId:null,
        seats:[],
        localSeatData:[],
        turn:-1,
        button:-1,
        gamestate:"",
        zhuang:-1,
        creatorId:-1,
        isOver:false,
        dissoveData:null,
        syncdata:null,
        turnOpt:-1,
        minCoins:1,
        maxCoins:5,
        isGameEnd:false,
        conf:null,
        isSync:false,
        gameInitData:null,
        gameOverData:null,
        gameSyncData:null,
        isRunInBack:false,
        addHoldsPool:[],
        allAddHolds:[],
        isLanGuo:false,
        trunOps:null,
        addHoldsScore:null,
        selfCard:[],
        nowFan:0,
        numOfPai:0,
        DEBUG:true,
        isOldSound:true,
        initData:null,
        paiCount:0,
        lunCount:0,
        fanCount:0,
        lzNum:0,






        SINGLE:1,
        PAIR:2,
        SHUANG_SHUN:3,
        DAN_SHUN:4,
        SOFT_BOMB:5,
        HARD_BOMB:6,
        ROCKET:7,
        BB_BOMB:8,
        ERROR_TYPE:9,
        SH_BOMB_2LZ:12,
        SH_BOMB_5:13,
        SH_BOMB_3LZ:14,
        SH_BOMB_6:15,

        DIAMOND:1,
        CLUBS:2,
        HEARTS:3,
        SPADES:4,
        LAIZI_TYPE:7,
        SMALL_JOKER:16,
        BIG_JOKER:17,
        AD_POKER:18,

        VALUE_2:15,
        VALUE_A:14,
        kingvstwo:0,






    },

    init:function(){
        console.log("fuck to init=======================datamanager")
        this.gameInitData = {};
        this.gameOverData = {};
        this.gameSyncData = {};
        this.initData = {};

        this.zhuang = -1;
        this.schedule(this.AddHoldUpdate, 0.5);
        var isold = cc.sys.localStorage.getItem('soundold');
        if(isold == 0 ){
            this.isOldSound = false;
        }else{
            this.isOldSound = true;
        }
    },

    reset:function(){


        console.log("datamanager -----reset ");

        this.gamestate = "";
        this.trunOps = null;
        this.curaction = null;
        this.nowFan = 0 ;
        this.isRunInBack=false;
        this.initData = {};
        this.conf = null;
        this.lzNum = 0 ;
        this.turnOpt = -1;
        this.addHoldsScore = null;
        // this.isGameEnd = false;
        for(var i = 0 ; i < this.addHoldsPool.length ;++i){
            this.addHoldsPool.pop();
        }
        this.zhuang = -1;
        this.numOfPai = 0 ;
        if(this.seats){
            for(var i = 0; i < this.seats.length; ++i){
                this.seats[i].holds = [];
                this.seats[i].ready = false;
                this.seats[i].giveUp = false;
                this.seats[i].holdlen = 0;
            }
        }
        if(this.localSeatData){
            for(var i = 0; i < this.localSeatData.length; ++i){
                this.localSeatData[i].holds = [];
            }
        }



    },

    getGameInitData:function () {
        return this.gameInitData;
    },
    setGameInitData:function (initData) {
        this.gameInitData = initData;
    },

    resetGameInitData:function () {
        this.gameInitData = {};
    },
    clearGameInitData:function () {
        this.gameInitData = null;
    },

    getGameOverData:function () {
      return this.gameOverData;
    },
    setGameOverData:function (overData) {
        this.gameOverData = overData;
    },
    resetGameOverData:function () {
            this.gameOverData = {};
    },
    clearGameOverData:function () {
        this.gameOverData = null;
    },
    getGameSyncData:function () {
        return this.gameSyncData;
    },
    setGameSyncData:function (syncData) {
        this.gameSyncData = syncData;
    },

    setKingVsTwo:function (value) {
      this.kingvstwo = value;
    },
    getKingVsTwo:function () {
      return this.kingvstwo;
    },

    resetGameSyncData:function () {
      this.gameSyncData = {};
    },
    clearGameSyncData:function () {
      this.gameSyncData = null;
    },

    setGameState:function (state) {
        this.gamestate = state;
    },
    getGameState:function () {
      return this.gamestate;
    },
    resetGameState:function(){
        this.gamestate = ""
    },


    getGameTest:function () {
        var isTest = false;
        if(cc.sys.os == cc.sys.OS_ANDROID){
            isTest =  cc.sys.localStorage.getItem('AndroidTest');
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            isTest =  cc.sys.localStorage.getItem('IOSTest');
        }else{
            isTest = true;
        }
        if(isTest =="false"){
            isTest = false;
        }
        if(isTest == "true"){
            isTest = true;
        }
        return isTest;
    },

    getGameReview:function () {
        var isTest = false;
        if(cc.sys.os == cc.sys.OS_ANDROID){
            isTest =  cc.sys.localStorage.getItem('AndroidReview');
        }else if(cc.sys.os == cc.sys.OS_IOS){
            isTest =  cc.sys.localStorage.getItem('IOSReview');
        }else{
            isTest = false;
        }
        if(isTest =="false"){
            isTest = false;
        }
        if(isTest == "true"){
            isTest = true;
        }
        return isTest;
    },

    setGameConfig:function (value) {
        this.conf = value;
    },
    getGameConfig:function () {
      return this.conf;
    },
    setNumOfGame:function (num) {
        this.numOfGames = num;
    },
    getNumOfGames:function () {
        return this.numOfGames;
    },
    setRoomId:function (roomid) {
        this.roomId = roomid;
    },
    getRoomId:function () {
        return this.roomId;
    },

    getNameById:function (id) {

        console.log("this.seat d " , this.seats , id);
        var name = "";
        for(var i = 0 ; i < this.seats.length ; ++ i ){
            if(this.seats[i].userid == id){
                name = this.seats[i].name;
            }
        }
        return name;
    },

    setGameSeats:function (seatsdata) {
        this.seats = seatsdata;
    },
    getGameSeats:function () {
        return this.seats;
    },

    getSeatDataByIndex:function (index) {
        return this.seats[index];
    },
    setSeatDataByIndex:function (index,data) {
        this.seats[index] = data ;
    },
    getPlayerSeatsLength:function () {
        var count = 0 ;
        for(var i = 0 ; i < this.seats.length ; ++i){
            if(this.seats[i].userid  && this.seats[i].userid > 0 ){
                count ++;
            }
       }
       return count ;
    },

    seatIndexHave:function (index) {
            if(this.seats[index].name != ""){
              return false ;
            }
        return true ;
    },


    setPaiCount:function (value) {
        this.paiCount = value ;
    },
    getPaiCount:function () {
        return this.paiCount;
    },

    setFanCount:function (value) {
        this.fanCount = value+"";
    },
    getFanCout:function () {
        return this.fanCount+"";
    },

    setLunCount:function (value) {
        this.lunCount = value;
    },
    getLunCount:function () {
        return this.lunCount;
    },


    getSeatHoldsByIndex:function (index) {
        if(this.seats[index] && this.seats[index].holds.length > 0 )
        {
            return this.seats[index].holds;
        }
        if(cc.vv.dataMgr.DEBUG) console.log("当前座位"+index+"没有手牌");
        return null;

    },

    getSeatHoldLen:function (id) {
        var index = this.getSeatIndexByID(id);
        if(this.seats[index] && this.seats[index].holdlen )
        {
            return this.seats[index].holdlen;
        }
        return 0;
    },

    setSeatHoldLen:function (id,len) {
        var index = this.getSeatIndexByID(id);
        if(this.seats[index] )
        {
            this.seats[index].holdlen =len;
        }

    },

    getSeatHoldsById:function (id) {
        var index = this.getSeatIndexByID(id);
        if(this.seats[index] && this.seats[index].holds.length > 0 )
        {
            return this.seats[index].holds;
        }
        return null;
    },
    addSeatHoldsById:function (id,data,gong) {
        var index = this.getSeatIndexByID(id);
        if(this.seats[index] )
        {
            if(cc.vv.dataMgr.DEBUG) console.log("手牌添加成功"+id+"位置"+index+"手牌"+data+"shuliang"+cc.vv.dataMgr.numOfPai);
            var data_c = {};
            data_c.id =id;
            data_c.data = data;
            data_c.gong = gong == 1;
            this.addHoldsPool.unshift(data_c);


            console.log("addHoldsPooladdHoldsPool-->",this.addHoldsPool)

        }
        return this.seats[index].holds;
    },


    setLzNum:function (value) {
        this.lzNum = value;
    },

    getLzNum:function () {
      return this.lzNum;
    },

    clearSeatsHolds:function () {
        for (var i = 0 ; i < this.seats.length;++i){
            this.seats[i].holds = [];
        }
    },

    getScoreById:function (userId) {
        var score = 0;
        if(this.seats){
            for(var i = 0 ; i < this.seats.length ; ++i){
                if(this.seats[i].userid == userId ){
                    score =  this.seats[i].score;
                }
            }
        }
        return score;
    },

    getSeatIndexByID:function(userId){
        for(var i = 0; i < this.seats.length; ++i){
            var s = this.seats[i];
            if(s.userid == userId){
                return i;
            }
        }
        return -1;
    },
    isOwner:function(){
        return this.seatIndex == 0;
    },

    getSeatByID:function(userId){
        var seatIndex = this.getSeatIndexByID(userId);
        var seat = this.seats[seatIndex];
        return seat;
    },
    sortPoker:function(holds){
        holds.sort(function(a,b){
            return a.sortValue > b.sortValue;
        });
    },

    getSelfData:function(){
        var holds = [];
        for(var i = 0 ; i <this.seats[this.seatIndex].holds.length ; ++ i  ){
            holds.push(this.seats[this.seatIndex].holds[i]);
        }
        this.sortPoker(holds);
        this.seats[this.seatIndex].holds = holds;
        return this.seats[this.seatIndex];
    },

    getLocalIndex:function(index){
        var ret = (index - this.seatIndex + 5) % 5;
        return ret;
    },

    getAddHoldPool:function () {
        return this.addHoldsPool;
    },


    converSortPoker:function (holds) {


        return holds;
    },

    converOutPoker:function (holds){

    },


    getIsCreatorById:function(id){
        if(this.creatorId == id ){
            return true;
        }
        return false  ;
    },

    setGameZhuang:function (zg) {
        this.zhuang = zg;
    },
    getGameZhuang:function () {
      return this.zhuang;
    },

    setSeatIndex:function (index) {
       this.seatIndex = index;
    },
    getSeatIndex:function () {
        return this.seatIndex ;
    },
    setLocalIndex:function (index) {
      this.localIndex = index;
    },

    setGameSync:function (value) {
        this.isSync =  value;
    },
    getGameSync:function () {
        return this.isSync;
    },
    resetGameSync:function () {
        this.isSync = false;
    },

    setGameFan:function (value) {
        this.nowFan = value;
    },

    getGameFan:function () {
      return this.nowFan;
    },


    setMinCoins:function (_value) {
        this.minCoins = _value;
    },
    getMinCoins:function () {
        return this.minCoins;
    },
    setMaxCoins:function (_value) {
        this.maxCoins = _value;
    },
    getMaxCoins:function () {
        return this.maxCoins;
    },
    setRunInBack:function (_value) {
        this.isRunInBack = _value;
    },
    getRunInBack:function () {
        return this.isRunInBack;
    },

    getOptionName:function (sound) {
        var soundName = "";
        if(sound == 0){
            //下注
            soundName = "xiazhu";
        }else if (sound == 1){
            //扣牌
            soundName = "koupai";

        }else if (sound == 10){
            //跟注
            soundName = "genzhu";

        }else if (sound == 11){
            //扣牌
            soundName = "koupai";

        }else if (sound == 20){
            //起脚
            soundName = "qijiao";
        }else if (sound == 21){
            //踢
            soundName = "qijiao";

        }else if (sound == 22){
            //反踢
            soundName = "fanti";
        }else if (sound == 23 ){
            //不踢
            soundName = "buti";
        }

        return soundName;
    },

    isGiveUp:function () {
        var isGiveUp = false;
      for(var i = 0 ; i < this.seats.length;++i){
            if(this.seats[i].userid == cc.vv.userMgr.userId){
                if(this.seats[i].giveUp){
                    isGiveUp = true;
                }
            }
      }
      return isGiveUp;
    },

    clear:function(){
        this.dataEventHandler = null;
        if(this.isOver == null){
            this.seats = null;
            this.curaction = null;
            this.turnOpt = -1;
            this.localSeatData = null;
            this.gameInitData = null;
            this.gameOverData = null;
            this.roomId = null;
            this.maxNumOfGames = 0;
            this.numOfGames = 0;
        }
    },

    getDifScoreById:function(userId){


    },

    getUserScore: function() {
        if (cc.vv.dataMgr.addHoldsScore == null){
            cc.vv.dataMgr.addHoldsScore = {};
        }
        return cc.vv.dataMgr.addHoldsScore;
    },

    getMax:function() {
        var userScores = cc.vv.dataMgr.getUserScore();
        var maxUid = 0, maxScore = 0;
        for(var k in userScores) {
            var score = userScores[k];
            if(maxScore < score) {
                maxUid = k;
                maxScore = score;
            }
        }
        return {uid:maxUid, score:maxScore};
    },

    getScoreByUid:function(_uid) {
        var userScores = cc.vv.dataMgr.getUserScore();
        var score = userScores[_uid];
        return score == null ? 0 : score;
    },

    getDiff:function(_uid, _maxScore) {
        var score = cc.vv.dataMgr.getScoreByUid(_uid);
        return _maxScore - score;
    },

    setTurnOps:function(_value){
        this.trunOps = _value;
    },
    getTurnOps:function(){
        return this.trunOps;
    },





    AddHoldUpdate:function(dt) {


    },




});
