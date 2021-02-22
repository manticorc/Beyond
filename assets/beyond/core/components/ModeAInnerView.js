const ModeAInnerView = cc.Class({
    extends: require("./ScrollView"),
    editor: CC_EDITOR && {
        menu: "i18n:MAIN_MENU.component.ui/BEModeAInnerView"
    },
    _init() {
        this._rootView = this.node.qgetComponentInParent(be.ModeAView);
        this._outerView = this.node.qgetComponentInParent(be.PageScrollView);
        this._super();
        if (this._outerView) {
            let t = this._outerView.node.getContentSize();
            this.setViewSize(t);
        }
        this._onInertiaBeforeStart = this.onInnerScrollViewInertiaBeforeStart;
        this._onInertiaAfterEnd = this.onInnerScrollViewInertiaAfterEnd;
    },
    _onDragBegan(t) {
        let e = t.touch.getDelta();
        this._outerView && Math.abs(e.x) > Math.abs(e.y) ? this.currentView = this._outerView : this.currentView = this;
        this.currentView === this ? this.stopAdjust() : this.currentView && this.currentView._onDragBegan(t);
    },
    _onDrag(t) {
        this.currentView === this ? this.doMoveAsLinked(t.touch.getDelta()) : this.currentView && this.currentView._onDrag(t);
    },
    _onDragEnded(t) {
        if (this.currentView == this) this.startAdjust(t.touch.getDelta()); else if (this.currentView) {
            this.currentView._touchMovePreviousTimestamp = this._touchMovePreviousTimestamp;
            this.currentView._touchMoveDisplacements = this._touchMoveDisplacements;
            this.currentView._touchMoveTimeDeltas = this._touchMoveTimeDeltas;
            this.currentView._onDragEnded(t);
        }
        this.currentView = null;
    },
    doMoveAsLinked(t) {
        let e = this._rootView._content.getPosition();
        if (t.y > 0) {
            if (e.y < this._rootView.maxPos.y) {
                e.y = Math.min(this._rootView.maxPos.y, e.y + t.y);
                this._rootView._content.setPosition(e);
                return !0;
            }
            return this.doScroll(t, !0);
        }
        if (t.y < 0) {
            if (this.doScroll(t, !1)) return !0;
            if (e.y > this._rootView.minPos.y) {
                e.y = Math.max(this._rootView.minPos.y, e.y + t.y);
                this._rootView._content.setPosition(e);
                return !0;
            }
            if (this.doScroll(t, !0)) return !0;
        }
        return !1;
    },
    doMoveRootView(t) {
        let e = this._rootView._content.getPosition();
        if (t.y > 0) {
            if (e.y < this._rootView.maxPos.y) {
                e.y = Math.min(this._rootView.maxPos.y, e.y + t.y);
                this._rootView._content.setPosition(e);
                return !0;
            }
        } else if (t.y < 0 && e.y > this._rootView.minPos.y) {
            e.y = Math.max(this._rootView.minPos.y, e.y + t.y);
            this._rootView._content.setPosition(e);
            return !0;
        }
        return !1;
    },
    stopAdjust() {
        this._super();
        this.stopAdjustRootInertia();
    },
    adjustUpdate(t) {
        if (this._touching) {
            this.stopAdjustInertia();
            this.stopAdjustRootInertia();
        } else {
            this.updateAdjustOverflow(t);
            this.updateAdjustInertia(t);
            this.updateAdjustRootInertia(t);
        }
    },
    onInnerScrollViewInertiaBeforeStart(t, e) {
        t.y > 0 ? this.startAdjustRootInertia(t, e) : this.startAdjustInertia(t, e);
    },
    onInnerScrollViewInertiaAfterEnd(t, e) {
        t.y < 0 && this.startAdjustRootInertia(t, e) || be.App.resetFrameRate(this._frToken);
    },
    startAdjustRootInertia(t, e) {
        if (0 != t.y) {
            this._rootInertiaVelocity = t;
            this._rootInertiaAcceleration = e;
            be.App.requireHighFrameRate(this._frToken);
            return !0;
        }
        return !1;
    },
    stopAdjustRootInertia() {
        this._rootInertiaVelocity = cc.Vec2.ZERO;
    },
    stopAdjustRootInertiaAtEnd() {
        if (this._rootInertiaVelocity.y > 0 && this.startAdjustInertia(this._rootInertiaVelocity, this._rootInertiaAcceleration)) this.stopAdjustRootInertia(); else {
            this.stopAdjustRootInertia();
            be.App.resetFrameRate(this._frToken);
        }
    },
    updateAdjustRootInertia(t) {
        this._rootInertiaVelocity && !this._rootInertiaVelocity.eqZero() && (this.doMoveRootView(this.computeInetiaMoveDistance(this._rootInertiaVelocity, this._rootInertiaAcceleration, t)) ? this.computeInetiaVelocityAfterMove(this._rootInertiaVelocity, this._rootInertiaAcceleration, t) : this.stopAdjustRootInertiaAtEnd());
    }
});

be.ModeAInnerView = module.exports = ModeAInnerView;