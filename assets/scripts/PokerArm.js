/**
 * Created by Joker on 17/2/26.
 */
cc.Class({
    extends: cc.Component,

    properties: {

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
    },



    init:function () {
      
    },

    test:function () {
      console.log("pokerArm---test");
    },
    
    tryOutCard:function (tPokers, tLastPokers, nLzValue, nJokerVS2Type, nGameType) {

        var tRsConvert = {}


        if(tLastPokers.length == 0 ){    //未选择牌提示
            var tObjs = this.num2Objs(tPokers, nLzValue)
            this.sortPokers(tObjs);
            var tNLzObjs = [];
            var tLzObjs = [];
            for(var i = 0 ; i < tObjs.length ; ++i ){
                if(tObjs[i].isLz || tObjs[i].isJoker){
                    tLzObjs.push(tObjs[i]);
                }else{
                    tNLzObjs.push(tObjs[i]);
                }
            }

            console.log("leng=========0 " ,tObjs,tNLzObjs,tLzObjs );

            var tResult;
            tResult = this.tryConvertSingle(tObjs, tNLzObjs, tLzObjs, [], nJokerVS2Type);

            if(!tResult.data  ){
                tResult = this.tryConvertPair(tObjs, tNLzObjs, tLzObjs, [], nJokerVS2Type);
            }
            if(!tResult.data ){
                tResult = this.tryConvertShunzi(tObjs, tNLzObjs, tLzObjs, [], nJokerVS2Type);
            }
            if(!tResult.data ){
                tResult = this.tryConvertShuangshun(tObjs, tNLzObjs, tLzObjs, [], nJokerVS2Type);
            }
            if(!tResult.data){
                tResult = this.tryConvertSoftBomb(tObjs, tNLzObjs, tLzObjs, [], nJokerVS2Type);
            }
            if(!tResult.data ){
                tResult = this.tryConvertHardBomb(tObjs, tNLzObjs, tLzObjs, [], nJokerVS2Type);
            }
            if(!tResult.data ){
                tResult = this.tryConvertRocket(tObjs, tNLzObjs, tLzObjs, [], nJokerVS2Type);
            }
            if(tResult.data  ){
                tRsConvert = tResult ;
            }

            console.log("tryToConverRo-------- > ", tResult ,tRsConvert );

        }else{   //选择牌提示
            var tRs = this.getHints(tPokers, tLastPokers, nLzValue, nJokerVS2Type, nGameType);
            var tObjs = this.num2Objs(tPokers, nLzValue);
            var tLastObjs = this.num2Objs(tLastPokers) ;
            var lastType = this.getPokerType(tLastObjs);
            var tNLzObjs = [];
            var tLzObjs = [];
            var tResult;        ;
            for(var i = 0 ; i < tObjs.length ; ++ i ){
                if(tObjs[i].isJoker || tObjs[i].isLz){
                    tLzObjs.push(tObjs[i]);
                } else{
                    tNLzObjs.push(tObjs[i]);
                }
            }

            console.log("last type === > " ,lastType )   ;

            if(lastType == this.SINGLE){
                tResult = this.tryConvertSingle(tObjs, tNLzObjs, tLzObjs,tLastObjs, nJokerVS2Type);
            }else if(lastType == this.PAIR){
                tResult = this.tryConvertPair(tObjs, tNLzObjs, tLzObjs,tLastObjs, nJokerVS2Type);
            }else if(lastType == this.DAN_SHUN){
                tResult = this.tryConvertShunzi(tObjs, tNLzObjs, tLzObjs,tLastObjs, nJokerVS2Type);
            }else if(lastType == this.SHUANG_SHUN) {
                tResult = this.tryConvertShuangshun(tObjs, tNLzObjs, tLzObjs,tLastObjs, nJokerVS2Type);
            }else if(lastType == this.SOFT_BOMB){
                tResult = this.tryConvertSoftBomb(tObjs, tNLzObjs, tLzObjs,tLastObjs, nJokerVS2Type);
            }else if(lastType == this.HARD_BOMB){
                tResult = this.tryConvertHardBomb(tObjs, tNLzObjs, tLzObjs,tLastObjs, nJokerVS2Type);
            }else if(lastType == this.ROCKET){
                tResult = this.tryConvertRocket(tObjs, tNLzObjs, tLzObjs,tLastObjs, nJokerVS2Type);
            }
            if(tResult.data){
                tRsConvert = tResult;
            }


            console.log("try to out card === > " ,tRsConvert )     ;
        }



        return tRsConvert;

    },


    tryConvertSingle:function (tObjs, tNLzObjs, tLzObjs, tLastObjs, nJokerVS2Type) {
        console.log("tryConvertSingle",tObjs,tLastObjs,tObjs.length,tLastObjs.length);
        var res = {};
        if (tObjs.length != 1) {
            return res;
        }
        else if (tLastObjs.length == 0 && (tObjs[0].isJoker) ){
            return res;
        } else if (tLastObjs.length != 1 || tObjs[0].value - tLastObjs[0].value != 1  ) {
            console.log("------000--")
            return res;
        }

        res.data = this.obj2Nums(tObjs);
        res.type = this.SINGLE;
        return res;

    },

    tryConvertPair:function (tObjs, tNLzObjs, tLzObjs, tLastObjs) {
        console.log("tryConvertPair",tObjs);
        var tRs = [];
        if (tObjs.length != 2){
            return tRs
        }

        if (tNLzObjs.length == 2 && tNLzObjs[0].value != tNLzObjs[1].value){
            return tRs
        }
        if (tNLzObjs.length == 2){
            tRs = this.obj2Nums(tObjs)
        }
        else if (tNLzObjs.length == 1){
            tRs.push(this.obj2Num(tNLzObjs[0]));
            tRs.push(tNLzObjs[0].value*10+this.LAIZI_TYPE);
        }
        else{
            tRs.push(this.obj2Num(tLzObjs[0]));
            if(tLastObjs[1].isJoker()){
                tRs.push(tLastObjs[0].value*10 + this.LAIZI_TYPE);
            }else{
                tRs.push(this.obj2Num(tLzObjs[1]));
            }
        }
        var res = {};
        res.data = tRs;
        res.type = this.PAIR;

        return res
    },

    tryConvertShunzi:function (tObjs, tNLzObjs, tLzObjs, tLastObjs) {
        console.log("tryConvertShunzi",tObjs);
        var tRs = [];
        if(tLastObjs.length == 0 ){
            if(tObjs.length < 3 ){
                return tRs;
            }
            var startValue = tNLzObjs[0].value
            if( startValue + tObjs.length - 1 > this.VALUE_A){
                startValue = this.VALUE_A - tObjs.length + 1
            }
            var tCreateLastPokers = [];
            for (var i = 0 ; i < tObjs.length ; ++i ){
                tCreateLastPokers.push((startValue-1+i)*10+1001);
            }
            console.log("tryConvertShunzi===== " ,tCreateLastPokers );

            var tCreateLastObjs = this.num2Objs(tCreateLastPokers);
            var tResult = this.getBiggerShunzi(tObjs, tCreateLastObjs, null, tLzObjs);
            if (tResult.length > 0){
                tRs =  this.tryConvertShunzi(tObjs, tNLzObjs, tLzObjs, tCreateLastObjs)
            }
            else{
                return tRs
            }

        }else{
            var nNLzObjsIndex = 0;
            for(var i=0;i<tObjs.length;++i){
                var curV = tLastObjs[i].value;
                if(tNLzObjs[nNLzObjsIndex] && tNLzObjs[nNLzObjsIndex].value == curV + 1 ){
                    tRs.push(tNLzObjs[nNLzObjsIndex]);
                    nNLzObjsIndex = nNLzObjsIndex+1;
                }else{
                    tRs.push((curV+1)*10 + this.LAIZI_TYPE);
                }
            }

        }

        var res = {};
        res.data = tRs;
        res.type = this.DAN_SHUN;
        return res;
    },


    tryConvertShuangshun:function (tObjs, tNLzObjs, tLzObjs, tLastObjs) {
        console.log("tryConvertShuangshun",tObjs);
        var tRs = [];
        if(tLastObjs.length == 0 ){
            if (tObjs.length < 4 || tObjs.length % 2 != 0){
                return tRs;
            }
            var startValue = tNLzObjs[0].value;
            if (startValue + tObjs.length / 2 - 1 > this.VALUE_A){
                startValue = this.VALUE_A - tObjs.length / 2 + 1;
            }
            var tCreateLastPokers = [];
            for(var i  = 0 ; i < tObjs.length; ++i){
                console.log("startValue==",startValue,parseInt((i-1 )/2-1),(startValue + parseInt((i-1 )/2 -1 )* 10));
                tCreateLastPokers.push(((startValue + parseInt((i-1 )/2 -1 ))* 10) +1001 );
            }
            console.log("tryConvertShuangshun  tCreateLastPokers======--- > " ,tCreateLastPokers);
            var tCreateLastObjs = this.num2Objs(tCreateLastPokers);
            var tResult = this.getBiggerShuangshun(tObjs, tCreateLastObjs, null, tLzObjs);
            if (tResult.length > 0){
                return this.tryConvertShuangshun(tObjs, tNLzObjs, tLzObjs, tCreateLastObjs)
            }
            else{
                return tRs
            }
        }else{
            tRs = this.tryConvertShunzi(tObjs,tNLzObjs,tLzObjs,tLastObjs);
        }

        var res = {};
        res.data = tRs;
        res.type = this.SHUANG_SHUN;

        return res;

    },

    tryConvertBombByCount:function (tObjs, tNLzObjs, tLzObjs, tLastObjs, nBombCount) {
        console.log("tryConvertBombByCount",tObjs,tLastObjs,nBombCount);
        var tRs = [];
        if(tLastObjs.length == 0 ){
            if(tObjs.length != nBombCount){
                 console.log("tryConvertB   211112222==== ombByCount",tObjs,tLastObjs,nBombCount);
                return null;
            }
            for(var i = 1 ; i < tNLzObjs.length ; ++ i ){
                if(tNLzObjs[i].value != tNLzObjs[0].value){
                     console.log("tryConvertB22       22      ombByCount",tObjs,tLastObjs);
                    return null;
                }
            }
        }

        console.log("tryConvertBombByCount",nBombCount,tNLzObjs);

        if(tNLzObjs.length == 0 ){
            for(var i = 0 ; i < tObjs.length ; ++i){
                if(tObjs[i].isJoker) {
                    tRs.push(tObjs[0].value*10 + this.LAIZI_TYPE);
                }else{
                    tRs.push(this.obj2Num(tObjs[i]));
                }
            }
        }else{
            tRs = this.obj2Nums(tNLzObjs);
            for(var i = 0 ; i < tLzObjs.length ; ++i){
                if(tLzObjs[i].isJoker || tLzObjs[i].value != tNLzObjs[0].value){
                    tRs.push(tNLzObjs[0].value*10 + this.LAIZI_TYPE);
                }
            }
        }



        return tRs;

    },

    tryConvertSoftBomb:function (tObjs, tNLzObjs, tLzObjs, tLastObjs) {
        console.log("tryConvertSoftBomb",tObjs);
        var res = {};
        res.data = this.tryConvertBombByCount(tObjs, tNLzObjs, tLzObjs, tLastObjs, 3);
        res.type = this.SOFT_BOMB;
        return res;
    },

    tryConvertHardBomb:function (tObjs, tNLzObjs, tLzObjs, tLastObjs) {
        console.log("tryConvertHardBomb",tObjs);
        var res = {};
        res.data = this.tryConvertBombByCount(tObjs, tNLzObjs, tLzObjs, tLastObjs, 4)
        res.type = this.HARD_BOMB;
        return res;
    },

    tryConvertRocket:function (tObjs, tNLzObjs, tLzObjs, tLastObjs) {
        console.log("tryConvertRocket",tObjs);
        var tRs = [];
        if(tLastObjs.length == 0 ){
            if(tObjs.length == 2 && this.isRocket(tObjs)){
                console.log("fuck to rock -- > " , this.obj2Nums(tObjs))
                tRs = tObjs;
            }
        }else if(this.isRocket(tObjs)) {
            tRs = tObjs;
        }

        var res = {};
        res.data = tRs;
        res.type = this.ROCKET;
        return res;
    },
    
    



    getHints:function (tPokers, tLastPokers, nLzValue, nJokerVS2Type, nGameType) {
        var tRs=[];
        var tRsType=[];
        var tBiggerTypes = [];

        var tObjs = this.num2Objs(tPokers, nLzValue);
        var tLastObjs = this.num2Objs(tLastPokers);

         console.log("tObjs=============",tObjs)

        this.sortPokers(tObjs);
        this.sortPokers(tLastObjs);
        console.log("sortPokers tObjs=============",tObjs)

        console.log("tPokers ---- > " , tObjs,tLastObjs);
        var lastType = this.getPokerType(tLastObjs);
        console.log("lastType ---- > " , lastType);
        if(lastType == this.ERROR_TYPE){
            return tRs;
        }
        if (lastType == this.ROCKET ){
            return tRs;
        }
        var tLzObjs = [];
        for(var i = 0 ; i < tObjs.length ; ++ i ){
            if(tObjs[i].isLz || tObjs[i].isJoker){
                console.log("isLzizii" , tObjs[i]);
                tLzObjs.push(tObjs[i]);
            }
        }
        if(lastType == this.SINGLE){
            tRs = this.getBiggerSingles(tObjs, tLastObjs, lastType, tLzObjs, nJokerVS2Type);
        }else if(lastType == this.PAIR){
            tRs =this.getBiggerPairs(tObjs, tLastObjs, lastType, tLzObjs, nJokerVS2Type);
        }else if(lastType == this.SHUANG_SHUN){
            tRs =this.getBiggerShuangshun(tObjs, tLastObjs, lastType, tLzObjs, nJokerVS2Type);
        }else if(lastType == this.DAN_SHUN){
            tRs =this.getBiggerShunzi(tObjs, tLastObjs, lastType, tLzObjs, nJokerVS2Type);
        }else if(lastType == this.SOFT_BOMB){
            tRs =this.getBiggerSoftBomb(tObjs, tLastObjs, lastType, tLzObjs, nJokerVS2Type);
        }else if(lastType == this.HARD_BOMB){
            tRs =this.getBiggerHardBombs(tObjs, tLastObjs, lastType, tLzObjs, nJokerVS2Type);
        }else if(lastType == this.ROCKET){
            tRs =this.getRocket(tObjs, tLastObjs, lastType, tLzObjs, nJokerVS2Type);
        }
        return tRs;
    },


    getBiggerSingles:function (tObjs, tLastObjs, lastType, tLzObjs, nJokerVS2Type) {
        console.log("getBiggerSingles  000",tLastObjs,tObjs);
        var tRs = [];
        var lastValue = tLastObjs[0].value;
        for(var i = 0  ; i < tObjs.length;++ i ){
            if (lastValue != this.VALUE_2 && tObjs[i].value == lastValue + 1 || lastValue < tObjs[i].value && tObjs[i].value == this.VALUE_2 || lastValue == this.VALUE_2 && nJokerVS2Type > 0 && this.obj2Num(tObjs[i]) == this.SMALL_JOKER || lastValue == this.VALUE_2 && nJokerVS2Type == 2 && this.obj2Num(tObjs[i]) == this.BIG_JOKER){
                tRs.push(this.obj2Num(tObjs[i]));
                break;
            }
        }
        console.log("getBiggerSingles  --->",tRs);
        return tRs
    },

    getBiggerPairs:function (tObjs, tLastObjs, lastType, tLzObjs) {
        var  tRs = []
        console.log("getBiggerPairs",tObjs,tLastObjs,lastType,tLzObjs);
        if (tObjs.length < 2){
            return tRs
        }
        var lastValue = tLastObjs[0].value
        console.log("getBiggerPairs---->lastValue",lastValue);
        if (lastValue == this.VALUE_2) {
            return tRs
        }
        var nUsedLzCount = 0
        var isMatch = false
        var isMatch2 = false

        for(var i = 0 ; i < tObjs.length ;++i){
            console.log("fun for " , i,tObjs[i].value,lastValue ,tObjs[i].value == lastValue + 1);
            if (!isMatch && tObjs[i].value == lastValue + 1){

                isMatch = true;
                if ((tObjs[i + 1]) && tObjs[i].value == tObjs[i + 1].value){
                    tRs.push(this.obj2Num(tObjs[i]));
                    tRs.push(this.obj2Num(tObjs[i+1]));
                }else if (tLzObjs.length - nUsedLzCount > 0 ){
                    if(tObjs[i].isLz && tLzObjs.length-nUsedLzCount - 1 > 0 ){
                        tRs.push(this.obj2Num(tLzObjs[0]));
                        tRs.push(this.obj2Num(tLzObjs[1]));
                    }else if(!tObjs[i].isLz){
                        tRs.push(this.obj2Num(tObjs[i]));
                        tRs.push(this.obj2Num(tLzObjs[0]));
                    }
                }
            }else if(!isMatch2 && tObjs[i].value == this.VALUE_2){
                isMatch2 = true;
                if(tObjs[i+1] && tObjs[i].value == tObjs[i+1].value){
                    tRs.push(this.obj2Num(tObjs[i]));
                    tRs.push(this.obj2Num(tObjs[i+1]));

                }else if(tLzObjs.length - nUsedLzCount > 0 ){
                    if(tObjs[i].isLz && tLzObjs.length - nUsedLzCount - 1 > 0 ){
                        tRs.push(this.obj2Num(tLzObjs[0]));
                        tRs.push(this.obj2Num(tLzObjs[1]));

                    }else if(!tObjs[i].isLz){
                        tRs.push(this.obj2Num(tObjs[i]));
                        tRs.push(this.obj2Num(tLzObjs[1]));
                    }
                }
            }
        }
        return tRs
    },


    getBiggerShunzi:function (tObjs, tLastObjs, lastType, tLzObjs) {
        var tRs = [];
        if (tObjs.length < tLastObjs.length){
            return tRs;
        }
        if (tLastObjs[tLastObjs.length-1].value == this.VALUE_A){
            return tRs;
        }
        var tmp = [];
        var len = tLastObjs.length;
        var nUsedLzCount = 0;
        var bMatchOne = false;
        var tNLzObjs = [];

        console.log("lz-lengit -- > " , tLzObjs.length,tLzObjs)

        for(var i = 0 ; i < tObjs.length ; ++ i){
            if(!tObjs[i].isLz && !tObjs[i].isJoker){
                tNLzObjs.push(tObjs[i]);
            }
        }
        for(var i = 0 ; i < tLastObjs.length ; ++ i ){
            bMatchOne = false;
            for(var j = 0 ; j < tNLzObjs.length ; ++j){
                if(tNLzObjs[j].value == tLastObjs[i].value + 1 ){
                   tmp.push(this.obj2Num(tNLzObjs[j]));
                    tNLzObjs.splice(j,1);
                    bMatchOne = true;
                    break;
                }
            }
            if(!bMatchOne){
                if(tLzObjs.length - nUsedLzCount > 0 ){
                    nUsedLzCount = nUsedLzCount + 1 ;
                    bMatchOne  = true;
                }else{
                    break;
                }
            }

            console.log("bMatchOne---- > " ,tmp.length,nUsedLzCount,len );
            if(bMatchOne && tmp.length + nUsedLzCount == len){
                console.log("fuck to run herre ");
                for(var x = 0 ; x<nUsedLzCount ; ++ x){
                    tmp.push(this.obj2Num(tLzObjs[x]));
                }
                tRs = tmp ;
            }
        }

        console.log("getBiggerShunzi----->",tRs);

        return tRs;

    },



    getBiggerShuangshun:function (tObjs, tLastObjs, lastType, tLzObjs) {
        return this.getBiggerShunzi(tObjs, tLastObjs, lastType, tLzObjs)
    },


    getBiggerSoftBomb:function (tObjs, tLastObjs, lastType, tLzObjs) {
        return this.getBiggerBombByCount(tObjs, tLastObjs, lastType, tLzObjs, 3)
    },


    getBiggerBombByCount:function (tObjs, tLastObjs, lastType, tLzObjs, nBombCount) {
        var tRs = [];
        if (nBombCount > tObjs.length){
            return tRs
        }
        var lastValue = 0;
        if(lastType == this.getBombType(nBombCount)){
            lastValue = tLastObjs[1].value;
            if(lastValue == this.VALUE_2){
                return tRs;
            }
        }
        var nUsedLzCount = 0;
        var tmp = [];
        var self = this;
        function checkObj(obj ,t) {
            if (obj.isLz && tLzObjs.length - nUsedLzCount > 0){
                nUsedLzCount = nUsedLzCount + 1
            }
            else if (!obj.isLz){
                t.push(self.obj2Num(obj));
            }
        }


        for(var i = 0 ; i < tObjs.length ; ++i ){

            nUsedLzCount = 0;
            tmp = [];
            if(lastValue < tObjs[i].value && tObjs[i].value <= this.VALUE_2){
                checkObj(tObjs[i],tmp);
                for(var j = 0 ; j < nBombCount - 1 ; ++ j ){
                    if(tObjs[i+j] && tObjs[i].value == tObjs[i+j].value){
                        checkObj(tObjs[i+j],tmp);
                    }else{
                        break;
                    }
                }
                if(tmp.length + nUsedLzCount == nBombCount){
                    for(var z = 0 ; z<nUsedLzCount ;++z){
                        tmp.push(this.obj2Num(tLastObjs[z]));
                    }
                    for(var j = 0 ; j < tmp.length;++j){
                        tRs.push(tmp[j]);
                    }
                    lastValue = tObjs[i].value;
                }else if (tLzObjs.length - nUsedLzCount - (nBombCount - tmp.length - nUsedLzCount) >= 0 ){
                    for(var x = 0 ; x <nBombCount-tmp.length;++x){
                        tmp.push(this.obj2Num(tLzObjs[x]));
                    }
                    for(var j = 0 ; j < tmp.length;++j){
                        tRs.push(tmp[j]);
                    }
                    console.log("tObjs[i].value;" , i )
                    lastValue = tObjs[i].value;
                }

            }
        }
        console.log("getBiggerBombByCount - > " , tRs);
     return tRs;

    },



    getBiggerHardBombs:function (tObjs, tLastObjs, lastType, tLzObjs) {
        return this.getBiggerBombByCount(tObjs, tLastObjs, lastType, tLzObjs, 4)
    },



    getRocket:function (tObjs, tLastObjs, lastType, tLzObjs) {
        var tRs = [];
        if (tObjs.length < 2){
            return tRs;
        }
        var poker1 = this.obj2Num(tObjs[tObjs.length - 1]);
        var poker2 = this.obj2Num(tObjs[tObjs.length]);
        if (poker1 == this.SMALL_JOKER && poker2 == this.BIG_JOKER){
            tRs.push(poker1);
            tRs.push(poker2);
        }
        return tRs
    },

    getBombType:function (nBombCount) {
        if(nBombCount == 3 ){
            return this.SOFT_BOMB;
        }else if(nBombCount == 4 ){
            return this.HARD_BOMB;
        }
        return this.ERROR_TYPE;
    },
    sortPokers:function (poker) {
        poker.sort(function (a,b) {
            return a.sortValue > b.sortValue;
        })
    },
    cloneSortPokers:function (pokers) {
        var tmp = this.clone(pokers);
        // this.sortPokers(tmp);
        return tmp ;
    },

    isSingle:function (pokers) {
        return  pokers.length == 1;
    },

    isPair:function (pokers) {
        console.log("isPair------->" , pokers)
        if(pokers.length!= 2){
            return false;
        }

        var v1 = parseInt(pokers[0].value);
        var v2 = parseInt(pokers[1].value);
        return v1 == v2 &&  !this.isJoker(pokers[1]) && !this.isJoker(pokers[2]);
    },

    isShunzi:function (pokers) {
        console.log("isShunzi------->" , pokers,pokers.length)
        if (pokers.length < 3){
            return false
        }
        for(var i = 0 ; i <pokers.length-1;++i){
            if(pokers[i].value+1 != pokers[i+1].value){
                return false;
            }
        }
        return true
    },

    isShuangShunzi:function (pokers) {

        console.log("isShuanshun === > " , pokers,pokers.length)
        if (pokers.length < 4 || pokers.length % 2 != 0){
            return false
        }
        for(var i = 0 ; i < pokers.length-2; ++i){
            if(i%2!=0){
                if(pokers[i].value+1 != pokers[i+1].value){
                    console.log("fuck ",i,pokers[i].value,pokers[i+1].value)
                    return false;
                }
            }else if (pokers[i].value+1 != pokers[i+2].value){
                console.log("eslef uck  ",pokers[i].value,pokers[i+1].value)
                return false;
            }
        }
        return true
    },


    isRocket:function (pokers) {
        if (pokers.length != 2){
            return false
        }

        console.log("is rock  .. " , pokers)
        return this.isJoker(pokers[1].value) && this.isJoker(pokers[0].value)
    },


    isSoftBomb:function (pokers) {
        if (pokers.length != 3){
            return false
        }
        return pokers[0].value == pokers[1].value && pokers[0].value == pokers[2].value;
    },


    isHardBomb:function (pokers) {
        if (pokers.length != 4){
            return false
        }
        return pokers[0].value == pokers[1].value && pokers[0].value == pokers[2].value &&  pokers[0].value== pokers[3].value;
    },



    getPokerType:function (pokers) {
        if (this.isSingle(pokers)){
            return this.SINGLE;
        }
        else if( this.isPair(pokers)){
            return this.PAIR;
        }
        else if(this.isShunzi(pokers)){
            return this.DAN_SHUN;
        }
        else if(this.isShuangShunzi(pokers)){
            return this.SHUANG_SHUN;
        }
        else if (this.isSoftBomb(pokers)){
            return this.SOFT_BOMB;
        }
        else if( this.isHardBomb(pokers)){
            return this.HARD_BOMB;
        }
        else if( this.isRocket(pokers)){
            return this.ROCKET;
        }

        return -1;
    },

    num2Objs:function (nums,nLzValue) {
        var pokerObjs = [];
        for(var i = 0 ; i < nums.length ; ++i){
            pokerObjs.push(this.num2Obj(nums[i],nLzValue));
        }
        return pokerObjs;
    },

    num2Obj:function (num,nLzValue) {
        var pokerObj = [];
        pokerObj.value = parseInt((num - 1000) / 10);
        pokerObj.type  = parseInt(num % 10);
        pokerObj.isLz = pokerObj.value == nLzValue;
        if(pokerObj.isLz){
            pokerObj.sortValue =  num +1000;
        }else{
            pokerObj.sortValue =  num ;
        }
        pokerObj.isJoker = this.isJoker(num);
        return pokerObj;
    },


    obj2Num:function (obj) {
        return obj.value*10 + 1000 + obj.type;
    },

    obj2Nums:function (objs) {
        var t = [];
        for(var i = 0 ; i < objs.length ; ++ i ){
            t.push(this.obj2Num(objs[i]));
        }
        return t;

    },

    clone:function(obj) {
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(clone(obj[i]));
                    }
                } else {
                    o = [];
                    for (var j in obj) {
                        o[j] = clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    },

    isJoker:function (value) {
        var pnum = parseInt(value);
        return pnum == this.BIG_JOKER || pnum == this.SMALL_JOKER;
    },



});
