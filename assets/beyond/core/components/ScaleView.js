const ScaleView = cc.Class({
    extends: cc.ViewGroup,
    editor: CC_EDITOR && {
        menu: "i18n:MAIN_MENU.component.ui/BEScaleView"
    },
    properties: {
        autoHideOutOfView: {
            default: !0,
            tooltip: CC_DEV && "自动隐藏屏幕外内容，减少渲染内容，优化性能。"
        }
    },
    onLoad() {
        be.logD(this.name + ".onLoad");
        this._init();
    },
    onEnable() {
        be.logD(this.name + ".onEnable");
        CC_EDITOR || this._registerEvent();
    },
    onDisable() {
        CC_EDITOR || this._unregisterEvent();
    },
    start() { },
    update(t) { },
    _registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, !0);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, !0);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, !0);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, !0);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, !0);
    },
    _unregisterEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, !0);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, !0);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, !0);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, !0);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, !0);
    },
    _init() {
        this.touchEnabled = !0;
        this._frToken = be.App.genFrameRateToken();
        this._content = this.node.qgetChild("content");
        this._content.qtransferAnchorPoint(be.anchorTopLeft);
        this._onInertiaBeforeStart;
        this._onInertiaAfterEnd;
        this._touchMoveDisplacements = [];
        this._touchMoveTimeDeltas = [];
        this._touchMovePreviousTimestamp = 0;
        this._viewport.setContentSize(this.node.getContentSize());
        this._content.setContentSize(this.node.getContentSize());
        this._content.qsetAlignWithParent(be.anchorTopLeft);
        this._doLayout();
    },
    setTouchEnabled(t) {
        this.touchEnabled = t;
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
        if (this.touchEnabled && this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) if (this._touch === t.touch) {
            this._touching = !0;
            this._gatherTouchMove(t.touch.getDelta());
            if (!this._draging && !t.touch.getDelta().eqZero()) {
                this._onDragBegan(t);
                this._draging = !0;
            }
            this._onDrag(t);
            if (!this._touchMoved) {
                if (t.touch.getLocation().sub(t.touch.getStartLocation()).mag() > 7 && !this._touchMoved && t.target !== this.node) {
                    let e = new cc.Event.EventTouch(t.getTouches(), t.bubbles);
                    e.type = cc.Node.EventType.TOUCH_CANCEL;
                    e.touch = t.touch;
                    e.simulate = !0;
                    t.target.dispatchEvent(e);
                    this._touchMoved = !0;
                }
            }
            this._stopPropagationIfTargetIsMe(t);
        } else t.stopPropagation();
    },
    _onTouchEnded(t, e) {
        if (this.touchEnabled && this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) if (this._touch === t.touch) {
            this._gatherTouchMove(t.touch.getDelta());
            this._onDragEnded(t);
            this._touching = !1;
            this._draging = !1;
            this._touch = null;
            this._touchMoved ? t.stopPropagation() : this._stopPropagationIfTargetIsMe(t);
        } else t.stopPropagation();
    },
    _onTouchCancelled(t, e) {
        if (this.touchEnabled && this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) if (this._touch === t.touch) {
            if (!t.simulate) {
                this._gatherTouchMove(t.touch.getDelta());
                this._onDragEnded(t);
                this._touching = !1;
                this._draging = !1;
                this._touch = null;
            }
            this._stopPropagationIfTargetIsMe(t);
        } else t.stopPropagation();
    },
    _onDragBegan(t) {
        this.stopAdjust();
    },
    _onDrag(t) {
        this.doScroll(t.touch.getDelta(), !0);
    },
    _onDragEnded(t) {
        this.startAdjust(t.touch.getDelta());
    }
});

be.ScaleView = module.exports = ScaleView;