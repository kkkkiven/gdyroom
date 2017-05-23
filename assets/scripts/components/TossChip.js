/**
 * Created by Joker on 17/2/27.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation
    },

    // use this for initialization
    play: function () {
        this.anim.play('my');
    },
});
