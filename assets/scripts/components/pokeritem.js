cc.Class({
    extends: cc.Component,

    properties: {
        pokernode:{
            default:null,
            type:cc.Node
        },

    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }

    },


    onTouchPoker:function () {

        var touchFlag = 1;
        var self = this;
        var seats = cc.vv.dataMgr.seats;
        var index = cc.vv.dataMgr.getSeatIndexByID(cc.vv.userMgr.userId);
        var seatData = seats[index];
        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞掉事件，不再向下传递。
            onTouchBegan: function (touch, event) {     //实现 onTouchBegan 事件处理回调函数
                var target = event.getCurrentTarget();  // 获取事件所绑定的 target, 通常是cc.Node及其子类
                // 获取当前触摸点相对于按钮所在的坐标
                console.log("fuck to1111111 onTouchBegan on ==== > ")
                var locationInNode = this.pokernode.convertToNodeSpace(touch.getLocation());
                var s = this.pokernode.getContentSize();
                var rect = cc.rect(0, 0, s.width-20, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {       // 判断触摸点是否在按钮范围内
                    if(this.pokernode.y == 0 ){
                        this.pokernode.y = 15;
                        self.chupaiArr.push(seatData.holds[0]);
                    }else{
                        this.pokernode.y = 0;
                        self.selectDelete(seatData.holds[0]);
                    }
                }

                return true;
            },
            onTouchMoved: function (touch, event) {         //实现onTouchMoved事件处理回调函数, 触摸移动时触发
                // 移动当前按钮精灵的坐标位置
                var locationInNode = this.pokernode.convertToNodeSpace(touch.getLocation());
                console.log("fuck to1111111 onTouchMoved on ==== > ")
                var s = this.pokernode.getContentSize();
                var rect = cc.rect(0, 0, s.width-20, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {       // 判断触摸点是否在按钮范围内
                    if(touchFlag % 2 == 1 ){
                        if(this.pokernode.y == 0){
                            this.pokernode.y = 15;
                            self.chupaiArr.push(seatData.holds[0]);
                        }
                    }else{
                        this.pokernode.y = 0;
                        self.selectDelete(seatData.holds[0]);
                    }
                }

            },
            onTouchEnded: function (touch, event) {         // 实现onTouchEnded事件处理回调函数
                touchFlag = touchFlag + 1 ;
            }
        });
        cc.eventManager.addListener(listener1, this.pokernode);


    },
});
