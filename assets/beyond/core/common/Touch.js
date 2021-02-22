be.Touch = {
    checkMoved: function (t) {
        return t.getLocation().sub(t.getStartLocation()).mag() > 9;
    },
    formatEvent: function (t, h) {
        return "event:" + t.touch.getID() + " touches=" + (t.getTouches() ? t.getTouches().reduce((t, h) => t + "," + h.getID(), "") : "") + " bubbles=" + t.bubbles + " eventPhase=" + t.eventPhase + " currentTarget=" + (t.currentTarget ? t.currentTarget.name : "") + " target=" + (t.target ? t.target.name : "") + " captureListeners=" + (h ? h.reduce((t, h) => t + "->" + h.name, "") : "");
    }
};

be.Touch.DoubleClickDetector = function (t) {
    this.callback = t;
    this.touch1 = null;
    this.touch2 = null;
    this.state1 = 0;
    this.state2 = 0;
    this.startTime = 0;
    this.onTouchBegan = function (t) {
        if (this.touch1) {
            if (!this.touch2) if (2 == this.state1 && this._checkElapsedTime()) {
                this.touch2 = t.touch;
                this.state2 = 1;
            } else {
                this.touch1 = this.touch2 = null;
                this.onTouchBegan(t);
            }
        } else {
            this.touch1 = t.touch;
            this.state1 = 1;
            this.startTime = be.Date.currentTimeMillis();
        }
    };
    this.onTouchEnded = function (t) {
        if (this.touch2 && this.touch2 === t.touch) {
            if (1 == this.state2 && !be.Touch.checkMoved(this.touch2) && this._checkElapsedTime()) {
                this.state2 = 2;
                this.callback(this);
            }
            this.touch1 = this.touch2 = null;
        } else this.touch1 && this.touch1 === t.touch && (1 == this.state1 && !be.Touch.checkMoved(this.touch1) && this._checkElapsedTime() ? this.state1 = 2 : this.touch1 = this.touch2 = null);
    };
    this._checkElapsedTime = function () {
        return this.startTime && be.Date.currentTimeMillis() - this.startTime < 450;
    };
};

be.Touch.LongTouchDetector = function (t) {
    this.callback = t;
    this.touch = null;
    this.state = -1;
    this.onTouchBegan = function (t) {
        if (!this.touch) {
            this.touch = t.touch;
            this.state = -1;
            cc.director.getScheduler().enableForTarget(this);
            cc.director.getScheduler().schedule(h => {
                this._onTimeUpdate(t);
            }, this, 0, 0, .7, !1);
        }
    };
    this.onTouchMoved = function (t) {
        if (this.touch === t.touch) if (-1 == this.state) be.Touch.checkMoved(this.touch) && (this.state = 0); else if (1 == this.state && be.Touch.checkMoved(this.touch)) {
            this.state = 2;
            this.callback(this);
            this.touch = null;
        }
    };
    this.onTouchEnded = function (t) {
        if (this.touch === t.touch) {
            if (1 == this.state) {
                this.state = 2;
                this.callback(this);
            }
            this.touch = null;
        }
    };
    this.onTouchCancelled = function (t) {
        this.onTouchEnded(t);
    };
    this._onTimeUpdate = function (t) {
        if (this.touch === t.touch && -1 == this.state) if (be.Touch.checkMoved(this.touch)) this.state = 0; else {
            this.state = 1;
            this.callback(this);
        }
    };
};