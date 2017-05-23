/**
 * Created by Joker on 17/2/26.
 */
cc.Class({
    extends: cc.Component,

    properties: {

        allPokers:{
            default:null,
            type:cc.SpriteAtlas
        },

        SINGLE:1,
        PAIR:2,
        DAN_SHUN:3,
        SHUANG_SHUN:4,
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
        SMALL_JOKER:1160,
        BIG_JOKER:1170,
        AD_POKER:18,

        VALUE_2:15,
        VALUE_A:14,
    },
    copyObjs:function(objs) {
    var tmp = [];
    for (var i = 0; i < objs.length; ++i) {
        tmp.push(objs[i]);
    }
    return tmp;
},


 appendObjs:function(objs1, objs2) {
    for(var i = 0 ; i < objs2.length ; ++i) {
        objs1.push(objs2[i]);
    }
},

 sortPokersDescend:function(pokers) {
    pokers.sort(function (a, b) {
        return a.sortValue < b.sortValue;
    });
},
 sortPokers:function(pokers) {
    pokers.sort(function (a, b) {
         return a > b;
    });
},

 copySortPokers:function(pokers) {
    var tmp = this.copyObjs(pokers);
    this.sortPokers(tmp);
    return tmp;
},

 removeObjsFromObjs:function(objs1, objs2) {
    for (var i = 0; i < objs1.length; ++i) {
        var obj1 = objs1[i]
        for (var j = 0; j < objs2.length;) {
            var obj2 = objs2[j];
            if (obj1.value == obj2.value && obj1.type == obj2.type) {
                objs2.splice(j, 1);
            } else {
                ++j;
            }
        }
    }
},

 listGroupTypes:function() {
    var types = [
        this.ERROR_TYPE,
        this.SINGLE,
        this.PAIR,
        this.DAN_SHUN,
        this.SHUANG_SHUN,
        this.SOFT_BOMB,
        this.HARD_BOMB,
        this.ROCKET,
        this.BB_BOMB,
    ];
    return types;
},
 listGroupTypeValues:function() {
    var typeValues = {0:0, 1:1, 2:1, 3:1, 4:1, 5:2, 6:3, 7:4, 8:5,};
    return typeValues;
},

 num2Objs:function(nums, laiziValue) {
    var pokerObjs = [];
    for (var i = 0; i < nums.length; ++i) {
        pokerObjs.push(this.num2Obj(nums[i], laiziValue));
    }
    return pokerObjs;
},
 num2Obj:function(num, laiziValue) {
    if(typeof(num) == "number"){
        var pokerObj = {};
        pokerObj.value = Math.floor((num - 1000) / 10);
        pokerObj.type = num % 10;
        pokerObj.isLz = pokerObj.value == laiziValue;
        pokerObj.isJoker = this.isJoker(num);
        if(pokerObj.isLz){
            pokerObj.sortValue =  pokerObj.value*10  +2000+7;
        }else{
            pokerObj.sortValue =  num ;
        }
        pokerObj.isAd = this.isAdPoker(num);
        return pokerObj;
    }else{
        return num;
    }


},

 obj2Nums:function(objs) {
    var nums = [];
    for (var i = 0; i < objs.length; ++i) {
        nums.push(this.obj2Num(objs[i]));
    }
    return nums;
},

 obj2Num:function(obj) {
    if(typeof(obj) == "number" ){
        return obj;
    }
    return 1000 + obj.value * 10 + obj.type;
},

/**王*/
 isJoker:function(value) {
    var pnum = null;
    if (typeof(value) == "number") {
        pnum = value;
    } else {
        pnum = this.obj2Num(value);
    }
    return pnum == this.SMALL_JOKER || pnum == this.BIG_JOKER;
},
 isAdPoker:function(_card) {
    return false;
},

/**单*/
 isSingle:function(pokers) {
    return pokers.length == 1;
},

/**对*/
 isPair:function(pokers) {
    if (pokers.length != 2) {
        return false;
    }
    var obj1 = this.num2Obj(pokers[0]);
    var obj2 = this.num2Obj(pokers[1]);
    if(obj1.value == obj2.value) {
        return true;
    }
    if((!obj1.isJoker || obj1.isLz || obj1.isAd) && obj2.isJoker) {
        return true;
    }
    if(obj1.isLz || obj1.isAd || obj2.isLz || obj2.isAd) {
        return true;
    }
    return false;
},

/**顺子*/
 isShunzi:function(pokers) {
     console.log("poiker == sun zi -- > " , pokers,this.VALUE_A);
    if (pokers.length < 3) {
        return false;
    }
    var objs = this.num2Objs(pokers);
    for (var i = 0; i < objs.length; ++i) {
        var v1 = objs[i].value;
        if (i + 1 < objs.length) {
            var v2 = objs[i + 1].value;
            if (v1 + 1 != v2 || v2 > this.VALUE_A) {
                console.log("========",v1,v2,this.VALUE_A);
                return false;
            }
        }
    }
    return true;
},

/**连对*/
 isLiandui:function(pokers) {
    if (pokers.length < 4 || pokers.length % 2 != 0) {
        return false;
    }
    var objs = this.num2Objs(pokers);
    for (var i = 0; i < objs.length - 1; ++i) {
        if(i % 2 == 0) {
            if(objs[i].value != objs[i + 1].value) {
                return false;
            }
        }
        else if (objs[i].value + 1 != objs[i + 1].value || objs[i + 1].value > this.VALUE_A) {
            return false;
        }
    }
    return true;
},

/**王炸*/
 isKingBomb:function(pokers) {
    if (pokers.length != 2) {
        return false;
    }
    return this.isJoker(pokers[0]) && this.isJoker(pokers[1]);
},

/**背背炸*/
 isBombBomb:function(pokers) {
    if (pokers.length != 5 && pokers.length != 6) {
        return false;
    }
    var objs = this.num2Objs(pokers);
    if (!this.isJoker(pokers[pokers.length - 1]) || !this.isJoker(pokers[pokers.length - 2])) {
        return false;
    }
    for (var i = 0; i < objs.length - 2; ++i) {
        if (objs[0].value != objs[i].value) {
            return false;
        }
    }
    return true;
},

/**软炸*/
 isSoftBomb:function(pokers) {
    if (pokers.length != 3) {
        return false;
    }
    var objs = this.num2Objs(pokers);
    return objs[0].value == objs[1].value && objs[0].value == objs[2].value;
},

/**硬炸*/
 isHardBomb:function(pokers) {
    if (pokers.length != 4) {
        return false;
    }
    var objs = this.num2Objs(pokers);
    return objs[0].value == objs[1].value && objs[0].value == objs[2].value && objs[0].value == objs[3].value;
},

 getGroupType:function(pokers) {
     this.sortPokers(pokers);
     console.log("fuck pokers == > " , pokers);
    if (this.isBombBomb(pokers)) {
        return this.BB_BOMB;
    }
    else if (this.isKingBomb(pokers)) {
        return this.ROCKET;
    }
    else if (this.isHardBomb(pokers)) {
        return this.HARD_BOMB;
    }
    else if (this.isSoftBomb(pokers)) {
        return this.SOFT_BOMB;
    }
    else if (this.isLiandui(pokers)) {
        return this.SHUANG_SHUN;
    }
    else if (this.isShunzi(pokers)) {
        return this.DAN_SHUN;
    }
    else if (this.isPair(pokers)) {
        return this.PAIR;
    }
    else if (this.isSingle(pokers)) {
        return this.SINGLE;
    }
    return this.ERROR_TYPE;
},

 getBiggerError:function(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type) {
    var returnResults = [];
    return returnResults;
},

 getBiggerSingles:function(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type) {
    var returnResults = [];
    var lastValue = lastObjs[0].value;
    for (var i = 0; i < objs.length; ++i) {
        var obj = objs[i];
        if ((lastValue != self.VALUE_2 && obj.value == lastValue + 1)
            || (lastValue < obj.value && obj.value == self.VALUE_2)
            || (lastValue == self.VALUE_2 && jokerVS2Type > 0 && self.obj2Num(obj) == self.SMALL_JOKER)
            || (lastValue == self.VALUE_2 && jokerVS2Type == 2 && self.obj2Num(obj) == self.BIG_JOKER)) {
            returnResults.push([
                self.obj2Num(obj)
            ]);
        }
    }
    return returnResults;
},

 getBiggerPairs:function(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type) {
    var returnResults = [];
    if (objs.length < 2) {
        return returnResults;
    }
    var lastValue = lastObjs[0].value;
    if(lastValue == self.VALUE_2) {
        return returnResults;
    }
    var usedLaiziCnt = 0;
    var isMatch = false, isMatch2 = false;
    for(var i = 0 ; i < objs.length ; ++i) {
        if(!isMatch && objs[i].value == lastValue + 1) {
            isMatch = true;
            if(i + 1 < objs.length && objs[i].value == objs[i + 1].value) {
                returnResults.push([
                    self.obj2Num(objs[i]),
                    self.obj2Num(objs[i + 1])
                ]);
            } else if(laiziObjs.length - usedLaiziCnt > 0) {
                if(objs[i].isLz && laiziObjs.length - usedLaiziCnt - 1 > 0) {
                    returnResults.push([
                        self.obj2Num(laiziObjs[0]),
                        self.obj2Num(laiziObjs[1])
                    ]);
                } else if(!objs[i].isLz) {
                    returnResults.push([
                        self.obj2Num(objs[i]),
                        self.obj2Num(laiziObjs[0])
                    ]);
                }
            }
        }
        else if(!isMatch2 && objs[i].value == self.VALUE_2) {
            isMatch2 = true;
            if(i + 1 < objs.length && objs[i].value == objs[i + 1].value) {
                returnResults.push([
                    self.obj2Num(objs[i]),
                    self.obj2Num(objs[i + 1]),
                ]);
            } else if(laiziObjs.length - usedLaiziCnt > 0) {
                if(objs[i].isLz && laiziObjs.length - usedLaiziCnt - 1 > 0) {
                    returnResults.push([
                        self.obj2Num(laiziObjs[0]),
                        self.obj2Num(laiziObjs[1]),
                    ]);
                } else if(!objs[i].isLz) {
                    returnResults.push([
                        self.obj2Num(objs[i]),
                        self.obj2Num(laiziObjs[0])
                    ]);
                }
            }
        }
    }
    return returnResults;
},

 getBiggerShunzi:function(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type) {
    var returnResults = [];
    if(objs.length < lastObjs.length) {
        return returnResults;
    }
    if(lastObjs[lastObjs.length - 1].value == self.VALUE_A) {
        return returnResults;
    }
    var tmp = [];
    var len = lastObjs.length;
    var usedLaiziCnt = 0;
    var matchOne = false;
    var normalObjs = [];
    for(var i = 0 ; i < objs.length ; ++i) {
        var obj = objs[i];
        if(!obj.isLz && ! obj.isJoker) {
            normalObjs.push(obj);
        }
    }
    for(var i = 0 ; i < lastObjs.length ; ++i) {
        matchOne = false;
        var obj = lastObjs[i];
        for(var j = 0 ; j < normalObjs.length ; ++j) {
            var normalObj = normalObjs[j];
            if(normalObj.value == obj.value + 1) {
                tmp.push(self.obj2Num(normalObj));
                normalObjs.splice(j, 1);
                matchOne = true;
                break;
            }
        }
        if(!matchOne) {
            if(laiziObjs.length - usedLaiziCnt > 0) {
                usedLaiziCnt++;
                matchOne = true;
            } else {
                break;
            }
        }
        if(matchOne && tmp.length + usedLaiziCnt == len) {
            for(var j = 0 ; j < usedLaiziCnt ; ++j) {
                tmp.push(self.obj2Num(laiziObjs[j]));
            }
            returnResults.push(tmp);
            break;
        }
    }
    return returnResults;
},

 getBiggerLiandui:function(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type) {
    return self.getBiggerShunzi(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type);
},

 getBiggerSoftBomb:function(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type) {
    return self.getBiggerBombByCount(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type, 3);
},
 getBiggerHardBomb:function(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type) {
    return self.getBiggerBombByCount(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type, 4);
},

 getTypeByBombCount:function(bombCnt) {
    switch(bombCnt) {
        case 3: return this.SOFT_BOMB;
        case 4: return this.HARD_BOMB;
    }
    return -1;
},

 getBiggerBombByCount:function(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type, bombCnt) {


    console.log("getBiggerBombByCount",objs,lastObjs,lastType,laiziObjs,bombCnt);

    var returnResults = [];
    if(objs.length < bombCnt) {
        return returnResults;
    }
    var lastValue = 0;
    if(lastType == self.getTypeByBombCount(bombCnt)) {
        lastValue = lastObjs[0].value;
        if(lastValue == this.VALUE_2) {
            return returnResults;
        }
    }
    var usedLaiziCnt = 0;
    var tmp = [];
    var checkObj = function(obj, t) {
        if(obj.isLz && laiziObjs.length - usedLaiziCnt > 0) {
            usedLaiziCnt = usedLaiziCnt+ 1;
        } else if(!obj.isLz) {
            t.push(self.obj2Num(obj));
        }
    }
    for(var i = 0 ; i < objs.length ; ++i) {
        usedLaiziCnt = 0;
        tmp = [];
        if(lastValue < objs[i].value && objs[i].value <= self.VALUE_2) {
            checkObj(objs[i], tmp);
            for(var j = 1 ; j < bombCnt; ++j) {
                if(i + j < objs.length && objs[i].value == objs[i + j].value) {
                    checkObj(objs[i + j], tmp);
                } else {
                    break;
                }
            }
            if(tmp.length + usedLaiziCnt == bombCnt) {
                for(var j = 0 ; j < usedLaiziCnt ; ++j) {
                    tmp.push(self.obj2Num(laiziObjs[j]));
                }
                returnResults.push(tmp);
                lastValue = objs[i].value;
            } else if(laiziObjs.length - (bombCnt - tmp.length) >= 0) {
                var len = bombCnt - tmp.length;
                for(var j = 0 ; j < len ; ++j) {
                    tmp.push(self.obj2Num(laiziObjs[j]));
                }
                returnResults.push(tmp);
                lastValue = objs[i].value;
            }
        }
    }
    return returnResults;
},

 getKingBomb:function(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type) {
    var returnResults = [];
    if(objs.length < 2) {
        return returnResults;
    }
    var poker1 = self.obj2Num(objs[objs.length - 2]);
    var poker2 = self.obj2Num(objs[objs.length - 1]);
    if(poker1 == self.SMALL_JOKER && poker2 == self.BIG_JOKER) {
        returnResults.push([
            poker1,
            poker2
        ]);
    }
    return returnResults;
},

 getBombBomb:function(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type) {

    console.log("get bb za ========");
    var returnResults = [];
    if(objs.length < 5) {
        return returnResults;
    }
    if(!objs[objs.length - 2].isJoker || !objs[objs.length - 1].isJoker) {
        return returnResults;
    }
    var tmpObjs = self.copyObjs(objs);
    var tmpLaiziObjs = self.copyObjs(laiziObjs)
    tmpObjs.splice(-2, 2);
    tmpLaiziObjs.splice(-2, 2);
    var softResults = self.getBiggerSoftBomb(self,tmpObjs, [], 0, tmpLaiziObjs);
    var hardResults = self.getBiggerHardBomb(self,tmpObjs, [], 0, tmpLaiziObjs);
    for(var i = 0 ; i < softResults.length ; ++i) {
        var tmp = softResults[i];
        self.appendObjs(tmp, [
            self.SMALL_JOKER,
            self.BIG_JOKER
        ]);
        returnResults.push(tmp);
    }
    for(var i = 0 ; i < hardResults.length ; ++i) {
        var tmp = hardResults[i];
        self.appendObjs(tmp, [
            self.SMALL_JOKER,
            self.BIG_JOKER
        ]);
        returnResults.push(tmp);
    }
    return returnResults;
},

 getBiggerHandlerByType:function(groupType) {
    switch(groupType) {
        case this.SINGLE:
            return this.getBiggerSingles;
        case this.PAIR:
            return this.getBiggerPairs;
        case this.DAN_SHUN:
            return this.getBiggerShunzi;
        case this.SHUANG_SHUN:
            return this.getBiggerLiandui;
        case this.SOFT_BOMB:
            return this.getBiggerSoftBomb;
        case this.HARD_BOMB:
            return this.getBiggerHardBomb;
        case this.ROCKET:
            return this.getKingBomb;
        case this.BB_BOMB:
            return this.getBombBomb;
    }
    return this.getBiggerError;
},

/**
 *
 * @param pokers
 * @param lastPokers
 * @param laiziValue
 * @param jokerVS2Type
 * @returns {{}}
 */
 getHints:function(pokers, lastPokers, laiziValue, jokerVS2Type) {
    var returnResults = {};
    returnResults.results = [];
    returnResults.types = [];

    var biggerTypes = [];
    this.sortPokers(pokers);
    this.sortPokers(lastPokers);

    var lastType = this.getGroupType(lastPokers);

    if(lastType == this.ROCKET || lastType == this.BB_BOMB) {
        return returnResults;
    }
    var objs = this.num2Objs(pokers, laiziValue);
    var lastObjs = this.num2Objs(lastPokers);
    var laiziObjs = [];
    for(var i = 0 ; i < objs.length ; ++i) {
        var obj = objs[i];
        if(obj.isLz || obj.isJoker || obj.isAd) {
            laiziObjs.push(obj);
        }
    }



    var typeValues = this.listGroupTypeValues();
    var lastTypeValue = typeValues[lastType];

    console.log("getHints -- > typeValues",lastType,typeValues,lastTypeValue)


    biggerTypes.push(lastType);
    for(var k in typeValues) {
        k = parseInt(k);
        var v = typeValues[k];
        if(v > lastTypeValue) {
            biggerTypes.push(k);
        }
    }

    console.log("bigtypes == > " , biggerTypes);

    for(var i = 0 ; i < biggerTypes.length ; ++i) {
        var groupType = biggerTypes[i];
        var handler = this.getBiggerHandlerByType(groupType);
        var self = this;
        var results = handler(self,objs, lastObjs, lastType, laiziObjs, jokerVS2Type);
        console.log("getBigger -- > ",groupType , results)

        if(results.length > 0) {
            this.appendObjs(returnResults.results, results);
            for(var j = 0 ; j < results.length ; ++j) {
                returnResults.types.push(groupType);
            }
        }
    }
    return returnResults;
},

//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------
/**空*/
 tryConvertNull:function(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type) {
    var returnResults = [];
    return returnResults;
},

/**单*/
 tryConvertSingle:function(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type) {
    var returnResults = [];
    if(objs.length != 1) {
        return returnResults;
    }
    if(lastObjs.length == 0 && (objs[0].isJoker || objs[0].isAd)) {
        return returnResults;
    }
    returnResults.push(self.obj2Num(objs[0]));
    return returnResults;
},

/**对*/
 tryConvertPair:function(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type) {
    var returnResults = [];
    if(objs.length != 2) {
        return returnResults;
    }
    if(normalObjs.length == 2 && normalObjs[0].value != normalObjs[1].value) {
        return returnResults;
    }
    if(normalObjs.length == 2) {
        returnResults = self.obj2Nums(objs);
    } else if(normalObjs.length == 1) {
        returnResults.push(self.obj2Num(normalObjs[0]));
        returnResults.push(1000 + normalObjs[0].value * 10 + self.LAIZI_TYPE);
    } else {
        returnResults.push(self.obj2Num(laiziObjs[0]));
        if(laiziObjs[1].isJoker) {
            returnResults.push(1000 + laiziObjs[0].value * 10 + self.LAIZI_TYPE);
        } else {
            returnResults.push(self.obj2Num(laiziObjs[1]));
        }
    }
    return returnResults;
},

/**顺子*/
 tryConvertShunzi:function(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type) {
    var returnResults = [];
    if(lastObjs.length == 0) {
        if(objs.length < 3) {
            return returnResults;
        }
        var startValue = normalObjs[0].value;
        if(startValue + objs.length - 1 > self.VALUE_A) {
            startValue = self.VALUE_A - objs.length + 1;
        }
        var createLastPokers = [];
        for(var i = 0 ; i < objs.length ; ++i) {
            createLastPokers.push(1000 + (startValue + i - 1) * 10 + 1);
        }
        var createLastObjs = self.num2Objs(createLastPokers);
        var results = self.getBiggerShunzi(self,objs, createLastObjs, 0, laiziObjs);
        if(results.length > 0) {
            return self.tryConvertShunzi(self,objs, normalObjs, laiziObjs, createLastObjs);
        } else {
            return returnResults;
        }
    } else {
        var normalObjsIndex = 0;
        for(var i = 0 ; i < objs.length ; ++i) {
            var curV = lastObjs[i].value;
            if(normalObjsIndex < normalObjs.length && normalObjs[normalObjsIndex].value == curV + 1) {
                returnResults.push(self.obj2Num(normalObjs[normalObjsIndex]));
                normalObjsIndex++;
            } else {
                returnResults.push(1000 + (curV + 1) * 10 + self.LAIZI_TYPE);
            }
        }
    }
    return returnResults;
},

/**连对*/
 tryConvertLiandui:function(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type) {
    var returnResults = [];
    if(lastObjs.length == 0) {
        if(objs.length < 4 || objs.length % 2 != 0) {
            return returnResults;
        }
        var startValue = normalObjs[0].value;
        if(startValue + objs.length / 2 - 1 > self.VALUE_A) {
            startValue = self.VALUE_A - objs.length / 2 + 1;
        }
        var createLastPokers = [];
        for(var i = 0 ; i < objs.length ; ++i) {
            createLastPokers.push(1000 + (startValue + Math.floor(i / 2) - 1) * 10 + 1);
        }
        var createLastObjs = self.num2Objs(createLastPokers);
        var results = self.getBiggerLiandui(self,objs, createLastObjs, 0, laiziObjs);
        if(results.length > 0) {
            return self.tryConvertLiandui(self,objs, normalObjs, laiziObjs, createLastObjs);
        } else {
            return returnResults;
        }
    } else {
        returnResults = self.tryConvertShunzi(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type);
    }
    return returnResults;
},

 tryConvertBombByCount:function(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type, bombCont) {
    var returnResults = [];
    if(objs.length < bombCont) {
        return returnResults;
    }
    if(lastObjs.length == 0) {
        if(objs.length != bombCont) {
            return returnResults;
        }
        for(var i = 1 ; i < normalObjs.length ; ++i) {
            if(normalObjs[i].value != normalObjs[0].value) {
                return returnResults;
            }
        }
    }
    if(normalObjs.length == 0) {
        for(var i = 0 ; i < objs.length ; ++i) {
            if(objs[i].isJoker) {
                returnResults.push(1000 + objs[0].value * 10 + self.LAIZI_TYPE);
            } else {
                returnResults.push(obj2Num(objs[i]));
            }
        }
    } else {
        returnResults = self.obj2Nums(normalObjs);
        for(var i = 0 ; i < laiziObjs.length ; ++i) {
            if(laiziObjs[i].isJoker || laiziObjs[i].value != normalObjs[0].value) {
                returnResults.push(1000 + normalObjs[0].value * 10 + self.LAIZI_TYPE);
            }
        }
    }
    return returnResults;
},

/**软炸*/
 tryConvertSoftBomb:function(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type) {
    return self.tryConvertBombByCount(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type, 3);
},

/**硬炸*/
 tryConvertHardBomb:function(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type) {
    return self.tryConvertBombByCount(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type, 4);
},

/**王炸*/
 tryConvertKingBomb:function(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type) {
    var returnResults = [];
    if(objs.length == 2) {
        var nums = self.obj2Nums(objs);
        if(self.isKingBomb(nums)) {
            returnResults = nums;
        }
    }
    return returnResults;
},

/**背背炸*/
 tryConvertBombBomb:function(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Typm) {
    var returnResults = [];
    if(objs.length != 5 && objs.length != 6) {
        return returnResults;
    }
    if(!objs[objs.length - 1].isJoker || !objs[objs.length - 2].isJoker) {
        return returnResults;
    }
    var tmp = [];
    var tmpObjs = self.copyObjs(objs);
    var tmpLaiziObjs = self.copyObjs(laiziObjs);
    self.appendObjs(tmp, [
        self.obj2Num(objs[objs.length - 2]),
        self.obj2Num(objs[objs.length - 1])
    ]);
    tmpObjs.splice(-2, 2);
    tmpLaiziObjs.splice(-2, 2);

    var results = self.tryConvertSoftBomb(self,tmpObjs, normalObjs, tmpLaiziObjs, [], jokerVS2Typm);
    self.appendObjs(tmp, results);
    if(tmp.length == objs.length) {
        returnResults = tmp;
    }
    return returnResults;
},

 getConvertHandler:function(groupType) {
    switch (groupType) {
        case this.BB_BOMB:
            return this.tryConvertBombBomb;
        case this.ROCKET:
            return this.tryConvertKingBomb;
        case this.HARD_BOMB:
            return this.tryConvertHardBomb;
        case this.SOFT_BOMB:
            return this.tryConvertSoftBomb;
        case this.SHUANG_SHUN:
            return this.tryConvertLiandui;
        case this.DAN_SHUN:
            return this.tryConvertShunzi;
        case this.PAIR:
            return this.tryConvertPair;
        case this.SINGLE:
            return this.tryConvertSingle;
    }
    return this.tryConvertNull;
},

/**
 *
 * @param pokers
 * @param lastPokers
 * @param laiziValue
 * @param jokerVS2Type
 * @returns {Array}
 */
 tryOutCard:function(_pokers, _lastPokers, laiziValue, jokerVS2Type) {
    var returnResults = [];
    var pokers = this.copyObjs(_pokers);
    this.sortPokers(pokers);
    var lastPokers = this.copyObjs(_lastPokers);
    this.sortPokers(lastPokers);

    if(lastPokers.length == 0) {
        var objs = this.num2Objs(pokers, laiziValue);
        var laiziObjs = [], normalObjs = [];
        for(var i = 0 ; i < objs.length ; ++i) {
            var obj = objs[i];
            if(obj.isLz || obj.isJoker || obj.isAd) {
                laiziObjs.push(obj);
            } else {
                normalObjs.push(obj);
            }
        }
        var groupTypes = this.listGroupTypes();

        console.log("group ===> type " , groupTypes);

        for(var i = groupTypes.length - 1 ; i >= 0 ; --i) {
            var handler = this.getConvertHandler(groupTypes[i]);
            var self = this;
            var results = handler(self,objs, normalObjs, laiziObjs, [], jokerVS2Type);
            if(results.length != 0) {
                returnResults = results;
                break;
            }
        }
    } else {
        var resultObj = this.getHints(pokers, lastPokers, laiziValue, jokerVS2Type);
        console.log("resultObj type " , resultObj);
        var convertType = null;
        for(var i = resultObj.results.length - 1 ; i >= 0 ; --i) {
            var results = resultObj.results[i];
            if(results.length == pokers.length) {
                convertType = resultObj.types[i];
                break;
            }
        }
        console.log("resultObj type =====  " , convertType);
        if(convertType != null) {
            var objs = this.num2Objs(pokers, laiziValue);
            var laiziObjs = [], normalObjs = [];
            for(var i = 0 ; i < objs.length ; ++i) {
                var obj = objs[i];
                if(obj.isLz || obj.isJoker || obj.isAd) {
                    laiziObjs.push(obj);
                } else {
                    normalObjs.push(obj);
                }
            }
            if(laiziObjs.length == 0) {
                returnResults = pokers;
            } else {
                var lastObjs = this.num2Objs(lastPokers);
                var handler = this.getConvertHandler(convertType);
                var self = this;
                returnResults = handler(self,objs, normalObjs, laiziObjs, lastObjs, jokerVS2Type);
            }
        }
    }
    return returnResults;
},
});
