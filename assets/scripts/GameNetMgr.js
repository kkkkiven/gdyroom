cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler:null,
        dissoveData:null,
    },

    dispatchEvent:function(event,data){
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        }    
    },

    getWanfa:function(){
        var conf = cc.vv.dataMgr.getGameConfig();

        console.log("fuck wanfa === > " , conf);


        if(conf && conf.maxGames!=null){
            var strArr = [];
            strArr.push(conf.maxGames + "局");
            if(conf.bupai == 0 ){
                strArr.push("全补");
            }else{
                strArr.push("末补");
            }
            if(conf.laizi == 1){
                strArr.push("癞子");
            }

            strArr.push("最大"+conf.maxfan+"番");

            if(conf.roundfan == 1){
                strArr.push("固定轮数翻倍");
            }
            if(conf.leftone == 1){
                strArr.push("剩一张不算分");
            }
            if(conf.kingvs2 == 1){
                strArr.push("王能打2");
            }
            if(conf.leftking == 1){
                strArr.push("王是最后一手可出");
            }
            strArr.push(conf.baseScore+"分起");
            return strArr.join(" ");
        }
        return "";
    },
    
    initHandlers:function(){
        var self = this;
        cc.vv.net.addHandler("login_result",function(data){
            if(cc.vv.dataMgr.DEBUG) console.log("login_result==================",data);
            if(data.errcode === 0){
                var data = data.data;
                cc.vv.dataMgr.setGameConfig(data.conf);
                cc.vv.dataMgr.maxNumOfGames = data.conf.maxGames;
                cc.vv.dataMgr.setKingVsTwo(data.conf.kingvs2 );
                cc.vv.dataMgr.numOfGames = data.numofgames || 1 ;
                cc.vv.dataMgr.seats = data.seats;
                if(data.seats){
                    for(var i = 0; i < data.seats.length; ++i){
                        data.seats[i].holds = [];
                    }
                }
                cc.vv.dataMgr.creatorId = data.conf.creator;
                var index = cc.vv.dataMgr.getSeatIndexByID(cc.vv.userMgr.userId);
                cc.vv.dataMgr.setSeatIndex(index)
                var localIdx = cc.vv.dataMgr.getLocalIndex(cc.vv.dataMgr.getSeatIndex()) ;
                cc.vv.dataMgr.setLocalIndex(localIdx)
                cc.vv.dataMgr.setRoomId(data.roomid);
                cc.vv.dataMgr.setNumOfGame(data.numofgames);
                cc.vv.dataMgr.setGameSeats(data.seats);
                cc.vv.dataMgr.isOver = false;
            }
            else{
                if(cc.vv.dataMgr.DEBUG) console.log(data.errmsg);
            }
        });
                
        cc.vv.net.addHandler("login_finished",function(data){
            cc.director.loadScene("mjgame");
        });

        cc.vv.net.addHandler("game_error_card",function(data){

            console.log("game_error_card==========。》 " , data);
            self.dispatchEvent('error_card',data);

        });


        cc.vv.net.addHandler("exit_result",function(data){
            cc.vv.dataMgr.roomId = null;
            cc.vv.dataMgr.turn = -1;
            if(cc.vv.dataMgr.seats){
                cc.vv.dataMgr.seats = null;
            }

        });
        
        cc.vv.net.addHandler("exit_notify_push",function(data){

            if(cc.vv.dataMgr.DEBUG) console.log("exit============ llk");
           var userId = data;
           var s = cc.vv.dataMgr.getSeatByID(userId);
           if(s != null){
               s.userid = 0;
               s.name = "";
               self.dispatchEvent("user_state_changed",s);
           }
        });
        cc.vv.net.addHandler("disconnect",function(data){
            if(cc.vv.dataMgr.getRoomId() == null){
                if(cc.vv.dataMgr.isGameEnd){
                    if(cc.vv.dataMgr.DEBUG) console.log("room id disconnect");
                }else{
                    cc.director.loadScene("hall");
                }
            }
            else{
                if(cc.vv.dataMgr.isOver == false){
                    cc.vv.userMgr.oldRoomId = cc.vv.dataMgr.getRoomId();
                    self.dispatchEvent("disconnect");                    
                }
                else{
                    cc.vv.dataMgr.setRoomId(null);
                }
            }
            cc.vv.dataMgr.reset();

        });
        
        cc.vv.net.addHandler("new_user_comes_push",function(data){
            // console.log("new_user_comes_push==============",data);
            var seatIndex = data.seatindex;
            if(cc.vv.dataMgr.seats[seatIndex].userid > 0){
                cc.vv.dataMgr.seats[seatIndex].online = true;

            }
            else{
                data.online = true;
                cc.vv.dataMgr.seats[seatIndex] = data ;
            }
            self.dispatchEvent('new_user',cc.vv.dataMgr.seats[seatIndex]);
        });

        cc.vv.net.addHandler("user_state_push",function(data){
            if(cc.vv.dataMgr.DEBUG) console.log("user_state_push=========>" ,data);
            var userId = data.userid;
            var seat = cc.vv.dataMgr.getSeatByID(userId);
            seat.online = data.online;
            // cc.vv.dataMgr.online = data.online;
            self.dispatchEvent('user_state_changed',seat);
        });


        cc.vv.net.addHandler("user_ready_push",function(data){
            if(cc.vv.dataMgr.DEBUG) console.log("user ready === > push " , data );
            var userId = data.userid;
            var seat = cc.vv.dataMgr.getSeatByID(userId);
            seat.ready = data.ready;
            self.dispatchEvent('user_state_changed',seat);
            self.dispatchEvent('user_ready_changed',seat);

        });


        cc.vv.net.addHandler("ready_status_push",function(data){
            if(cc.vv.dataMgr.DEBUG) console.log("ready_status_push======>>>",data);
            self.dispatchEvent('ready_status',data);
        });

        cc.vv.net.addHandler("cant_start_push",function(data){
            console.log("cant_start_push======>>>",data);
            // 1  不是房主
            // 2 其他玩家未准备
            // 3 其他玩家不在线
            // 4 邀请好友之后再进行游戏
            self.dispatchEvent('cant_start_',data);
        });



        cc.vv.net.addHandler("game_holds_push",function(data){
            console.log("game_hold_push====kk========",data);
            cc.vv.dataMgr.numOfPai ++ ;
            for(var i = 0 ; i < data.others.length ; ++i) {
                var v = data.others[i];
                if(v.uid == cc.vv.userMgr.userId){
                    for(var j = 0 ; j < data.holds.length ; ++j){
                        // var hold = cc.vv.poker.num2Obj(data.holds[j],cc.vv.dataMgr.getLzNum());
                        cc.vv.dataMgr.addSeatHoldsById(v.uid,data.holds[j]);
                    }
                    cc.vv.dataMgr.setSeatHoldLen(v.uid,data.holds.length);
                }else{
                    for(var x = 0 ; x < v.len ; ++x){
                        // var hold = cc.vv.poker.num2Obj(1000,cc.vv.dataMgr.getLzNum());
                        cc.vv.dataMgr.addSeatHoldsById(v.uid,1000);
                    }
                    cc.vv.dataMgr.setSeatHoldLen(v.uid,v.len);
                }
            }

        });

        cc.vv.net.addHandler("game_sync_push",function(data){
            var temp = {};
            temp = data;
            if(cc.vv.dataMgr.DEBUG) console.log("game_sync_push====================" , temp);
            cc.vv.dataMgr.gamestate = data.state;
            cc.vv.dataMgr.setGameSync(true);
            cc.vv.dataMgr.clearSeatsHolds();
            cc.vv.dataMgr.setGameSyncData(data.state);
            cc.vv.dataMgr.setGameZhuang(data.button);
            cc.vv.dataMgr.setGameSyncData(data);
            cc.vv.dataMgr.setPaiCount(data.pai);
            cc.vv.dataMgr.setLunCount(data.round);
            cc.vv.dataMgr.setLzNum(data.lz);
            cc.vv.dataMgr.setFanCount(data.fan);
            for(var uid in data.seats){
                var v = data.seats[uid];
                var index = cc.vv.dataMgr.getSeatIndexByID(uid);
                cc.vv.dataMgr.seats[index].gong = v.d ==1;
                cc.vv.dataMgr.seats[index].giveUp = v.giveup == 1 ;
                if(v.holds){
                    var hold = cc.vv.poker.num2Objs(v.holds,cc.vv.dataMgr.getLzNum());
                    cc.vv.dataMgr.seats[index].holds = hold;
                    if(v.holds.length > 0 ){
                        cc.vv.dataMgr.numOfPai = v.holds.length;
                    }
                    cc.vv.dataMgr.setSeatHoldLen(uid,v.holds.length);

                }else if(v.len){
                    var tmphold = [];
                    for(var i=0 ; i <v.len ; ++i){
                        tmphold.push(1000);
                    }
                    v.holds = tmphold;
                    cc.vv.dataMgr.setSeatHoldLen(uid,v.len);
                }

                var index = cc.vv.dataMgr.getSeatIndexByID(uid);
            }
        });

        cc.vv.net.addHandler("game_begin_push",function(data){
            if(cc.vv.dataMgr.DEBUG) console.log("game_begin_push======>>>",data);
            cc.vv.dataMgr.gamestate = "begin";
            self.dispatchEvent('game_begin');
        });
        
        cc.vv.net.addHandler("game_playing_push",function(data){
            if(cc.vv.dataMgr.DEBUG) console.log("game_playing_push======>>>",data);
            cc.vv.dataMgr.gamestate = "playing";
            self.dispatchEvent('game_playing');
        });

        cc.vv.net.addHandler("dispress_push",function(data){
            cc.vv.dataMgr.setRoomId(null);
            cc.vv.dataMgr.turn = -1;
            self.seats = null;
        });

        cc.vv.net.addHandler("game_init_push",function(data){
            if(cc.vv.dataMgr.DEBUG) console.log('game_init_push==========kkko==========',data);
            cc.vv.dataMgr.initData = data;
            cc.vv.dataMgr.setLunCount(data.round);
            cc.vv.dataMgr.numOfGames = data.nums;
            cc.vv.dataMgr.setPaiCount(data.pai);
            cc.vv.dataMgr.setLzNum(data.lz);
            cc.vv.dataMgr.setFanCount(data.fan);
        });

        cc.vv.net.addHandler("game_option_push",function(data){ //所有的操作返回   放动画
            if(cc.vv.dataMgr.DEBUG) console.log("game_option_push======>>>",data);
            var c_data = {};
            c_data.userId = data.a;
            c_data.money = data.b;
            c_data.op = data.c;
            c_data.auto = data.auto;
            self.dispatchEvent('game_option',c_data);
        });

        cc.vv.net.addHandler("new_option_push",function(data){  //当前自己的操作
            if(cc.vv.dataMgr.DEBUG) console.log("new_option_push======>>>",data);
            cc.vv.dataMgr.curaction = data;
            cc.vv.dataMgr.setTurnOps(data);
            self.dispatchEvent('new_option',data);
        });

        cc.vv.net.addHandler("game_turn_push",function(data){  //轮到谁操作
            if(cc.vv.dataMgr.DEBUG) console.log("game_turn_push======>>>",data);
            cc.vv.dataMgr.turnOpt = data;
            self.dispatchEvent('game_turn',data);
        });

        cc.vv.net.addHandler("game_chupai_push",function(data){  //出牌
            if(cc.vv.dataMgr.DEBUG) console.log("game_chupai_push======>>>",data);
            cc.vv.dataMgr.setGameFan(data.fan);
            self.dispatchEvent('game_chupai',data);
        });

        cc.vv.net.addHandler("game_self_card",function(data){  //自己的牌
            if(cc.vv.dataMgr.DEBUG) console.log("game_self_card======>>>",data);
            cc.vv.dataMgr.selfCard = data;
            self.dispatchEvent('self_card',data);
        });

        cc.vv.net.addHandler("game_new_round",function(data){  //过牌
            if(cc.vv.dataMgr.DEBUG) console.log("game_new_round======>>>",data);
            cc.vv.dataMgr.setLunCount(data.round);
            cc.vv.dataMgr.setPaiCount(data.pai);
            cc.vv.dataMgr.setFanCount(data.fan);
            self.dispatchEvent('new_round',data);
        });


        cc.vv.net.addHandler("game_pass_push",function(data){  //过牌
            if(cc.vv.dataMgr.DEBUG) console.log("game_pass_push======>>>",data);
            self.dispatchEvent('game_pass',data);
        });

        cc.vv.net.addHandler("game_num_push",function(data){
            if(cc.vv.dataMgr.DEBUG) console.log("game_num_push======>>>",data);
            cc.vv.dataMgr.numOfGames = data;
            self.dispatchEvent('game_num',data);
        });

        cc.vv.net.addHandler("holds_add_push",function(data){
            if(cc.vv.dataMgr.DEBUG) console.log("holds_add_push======>>>",data);
            var other = data.others;
            cc.vv.dataMgr.numOfPai ++ ;

            for(var i = 0 ; i < other.length ; ++i) {
                var v = other[i];
                if(v.uid == cc.vv.userMgr.userId && data.id != 0 ){
                    var hold = cc.vv.poker.num2Obj(data.id,cc.vv.dataMgr.getLzNum());
                    cc.vv.dataMgr.addSeatHoldsById(v.uid,hold);
                }else{
                    // var holdLen = cc.vv.dataMgr.getSeatHoldLen(v.uid);
                    // console.log("holdLen==========" ,holdLen,v.len );
                    // if(holdLen < v.len){
                    //     cc.vv.dataMgr.addSeatHoldsById(v.uid,1000);
                    //     cc.vv.dataMgr.setSeatHoldLen(v.uid,v.len);
                    // }

                }
            }
            self.dispatchEvent('holds_add',data);
        });

        cc.vv.net.addHandler("game_over_push",function(data){
            if(cc.vv.dataMgr.DEBUG) console.log('game_over_push===============kkko===================',data);
            cc.vv.dataMgr.curaction = null;
            cc.vv.dataMgr.turnOpt = -1 ;
            for(var i = 0 ; i < cc.vv.dataMgr.seats.length ; ++i){
                cc.vv.dataMgr.seats[i].holds = [];
            }
            cc.vv.dataMgr.setGameOverData(data);
            self.dispatchEvent('game_over_one',data);
            if(data.endinfo){
                cc.vv.dataMgr.isOver = true;
                cc.vv.dataMgr.setRoomId(null);
                cc.vv.dataMgr.isGameEnd = true;
                var fn = function () {
                    self.dispatchEvent('game_end',data.results);
                }
                setTimeout(fn , 2000);
            }else{
                var fn1 = function () {
                    self.dispatchEvent('game_over',data);
                }
                setTimeout(fn1 , 1000);
            }
            cc.vv.dataMgr.reset();

        });
        cc.vv.net.addHandler("chat_push",function(data){
            self.dispatchEvent("chat_push",data);
        });


        cc.vv.net.addHandler("quick_chat_push",function(data){
            self.dispatchEvent("quick_chat_push",data);
        });
        
        cc.vv.net.addHandler("emoji_push",function(data){
            self.dispatchEvent("emoji_push",data);
        });
        
        cc.vv.net.addHandler("dissolve_notice_push",function(data){
            self.dissoveData = data;
            cc.vv.dataMgr.dissoveData = data;
            self.dispatchEvent("dissolve_notice",data);
        });
        
        cc.vv.net.addHandler("dissolve_cancel_push",function(data){
            self.dissoveData = null;
            cc.vv.dataMgr.dissoveData = null;
            self.dispatchEvent("dissolve_cancel",data);
        });
        
        cc.vv.net.addHandler("voice_msg_push",function(data){
            self.dispatchEvent("voice_msg",data);
        });
    },


    connectGameServer:function(data){
        this.dissoveData = null;
        cc.vv.dataMgr.dissoveData = null;
        cc.vv.net.ip = data.ip + ":" + data.port;
        if(cc.vv.dataMgr.DEBUG) console.log(cc.vv.net.ip);
        var self = this;
        var onConnectOK = function(){
            if(cc.vv.dataMgr.DEBUG) console.log("onConnectOK");
            var sd = {
                token:data.token,
                roomid:data.roomid,
                time:data.time,
                sign:data.sign,
            };
            cc.vv.net.send("login",sd);
        };
        
        var onConnectFailed = function(){
            if(cc.vv.dataMgr.DEBUG) console.log("failed.");
            cc.vv.wc.hide();
        };
        cc.vv.wc.show("正在进入房间");
        cc.vv.net.connect(onConnectOK,onConnectFailed);
    }


    // },
});
