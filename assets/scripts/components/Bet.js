/**
 * Created by Joker on 17/2/27.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        // chipPrefab: {
        //     default: null,
        //     type: cc.Prefab
        // },
        // chipValues: {
        //     default: [],
        //     type: 'Integer'
        // },
        anchorChipToss: cc.Node
    },

    // use this for initialization
    init: function () {
        // this._registerBtns();
    },

    // _registerBtns: function () {
    //     var self = this;
    //     var registerBtn = function (index) {
    //         self.btnChips[i].on('touchstart', function (event) {
    //             if (Game.instance.addStake(self.chipValues[index])) {
    //                 self.playAddChip();
    //             }
    //         }, this);
    //     };
    //     for (var i = 0; i < self.btnChips.length; ++i) {
    //         registerBtn(i);
    //     }
    // },

    playAddChip: function (betCount,index) {

        var startPos = cc.p(cc.randomMinus1To1() * 50, cc.randomMinus1To1() * 50);

        if(cc.vv.dataMgr.DEBUG) console.log("sho bet count --- > " , betCount,index);

        // var chip = cc.instantiate(this.chipPrefab);
        // this.anchorChipToss.addChild(node);
        // chip.setPosition(startPos);
        // chip.getComponent('TossChip').play();
    },

    resetTossedChips: function () {
        this.anchorChipToss.removeAllChildren();
    },
});
