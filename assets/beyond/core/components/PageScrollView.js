const PageScrollView = cc.Class({
    extends: require("./ScrollView"),
    editor: CC_EDITOR && {
        menu: "i18n:MAIN_MENU.component.ui/BEPageScrollView"
    },
    properties: {
        autoRollInterval: {
            default: 0,
            tooltip: CC_DEV && "自动翻页间隔时间，0即不自动翻页"
        }
    },
    _regAutoRoll() {
        if (this._autoRollInterval !== this.autoRollInterval) {
            if (this._autoRollAction) {
                this._viewport.stopAction(this._autoRollAction);
                this._autoRollAction = null;
            }
            this._autoRollInterval = this.autoRollInterval;
            if (this._autoRollInterval) {
                this._autoRollAction = cc.repeatForever(cc.sequence(cc.delayTime(this._autoRollInterval), cc.callFunc(function () {
                    this._touching || this.isAdjusting() || this.startAdjustAutoRoll();
                }, this)));
                this._viewport.runAction(this._autoRollAction);
            }
        }
    },
    _prepare() {
        this._regAutoRoll();
        this._super();
        this.pageSize = this._viewport.getContentSize();
        this.pageCount = 1;
        this.type == be.ScrollView.Type.HORIZONTAL ? this.pageCount = 0 == this._content.width ? 1 : Math.ceil(this._content.width / this.pageSize.width) : this.type == be.ScrollView.Type.VERTICAL && (this.pageCount = 0 == this._content.height ? 1 : Math.ceil(this._content.height / this.pageSize.height));
    },
    getPageCount() {
        return this.pageCount;
    },
    getPageIndex() {
        if (this.pageCount > 1) {
            let t = 10, i = this._content.getPosition();
            if (this.type == be.ScrollView.Type.HORIZONTAL) return Math.min(this.pageCount - 1, parseInt((this.maxPos.x - i.x + t) / this.pageSize.width));
            if (this.type == be.ScrollView.Type.VERTICAL) return Math.min(this.pageCount - 1, parseInt((i.y - this.minPos.y + t) / this.pageSize.height));
        }
        return 0;
    },
    _getPagePosition(t) {
        if (t >= this.pageCount) {
            be.logE(this.name + "_getPagePosition 页码错误! pageIndex= " + t + " pageCount=" + this.pageCount);
            t = 0;
        }
        let i = this._content.getPosition();
        this.type == be.ScrollView.Type.HORIZONTAL ? i.x = this.maxPos.x - t * this.pageSize.width : this.type == be.ScrollView.Type.VERTICAL && (i.y = this.minPos.y + t * this.pageSize.height);
        return i;
    },
    doScrollToPage(t, i) {
        if (i) {
            let i = Math.abs(t - this.getPageIndex());
            this.startAdjustToPage(t, 0 == i ? .1 : Math.min(.45, .3 * i) / i);
        } else {
            let i = this._getPagePosition(t);
            this.doScrollToPos(i);
        }
    },
    isAdjusting() {
        return this._adjustVelocity && !this._adjustVelocity.eqZero();
    },
    startAdjustToPage(t, i) {
        if (!(this.pageCount <= 1)) {
            this._destPosition = cc.Vec2.ZERO;
            this._adjustVelocity = cc.Vec2.ZERO;
            if (this.type == be.ScrollView.Type.HORIZONTAL) {
                this._destPosition = this._getPagePosition(t);
                i = void 0 !== i ? i : .3;
                this._adjustVelocity.x = this.pageSize.width / i;
            }
            be.App.requireHighFrameRate(this._frToken);
        }
    },
    startAdjustAutoRoll() {
        if (this.pageCount <= 1) return;
        this._destPosition = cc.Vec2.ZERO;
        this._adjustVelocity = cc.Vec2.ZERO;
        this._autoRollDirection = void 0 !== this._autoRollDirection ? this._autoRollDirection : 1;
        let t = this.getPageIndex() + this._autoRollDirection;
        if (t < 0) {
            t = 1;
            this._autoRollDirection = 1;
        } else if (t >= this.pageCount) {
            t = this.pageCount - 2;
            this._autoRollDirection = -1;
        }
        this._content.getPosition();
        if (this.type == be.ScrollView.Type.HORIZONTAL) {
            this._destPosition = this._getPagePosition(t);
            this._adjustVelocity.x = this.pageSize.width / .6;
        }
        be.App.requireHighFrameRate(this._frToken);
    },
    startAdjust(t) {
        this._destPosition = cc.Vec2.ZERO;
        this._adjustVelocity = cc.Vec2.ZERO;
        let i = this._content.getPosition();
        if (this.type == be.ScrollView.Type.HORIZONTAL) {
            if (i.x < this.minPos.x) this._destPosition.x = this.minPos.x; else if (i.x > this.maxPos.x) this._destPosition.x = this.maxPos.x; else {
                this._destPosition.x = i.x;
                let t = this._calculateTouchMoveVelocity();
                t.x < .2 * -this._viewport.width ? this._destPosition.x = Math.max(this.minPos.x, this._destPosition.x - .7 * this.pageSize.width) : t.x > .2 * this._viewport.width && (this._destPosition.x = Math.min(this.maxPos.x, this._destPosition.x + .7 * this.pageSize.width));
                this._destPosition.x = this.minPos.x + Math.round((this._destPosition.x - this.minPos.x) / this.pageSize.width, 0) * this.pageSize.width;
            }
            if (this._destPosition.x != i.x) {
                this._adjustVelocity.x = this.pageSize.width / .4;
                be.App.requireHighFrameRate(this._frToken);
            } else this.fireStateChange(be.ScrollView.State.Stable);
        }
    },
    stopAdjust() {
        this._destPosition = cc.Vec2.ZERO;
        this._adjustVelocity = cc.Vec2.ZERO;
        be.App.resetFrameRate(this._frToken);
    },
    adjustUpdate(t) {
        if (!this._touching && this._adjustVelocity && !this._adjustVelocity.eqZero() && !this.doScrollForTarget(this._adjustVelocity.mul(t), this._destPosition)) {
            this.stopAdjust();
            this.fireStateChange(be.ScrollView.State.Stable);
        }
    }
});

be.PageScrollView = module.exports = PageScrollView;