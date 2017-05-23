if(window.io == null){
    window.io = require("socket-io");
}
 
var Global = cc.Class({
    extends: cc.Component,
    statics: {
        ip:"",
        sio:null,
        isPinging:false,
        pingTime:100,
        fnDisconnect:null,
        timeOutPool:[],
        pingFirstTime:0,
        handlers:{},
        addHandler:function(event,fn){
            if(this.handlers[event]){
                if(cc.vv.dataMgr.DEBUG) console.log("event:" + event + "' handler has been registered.");
                return;
            }
            var handler = function(data){
                //console.log(event + "(" + typeof(data) + "):" + (data? data.toString():"null"));
                if(event != "disconnect" && typeof(data) == "string"){
                    data = JSON.parse(data);
                }
                fn(data);
            };
            
            this.handlers[event] = handler; 
            if(this.sio){
                if(cc.vv.dataMgr.DEBUG) console.log("register:function " + event);
                this.sio.on(event,handler);
            }
        },
        connect:function(fnConnect,fnError) {
            var self = this;
            var opts = {
                'reconnection':false,
                'force new connection': true,
                'transports':['websocket', 'polling']
            }
            this.sio = window.io.connect(this.ip,opts);
            this.sio.on('reconnect',function(){
                self.timeOutPool=[];
                if(cc.vv.dataMgr.DEBUG) console.log('reconnection');
            });
            this.sio.on('connect',function(data){
                self.sio.connected = true;
                fnConnect(data);
            });
            this.sio.on('connect_error',function(){
                if(cc.vv.dataMgr.DEBUG) console.log('connect_failed=================================error');
                self.sio = null;
            });

            this.sio.on('disconnect',function(data){
                if(cc.vv.dataMgr.DEBUG) console.log("disconnect");
                self.sio.connected = false;
                self.close();
            });
            
            this.sio.on('connect_failed',function (){
                if(cc.vv.dataMgr.DEBUG) console.log('connect_failed');
            });
            
            for(var key in this.handlers){
                var value = this.handlers[key];
                if(typeof(value) == "function"){
                    if(key == 'disconnect'){
                        this.fnDisconnect = value;
                    }
                    else{
                        if(cc.vv.dataMgr.DEBUG) console.log("register:function " + key);
                        this.sio.on(key,value);                        
                    }
                }
            }
            this.startHearbeat();
        },
        
        startHearbeat:function(){
            var self = this;
            this.sio.on('game_pong',function(){
                // var tempData = JSON.parse(data);
                self.timeOutPool.pop();
                self.pingTime =Date.now()- self.pingFirstTime;
                if (cc.vv.dataMgr.DEBUG) console.log('game_pong',self.pingTime,self.timeOutPool.length);
                self.lastRecieveTime = Date.now();
            });
            this.lastRecieveTime = Date.now();
            if(cc.vv.dataMgr.DEBUG) console.log(1);
            if(!self.isPinging){
                // console.log(1);
                self.isPinging = true;
                setInterval(function(){
                    // console.log(3);
                    if(self.sio){
                        // console.log(4);
                        if(Date.now() - self.lastRecieveTime > 20000 ){
                            self.close();
                        }
                        else{
                            if(cc.vv.dataMgr)
                            {
                                self.ping();
                            }
                        }
                    }
                },10000);
            }   
        },
        send:function(event,data){
            if(this.sio.connected){
                if(data != null && (typeof(data) == "object")){
                    data = JSON.stringify(data);
                    if(cc.vv.dataMgr.DEBUG) console.log("send data ",data);
                }
                this.sio.emit(event,data);                
            }
        },
        
        ping:function(){
            var time = Date.now();
            this.pingFirstTime = time;
            this.timeOutPool.unshift(time);
            this.send('game_ping');
        },
        
        close:function(){
            if(cc.vv.dataMgr.DEBUG) console.log('close');
            this.timeOutPool=[];
            if(this.sio && this.sio.connected){
                this.sio.connected = false;
                this.sio.disconnect();
                this.sio = null;
            }
            if(this.fnDisconnect){
                this.fnDisconnect();
                this.fnDisconnect = null;
            }
        },
        
        test:function(fnResult){
            var xhr = null;
            var fn = function(ret){
                fnResult(ret.isonline);
                xhr = null;
            }
            
            var arr = this.ip.split(':');
            var data = {
                account:cc.vv.userMgr.account,
                sign:cc.vv.userMgr.sign,
                ip:arr[0],
                port:arr[1],
            }
            xhr = cc.vv.http.sendRequest("/is_server_online",data,fn);
            setTimeout(function(){
                if(xhr){
                    xhr.abort();
                    fnResult(false);                    
                }
            },1500);
            /*
            var opts = {
                'reconnection':false,
                'force new connection': true,
                'transports':['websocket', 'polling']
            }
            var self = this;
            this.testsio = window.io.connect(this.ip,opts);
            this.testsio.on('connect',function(){
                console.log('connect');
                self.testsio.close();
                self.testsio = null;
                fnResult(true);
            });
            this.testsio.on('connect_error',function(){
                console.log('connect_failed');
                self.testsio = null;
                fnResult(false);
            });
            */
        }
    },
});