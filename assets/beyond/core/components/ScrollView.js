var Type = cc.Enum({
    HORIZONTAL: 1,
    VERTICAL: 2
}), State = cc.Enum({
    Unknown: 0,
    Moving: 1,
    Stable: 2
});

const ScrollView = cc.Class({
    extends: cc.ViewGroup,
    editor: CC_EDITOR && {
        menu: "i18n:MAIN_MENU.component.ui/BEScrollView"
    },
    properties: {
        type: {
            default: Type.HORIZONTAL,
            type: Type
        },
        space: {
            default: 0,
            tooltip: CC_DEV && "间隔"
        },
        autoHideOutOfView: {
            default: !0,
            tooltip: CC_DEV && "自动隐藏屏幕外内容，减少渲染内容，优化性能。"
        },
        detectOppParentScrollView: {
            default: !1,
            displayName: CC_DEV && "Detect Opp. ScrollView",
            tooltip: CC_DEV && "检测滚动方向不同的父视图，如果存在则根据各自的方向分发触摸事件。"
        }
    },
    setTouchEnabled(t) {
        this.touchEnabled = t;
    },
    isMoveState(t) {
        return this._moveState == t;
    },
    onLoad() {
        CC_DEBUG && be.logD(this.name + ".onLoad", this.enabled);
        if (!CC_EDITOR && this.enabled) {
            this.touchEnabled = !0;
            this._moveState = State.Stable;
            this._init();
        }
    },
    onEnable() {
        CC_DEBUG && be.logD(this.name + ".onEnable", this.enabled);
        CC_EDITOR || this.enabled && this._registerEvent();
    },
    onDisable() {
        CC_DEBUG && be.logD(this.name + ".onDisable", this.enabled);
        CC_EDITOR || this.enabled && this._unregisterEvent();
    },
    start() { },
    update(t) {
        CC_EDITOR || this.enabled && this.adjustUpdate(t);
    },
    addItems(t) {
        t instanceof Array || (t = [t]);
        for (let e = 0; e < t.length; e++) t[e] && this._content.addChild(t[e]);
        this._doLayout();
    },
    removeItems(t) {
        t instanceof Array || (t = [t]);
        for (let e = t.length; --e >= 0;) if (t[e]) {
            t[e].removeFromParent();
            t[e].destroy();
        }
        this._doLayout();
    },
    getItems() {
        return this._content.children;
    },
    regStateChangeListner(t) {
        this._onStateChange = t;
    },
    fireStateChange(t) {
        this._moveState = t;
        null != this._onStateChange && this._onStateChange(this, t);
    },
    _stopPropagationIfTargetIsMe(t) {
        t.eventPhase === cc.Event.AT_TARGET && t.target === this.node && t.stopPropagation();
    },
    _hasNestedViewGroup(t, e) {
        if (t.eventPhase !== cc.Event.CAPTURING_PHASE) return !1;
        if (e) for (var i = 0; i < e.length; i++) {
            let s = e[i];
            if (this.node === s) return !!t.target.getComponent(cc.ViewGroup);
            if (s.getComponent(cc.ViewGroup)) return !0;
        }
        return !1;
    },
    _onTouchBegan(t, e) {
        if (this.touchEnabled && this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) {
            this._touch = t.touch;
            this._touching = !0;
            this._draging = !1;
            this._touchMovePreviousTimestamp = be.Date.currentTimeMillis();
            this._touchMoveDisplacements.length = 0;
            this._touchMoveTimeDeltas.length = 0;
            this._touchMoved = !1;
            this._stopPropagationIfTargetIsMe(t);
        }
    },
    _onTouchMoved(t, e) {
        if (this.touchEnabled && this.enabledInHierarchy && !this._hasNestedViewGroup(t, e) && this._touch === t.touch) {
            this._touching = !0;
            this._gatherTouchMove(t.touch.getDelta());
            if (!this._draging && !t.touch.getDelta().eqZero()) {
                this._onDragBegan(t);
                this._draging = !0;
            }
            this._onDrag(t);
            if (!this._touchMoved && be.Touch.checkMoved(t.touch) && !this._touchMoved && t.target !== this.node) {
                let e = new cc.Event.EventTouch(t.getTouches(), t.bubbles);
                e.type = cc.Node.EventType.TOUCH_CANCEL;
                e.touch = t.touch;
                e.simulate = !0;
                t.target.dispatchEvent(e);
                this._touchMoved = !0;
            }
            this._stopPropagationIfTargetIsMe(t);
        }
    },
    _onTouchEnded(t, e) {
        if (this.touchEnabled && this.enabledInHierarchy && !this._hasNestedViewGroup(t, e) && this._touch === t.touch) {
            this._gatherTouchMove(t.touch.getDelta());
            this._onDragEnded(t);
            this._touching = !1;
            this._draging = !1;
            this._touch = null;
            this._touchMoved ? t.stopPropagation() : this._stopPropagationIfTargetIsMe(t);
        }
    },
    _onTouchCancelled(t, e) {
        if (this.touchEnabled && this.enabledInHierarchy && !this._hasNestedViewGroup(t, e) && this._touch === t.touch) {
            if (!t.simulate) {
                this._gatherTouchMove(t.touch.getDelta());
                this._onDragEnded(t);
                this._touching = !1;
                this._draging = !1;
                this._touch = null;
            }
            this._stopPropagationIfTargetIsMe(t);
        }
    },
    _onDragBegan(t) {
        this._currentTargetView = this;
        if (this._parentOppScrollView) {
            let e = t.touch.getDelta();
            this.type == be.ScrollView.Type.VERTICAL && Math.abs(e.x) > Math.abs(e.y) ? this._currentTargetView = this._parentOppScrollView : this.type == be.ScrollView.Type.HORIZONTAL && Math.abs(e.x) < Math.abs(e.y) && (this._currentTargetView = this._parentOppScrollView);
        }
        this._currentTargetView === this ? this.stopAdjust() : this._currentTargetView && this._currentTargetView._onDragBegan(t);
    },
    _onDrag(t) {
        this._currentTargetView === this ? this.doScroll(t.touch.getDelta(), !0) : this._currentTargetView && this._currentTargetView._onDrag(t);
    },
    _onDragEnded(t) {
        if (this._currentTargetView == this) this.startAdjust(t.touch.getDelta()); else if (this._currentTargetView) {
            this._currentTargetView._touchMovePreviousTimestamp = this._touchMovePreviousTimestamp;
            this._currentTargetView._touchMoveDisplacements = this._touchMoveDisplacements;
            this._currentTargetView._touchMoveTimeDeltas = this._touchMoveTimeDeltas;
            this._currentTargetView._onDragEnded(t);
        }
        this._currentTargetView = null;
    },
    getViewport() {
        this._viewport || (this._viewport = this.node.qfind("view"));
        return this._viewport;
    },
    getContent() {
        this._content || (this._content = this.node.qfind("view/content"));
        return this._content;
    },
    _init() {
        this._frToken = be.App.genFrameRateToken();
        this._viewport = this.node.qgetChild("view");
        this._content = this._viewport.qgetChild("content");
        this._content.qtransferAnchorPoint(be.anchorTopLeft);
        this._onInertiaBeforeStart;
        this._onInertiaAfterEnd;
        this._touchMoveDisplacements = [];
        this._touchMoveTimeDeltas = [];
        this._touchMovePreviousTimestamp = 0;
        this._viewport.setContentSize(this.node.getContentSize());
        this._content.setContentSize(this.node.getContentSize());
        this._content.qsetAlignWithParent(be.anchorTopLeft);
        if (this.detectOppParentScrollView) {
            let t = this.node.qgetComponentInParent(be.ScrollView);
            t && this.type != t.type && (this._parentOppScrollView = t);
        }
        this._doLayout();
    },
    setViewSize(t, e) {
        this.node.setContentSize(t, e);
        if (this._viewport) {
            this._viewport.setContentSize(this.node.getContentSize());
            this._content.setContentSize(this.node.getContentSize());
            this._content.qsetAlignWithParent(be.anchorTopLeft);
            this._doLayout();
        }
    },
    _registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, !0);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, !0);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, !0);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, !0);
    },
    _unregisterEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, !0);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, !0);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, !0);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, !0);
    },
    _doLayout() {
        be.UI.doLayout(this._content, {
            type: this.type,
            space: this.space
        });
        this._prepare();
    },
    doLayout() {
        this._doLayout();
    },
    _prepare() {
        let t = this._viewport.qlocalRect(), e = this._content.qlocalRect();
        this.overflow = new cc.Vec2(t.width, t.height).mulSelf(.1);
        this.minPos = cc.Vec2.ZERO;
        this.maxPos = cc.Vec2.ZERO;
        if (this.type == Type.HORIZONTAL) {
            this.minPos.x = t.xMin - (e.width > t.width ? e.width - t.width : 0);
            this.maxPos.x = t.xMin;
        } else if (this.type == Type.VERTICAL) {
            this.minPos.y = t.yMax;
            this.maxPos.y = t.yMax + (e.height > t.height ? e.height - t.height : 0);
        }
        this._setItemsVisible();
    },
    _setItemsVisible() {
        this.autoHideOutOfView && this._content.children.forEach(t => {
            t.active = this.isItemInViewPort(t);
        });
    },
    getScalePosition() {
        if (this.type == Type.HORIZONTAL) {
            if (this.minPos.x != this.maxPos.x) return 1 - (this._content.x - this.minPos.x) / (this.maxPos.x - this.minPos.x);
        } else if (this.type == Type.VERTICAL && this.minPos.y != this.maxPos.y) return (this._content.y - this.minPos.y) / (this.maxPos.y - this.minPos.y);
        return 0;
    },
    isItemInViewPort(t) {
        if (t.parent !== this._content) {
            be.logE(this.name + ".isItemInViewPort 非子节点", t);
            return !1;
        }
        let e = t.getBoundingBox(), i = this._viewport.qlocalRect();
        return this.type == Type.HORIZONTAL ? this.minPos.x == this.maxPos.x || this._content.x + e.xMin < this.maxPos.x + i.width && this._content.x + e.xMax > this.maxPos.x : this.type == Type.VERTICAL && (this.minPos.y == this.maxPos.y || this._content.y + e.yMin < this.minPos.y && this._content.y + e.yMax > this.minPos.y - i.height);
    },
    setContentPosition(t) {
        this._content.setPosition(t);
        this._setItemsVisible();
    },
    doScroll(t, e, i) {
        if (this.type == Type.HORIZONTAL && 0 != t.x) {
            let s = this._content.getPosition();
            if (t.x > 0) {
                let o = i ? this.minPos.x : e ? this.maxPos.x + this.overflow.x : this.maxPos.x;
                if (s.x < o) {
                    s.x = Math.min(o, s.x + t.x);
                    this.setContentPosition(s);
                    this.fireStateChange(State.Moving);
                    return !0;
                }
            } else if (t.x < 0) {
                let o = i ? this.maxPos.x : e ? this.minPos.x - this.overflow.x : this.minPos.x;
                if (s.x > o) {
                    s.x = Math.max(o, s.x + t.x);
                    this.setContentPosition(s);
                    this.fireStateChange(State.Moving);
                    return !0;
                }
            }
        } else if (this.type == Type.VERTICAL && 0 != t.y) {
            let s = this._content.getPosition();
            if (t.y > 0) {
                let o = i ? this.minPos.y : e ? this.maxPos.y + this.overflow.y : this.maxPos.y;
                if (s.y < o) {
                    s.y = Math.min(o, s.y + t.y);
                    this.setContentPosition(s);
                    this.fireStateChange(State.Moving);
                    return !0;
                }
            } else if (t.y < 0) {
                let o = i ? this.maxPos.y : e ? this.minPos.y - this.overflow.y : this.minPos.y;
                if (s.y > o) {
                    s.y = Math.max(o, s.y + t.y);
                    this.setContentPosition(s);
                    this.fireStateChange(State.Moving);
                    return !0;
                }
            }
        }
        return !1;
    },
    doScrollForTarget(t, e) {
        if (this.type == Type.HORIZONTAL && 0 != t.x) {
            let i = this._content.getPosition();
            if (i.x < e.x) {
                i.x = Math.min(e.x, i.x + Math.abs(t.x));
                this.setContentPosition(i);
                this.fireStateChange(State.Moving);
                return !0;
            }
            if (i.x > e.x) {
                i.x = Math.max(e.x, i.x - Math.abs(t.x));
                this.setContentPosition(i);
                this.fireStateChange(State.Moving);
                return !0;
            }
        } else if (this.type == Type.VERTICAL && 0 != t.y) {
            let i = this._content.getPosition();
            if (i.y < e.y) {
                i.y = Math.min(e.y, i.y + Math.abs(t.y));
                this.setContentPosition(i);
                this.fireStateChange(State.Moving);
                return !0;
            }
            if (i.y > e.y) {
                i.y = Math.max(e.y, i.y - Math.abs(t.y));
                this.setContentPosition(i);
                this.fireStateChange(State.Moving);
                return !0;
            }
        }
        return !1;
    },
    doScrollToItem(t, e, i) {
        t.getParent() !== this._content && be.logW("ScrollView.doScrollToItem the item must be child of content!!");
        if (void 0 === e) e = cc.Vec2.ZERO; else if (void 0 === e.x) {
            i = e;
            e = cc.Vec2.ZERO;
        }
        let s = cc.Vec2.ZERO, o = t.qlocalRectInParent(!0);
        this.type == be.ScrollView.Type.HORIZONTAL ? s.x = -o.xMin - .5 * this._viewport.width + e.x : this.type == be.ScrollView.Type.VERTICAL && (s.y = -o.yMax + .5 * this._viewport.height + e.y);
        this.doScrollToPos(s, i);
    },
    doScrollToPos(t, e) {
        if (e) this.startAdjustToDest(t); else {
            let e = cc.v2(this._content.getPosition());
            this.type == be.ScrollView.Type.HORIZONTAL ? e.x = Math.max(this.minPos.x, Math.min(this.maxPos.x, t.x)) : this.type == be.ScrollView.Type.VERTICAL && (e.y = Math.max(this.minPos.y, Math.min(this.maxPos.y, t.y)));
            this.setContentPosition(e);
        }
    },
    startAdjust(t) {
        if (!this.startAdjustOverflow()) {
            let t = this.computeInetiaVelocityByTouch();
            t[0].eqZero() ? this.fireStateChange(State.Stable) : this._onInertiaBeforeStart ? this._onInertiaBeforeStart(t[0], t[1]) : this.startAdjustInertia(t[0], t[1]);
        }
    },
    stopAdjust() {
        this.stopAdjustOverflow();
        this.stopAdjustInertia();
        this.stopAdjustToDest();
        be.App.resetFrameRate(this._frToken);
    },
    adjustUpdate(t) {
        if (this._touching) {
            this.stopAdjustInertia();
            this.stopAdjustToDest();
            be.App.resetFrameRate(this._frToken);
        } else {
            this.updateAdjustOverflow(t);
            this.updateAdjustInertia(t);
            this.updateAdjustToDest(t);
        }
    },
    startAdjustOverflow() {
        this._adjustOverflowVelocity = cc.Vec2.ZERO;
        let t = this._content.getPosition();
        if (this.type == Type.HORIZONTAL) {
            t.x < this.minPos.x ? this._adjustOverflowVelocity.x = this._viewport.width : t.x > this.maxPos.x && (this._adjustOverflowVelocity.x = -this._viewport.width);
            if (0 != this._adjustOverflowVelocity.x) {
                be.App.requireHighFrameRate(this._frToken);
                return !0;
            }
        } else if (this.type == Type.VERTICAL) {
            t.y < this.minPos.y ? this._adjustOverflowVelocity.y = this._viewport.height : t.y > this.maxPos.y && (this._adjustOverflowVelocity.y = -this._viewport.height);
            if (0 != this._adjustOverflowVelocity.y) {
                be.App.requireHighFrameRate(this._frToken);
                return !0;
            }
        }
        return !1;
    },
    stopAdjustOverflow() {
        this._adjustOverflowVelocity = cc.Vec2.ZERO;
    },
    updateAdjustOverflow(t) {
        if (this._adjustOverflowVelocity && !this._adjustOverflowVelocity.eqZero() && !this.doScroll(this._adjustOverflowVelocity.mul(t), !1, !0)) {
            this.stopAdjustOverflow();
            this.fireStateChange(State.Stable);
            be.App.resetFrameRate(this._frToken);
        }
    },
    startAdjustInertia(t, e) {
        this._inertiaVelocity = t;
        this._inertiaAcceleration = e;
        if (this._inertiaVelocity.eqZero()) {
            this.fireStateChange(State.Stable);
            return !1;
        }
        be.App.requireHighFrameRate(this._frToken);
        return !0;
    },
    stopAdjustInertia() {
        this._inertiaVelocity = cc.Vec2.ZERO;
    },
    stopAdjustInertiaAtEnd() {
        this.fireStateChange(State.Stable);
        this._onInertiaAfterEnd ? this._onInertiaAfterEnd(this._inertiaVelocity, this._inertiaAcceleration) : be.App.resetFrameRate(this._frToken);
        this.stopAdjustInertia();
    },
    updateAdjustInertia(t) {
        if (this._inertiaVelocity && !this._inertiaVelocity.eqZero()) if (this.doScroll(this.computeInetiaMoveDistance(this._inertiaVelocity, this._inertiaAcceleration, t))) {
            this.computeInetiaVelocityAfterMove(this._inertiaVelocity, this._inertiaAcceleration, t);
            this._inertiaVelocity.eqZero() && this.stopAdjustInertiaAtEnd();
        } else this.stopAdjustInertiaAtEnd();
    },
    _gatherTouchMove(t) {
        this.type == Type.HORIZONTAL || (this.type, Type.VERTICAL);
        for (; this._touchMoveDisplacements.length >= 5;) {
            this._touchMoveDisplacements.shift();
            this._touchMoveTimeDeltas.shift();
        }
        this._touchMoveDisplacements.push(t);
        let e = be.Date.currentTimeMillis();
        this._touchMoveTimeDeltas.push((e - this._touchMovePreviousTimestamp) / 1e3);
        this._touchMovePreviousTimestamp = e;
    },
    _calculateTouchMoveVelocity() {
        let t = 0;
        if ((t = this._touchMoveTimeDeltas.reduce(function (t, e) {
            return t + e;
        }, t)) <= 0 || t >= .5) return cc.v2(0, 0);
        let e = cc.v2(0, 0);
        e = this._touchMoveDisplacements.reduce(function (t, e) {
            return t.add(e);
        }, e);
        return cc.v2(.5 * e.x / t, .5 * e.y / t);
    },
    computeInetiaVelocityByTouch() {
        let t = [cc.Vec2.ZERO, cc.Vec2.ZERO], e = this._calculateTouchMoveVelocity();
        if (this.type == Type.HORIZONTAL && 0 != e.x) {
            let i = e.x, s = this._viewport.width;
            if (Math.abs(i) > .1 * s) {
                let e = 1.05 * s, o = 4.2 * s, h = Math.min(o, Math.max(e, Math.abs(i)));
                t[0].x = i > 0 ? h : -h;
                t[1].x = .35 * (i > 0 ? -s : s);
            }
        } else if (this.type == Type.VERTICAL && 0 != e.y) {
            let i = e.y, s = this._viewport.height;
            if (Math.abs(i) > .1 * s) {
                let e = 1.05 * s, o = 4.2 * s, h = Math.min(o, Math.max(e, Math.abs(i)));
                t[0].y = i > 0 ? h : -h;
                t[1].y = .35 * (i > 0 ? -s : s);
            }
        }
        return t;
    },
    computeInetiaMoveDistance(t, e, i) {
        let s = cc.Vec2.ZERO;
        0 != t.x ? s.x = t.x * i + e.x * i * i / 2 : 0 != t.y && (s.y = t.y * i + e.y * i * i / 2);
        return s;
    },
    computeInetiaVelocityAfterMove(t, e, i) {
        if (0 != t.x) {
            let s = t.x + e.x * i;
            t.x = t.x < 0 && s < 0 || t.x > 0 && s > 0 ? s : 0;
        } else if (0 != t.y) {
            let s = t.y + e.y * i;
            t.y = t.y < 0 && s < 0 || t.y > 0 && s > 0 ? s : 0;
        }
    },
    startAdjustToDest(t, e) {
        this.stopAdjust();
        this._adjustToDestPosition = cc.Vec2.ZERO;
        this._adjustToDestVelocity = cc.Vec2.ZERO;
        if (this.type == be.ScrollView.Type.HORIZONTAL) {
            this._adjustToDestPosition.x = Math.max(this.minPos.x, Math.min(this.maxPos.x, t.x));
            if (void 0 === e) {
                let t = Math.abs(this._adjustToDestPosition.x - this._content.x) / this._viewport.width;
                e = Math.min(.45, .3 * t) / t;
            }
            this._adjustToDestVelocity.x = this._viewport.width / e;
        } else if (this.type == be.ScrollView.Type.VERTICAL) {
            this._adjustToDestPosition.y = Math.max(this.minPos.y, Math.min(this.maxPos.y, t.y));
            if (void 0 === e) {
                let t = Math.abs(this._adjustToDestPosition.y - this._content.y) / this._viewport.height;
                e = Math.min(.45, .3 * t) / t;
            }
            this._adjustToDestVelocity.y = this._viewport.height / e;
        }
        be.App.requireHighFrameRate(this._frToken);
    },
    stopAdjustToDest() {
        this._adjustToDestPosition = cc.Vec2.ZERO;
        this._adjustToDestVelocity = cc.Vec2.ZERO;
    },
    updateAdjustToDest(t) {
        if (this._adjustToDestVelocity && !this._adjustToDestVelocity.eqZero() && !this.doScrollForTarget(this._adjustToDestVelocity.mul(t), this._adjustToDestPosition)) {
            this.stopAdjustToDest();
            this.fireStateChange(be.ScrollView.State.Stable);
            be.App.resetFrameRate(this._frToken);
        }
    }
});

ScrollView.Type = Type;

ScrollView.State = State;

be.ScrollView = module.exports = ScrollView;