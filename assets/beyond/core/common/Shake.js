cc.Shake = cc.Class({
    name: "cc.Shake",
    extends: cc.ActionInterval,
    ctor: function (t, i, n) {
        this._initial_x = 0, this._initial_y = 0, this._strength_x = i;
        this._strength_y = n;
        this.initWithDuration(t);
    },
    initWithDuration(t) {
        cc.ActionInterval.prototype.initWithDuration.call(this, t);
        return !0;
    },
    startWithTarget(t) {
        cc.ActionInterval.prototype.startWithTarget.call(this, t);
        this._initial_x = t.x;
        this._initial_y = t.y;
    },
    update() {
        let t = be.Random.nextInt(-this._strength_x, this._strength_x), i = be.Random.nextInt(-this._strength_y, this._strength_y);
        this.getTarget().setPosition(t + this._initial_x, i + this._initial_y);
    },
    stop() {
        this.getTarget().setPosition(new cc.Vec2(this._initial_x, this._initial_y));
        cc.ActionInterval.prototype.stop.call(this);
    }
});

cc.shake = function (t, i, n) {
    return new cc.Shake(t, i, n);
};