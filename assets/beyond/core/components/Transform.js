const Transform = cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        menu: "i18n:MAIN_MENU.component.ui/BETransform",
        inspector: "packages://be-transform/inspector.js"
    },
    properties: {
        _top: !1,
        top: {
            get() {
                return this._top;
            },
            set(t) {
                this._top = t;
                if (CC_EDITOR && t) {
                    let t = this.node.parent.qlocalRect();
                    this.marginTop = t.height + t.y - (this.node.y + (1 - this.node._anchorPoint.y) * this.node.height);
                }
            }
        },
        marginTop: {
            default: 0,
            displayName: "Top"
        },
        _bottom: !1,
        bottom: {
            get() {
                return this._bottom;
            },
            set(t) {
                this._bottom = t;
                if (CC_EDITOR && t) {
                    let t = this.node.parent.qlocalRect();
                    this.marginBottom = this.node.y - this.node._anchorPoint.y * this.node.height - t.y;
                }
            }
        },
        marginBottom: {
            default: 0,
            displayName: "Bottom"
        },
        _left: !1,
        left: {
            get() {
                return this._left;
            },
            set(t) {
                this._left = t;
                if (CC_EDITOR && t) {
                    let t = this.node.parent.qlocalRect();
                    this.marginLeft = this.node.x - this.node._anchorPoint.x * this.node.width - t.x;
                }
            }
        },
        marginLeft: {
            default: 0,
            displayName: "Left"
        },
        _right: !1,
        right: {
            get() {
                return this._right;
            },
            set(t) {
                this._right = t;
                if (CC_EDITOR && t) {
                    let t = this.node.parent.qlocalRect();
                    this.marginRight = t.width + t.x - (this.node.x + (1 - this.node._anchorPoint.x) * this.node.width);
                }
            }
        },
        marginRight: {
            default: 0,
            displayName: "Right"
        },
        _alignAnchorEnabled: !1,
        alignAnchorEnabled: {
            get() {
                return this._alignAnchorEnabled;
            },
            set(t) {
                this._alignAnchorEnabled = t;
                if (CC_EDITOR && t) {
                    this.alignAnchor = this.node._anchorPoint;
                    let t = this.node.parent.qlocalRect();
                    this.alignLocation = cc.v2((this.node.x - t.x) / t.width, (this.node.y - t.y) / t.height);
                }
            },
            displayName: "Align Anchor",
            tooltip: CC_DEV && "启用"
        },
        alignAnchor: {
            default: cc.v2(.5, .5),
            tooltip: CC_DEV && "对齐锚点"
        },
        alignLocation: {
            default: cc.v2(.5, .5),
            tooltip: CC_DEV && "对齐位置，归一化坐标，(0,0)~(1,1)，相对于父节点"
        },
        matchToScreen: {
            default: !1,
            tooltip: CC_DEV && "适配整个屏幕，否则适配上级节点"
        },
        _safeArea: !1,
        safeArea: {
            get() {
                return this._safeArea;
            },
            set(t) {
                this._safeArea = t;
                CC_EDITOR && t && (this.matchToScreen = !0);
            },
            tooltip: CC_DEV && "适配整个屏幕时是否计算安全区域"
        }
    },
    onLoad: function () {
        CC_DEBUG && be.logD(this.name + ".onLoad", this.enabled);
        CC_EDITOR || this.enabled && this.doTransform();
    },
    doTransform: function () {
        if (!this.enabledInHierarchy) return;
        var t = this.node;
        let i = t.parent.qlocalRect();
        this.matchToScreen && (i = this._safeArea ? be.Device.safeArea : cc.rect(0, 0, cc.visibleRect.width, cc.visibleRect.height));
        this._top && this._bottom && (this.node.height = Math.max(1, i.height - this.marginTop - this.marginBottom));
        this._left && this._right && (this.node.width = Math.max(1, i.width - this.marginLeft - this.marginRight));
        if (this._alignAnchorEnabled) {
            let e = cc.v2(i.x + i.width * this.alignLocation.x, i.y + i.height * this.alignLocation.y);
            this.matchToScreen && (e = t.parent.convertToNodeSpaceAR(e));
            t.qsetAlign(this.alignAnchor, e);
            return;
        }
        let e = void 0;
        this._top ? e = i.y + i.height - this.marginTop - t.height : this._bottom && (e = i.y + this.marginBottom);
        if (void 0 !== e) {
            this.matchToScreen && (e = t.parent.convertToNodeSpaceAR(cc.v2(0, e)).y);
            t.y = e + t._anchorPoint.y * t.height;
        }
        let o = void 0;
        this._left ? o = i.x + this.marginLeft : this._right && (o = i.x + i.width - this.marginRight - t.width);
        if (void 0 !== o) {
            this.matchToScreen && (o = t.parent.convertToNodeSpaceAR(cc.v2(o, 0)).x);
            t.x = o + t._anchorPoint.x * t.width;
        }
    }
});
be.Transform = module.exports = Transform;