// require("../../../cocos2d/core");

be.anchorCenter = cc.v2(.5, .5);

be.anchorTopLeft = cc.v2(0, 1);

be.anchorTopRight = cc.v2(1, 1);

be.anchorBottomLeft = cc.v2(0, 0);

be.anchorBottomRight = cc.v2(1, 0);

be.anchorTopCenter = cc.v2(.5, 1);

be.anchorBottomCenter = cc.v2(.5, 0);

be.anchorLeftCenter = cc.v2(0, .5);

be.anchorRightCenter = cc.v2(1, .5);

be.instantiate = function (t, e, i, o) {
    let n = cc.instantiate(t);
    e.addChild(n, i, o);
    return n;
};

be.translateResUrl = function (t) {
    let e = cc.loader.getRes(t);
    if (e) {
        t = e.url;
        cc.loader.md5Pipe && (t = cc.loader.md5Pipe.transformURL(t));
        if (CC_WECHATGAME) try {
            let e = wx.env.USER_DATA_PATH + "/" + t;
            wx.getFileSystemManager().accessSync(e);
            t = e;
        } catch (t) {
            CC_DEBUG && be.logD("be.translateResUrl " + t.message);
        }
    }
    return t;
};

be.Node = be.NodeHelper = {
    create: function (t, e, i) {
        let o = new cc.Node();
        if (t instanceof cc.Node) t.addChild(o); else {
            i = e;
            e = t;
        }
        e && i && o.setContentSize(cc.size(e, i));
        return o;
    },
    setSpriteFrame: function (t, e) {
        this.setChildSpriteFrame(t, null, e);
    },
    setLabelString: function (t, e) {
        this.setChildLabelString(t, null, e);
    },
    getChild: function (t, e) {
        let i = t;
        if (i && e && e.length > 0) {
            let o = e.split("/");
            for (let n = 0; n < o.length; n++) if (!(i = i.getChildByName(o[n]))) {
                cc.log("NodeHelper.getChild error: " + t.name + " does not contains " + e);
                return null;
            }
        }
        return i;
    },
    getChildComponent: function (t, e, i) {
        let o = this.getChild(t, e);
        return o ? o.getComponent(i) : null;
    },
    setChildSpriteFrame: function (t, e, i) {
        let o = this.getChildComponent(t, e, cc.Sprite);
        o && (o.spriteFrame = new cc.SpriteFrame(i));
    },
    setChildLabelString: function (t, e, i) {
        let o = this.getChildComponent(t, e, cc.Label);
        o && (o.string = i);
    },
    registerTouchBlock: function (t) {
        t.qblockInput();
    },
    move: function (t, e, i, o) {
        return this.moveX(t, e.x, i.x, o.x) && this.moveY(t, e.y, i.y, o.y);
    },
    moveX: function (t, e, i, o) {
        let n = this._move(t.x, e, i, o);
        t.x = n.pos;
        return n.arrived;
    },
    moveY: function (t, e, i, o) {
        let n = this._move(t.y, e, i, o);
        t.y = n.pos;
        return n.arrived;
    },
    _move: function (t, e, i, o) {
        if (e == i) return {
            pos: i,
            arrived: !0
        };
        o = Math.abs(o);
        let n = !1;
        if (e < i) {
            if ((t += o) >= i) {
                t = i;
                n = !0;
            }
        } else if ((t += -o) <= i) {
            t = i;
            n = !0;
        }
        return {
            pos: t,
            arrived: n
        };
    },
    getBoundToScreen: function (t) {
        var e = t.getBoundingBoxToWorld(), i = cc.view._scaleX, o = cc.view._scaleY;
        return {
            x: e.x * i + cc.view._viewportRect.x,
            y: e.y * o + cc.view._viewportRect.y,
            width: e.width * i,
            height: e.height * o
        };
    }
};

cc.Vec2.prototype.eqZero = function () {
    return 0 === this.x && 0 === this.y;
};

cc.Node.prototype.qfind = function (t) {
    return cc.find(t, this);
};

cc.Node.prototype.qgetChild = function (t) {
    return this.getChildByName(t);
};

cc.Node.prototype.qactive = function (t) {
    this.active = void 0 === t || t;
    return this;
};

cc.Node.prototype.qgetContentSize = function () {
    let t = this._contentSize;
    0 == t.width && 0 == t.height && (t = cc.view._designResolutionSize);
    return t;
};

cc.Node.prototype.qscaleTo = function (t, e) {
    let i, o;
    "number" == typeof t && (i = t / this.width);
    "number" == typeof e && (o = e / this.height);
    if (void 0 === i) {
        if (void 0 === o) return this;
        i = o;
    } else if (void 0 === o) {
        if (void 0 === i) return this;
        o = i;
    }
    this.setScale(i, o);
    return this;
};

cc.Node.prototype.qsetScaleWithPoint = function (t, e) {
    "number" == typeof t && (t = cc.v2(t, t));
    if (t.equals(this._scale)) return;
    if (!this.qlocalRect().contains(e)) {
        let t, i;
        if (e.x >= 0 && e.y >= 0) {
            t = (1 - this._anchorPoint.x) * this._contentSize.width;
            i = (1 - this._anchorPoint.y) * this._contentSize.height;
        } else if (e.x <= 0 && e.y >= 0) {
            t = -this._anchorPoint.x * this._contentSize.width;
            i = (1 - this._anchorPoint.y) * this._contentSize.height;
        } else if (e.x <= 0 && e.y <= 0) {
            t = -this._anchorPoint.x * this._contentSize.width;
            i = -this._anchorPoint.y * this._contentSize.height;
        } else if (e.x >= 0 && e.y <= 0) {
            t = (1 - this._anchorPoint.x) * this._contentSize.width;
            i = -this._anchorPoint.y * this._contentSize.height;
        }
        e = e.mul(Math.min(0 == e.x ? 0 : t / e.x, 0 == e.y ? 0 : i / e.y));
    }
    let i = cc.v2(t.x - this._scale.x, t.y - this._scale.y);
    this.setScale(t);
    this.setPosition(this._position.sub(e.scale(i)));
    return this;
};

cc.Node.prototype.qlocalRect = function (t) {
    let e = this._contentSize.width, i = this._contentSize.height;
    if (t) {
        e *= this.scaleX;
        i *= this.scaleY;
    }
    return cc.rect(-this._anchorPoint.x * e, -this._anchorPoint.y * i, e, i);
};

cc.Node.prototype.qlocalRectInParent = function (t) {
    let e = this.qlocalRect(t);
    e.x += this.x;
    e.y += this.y;
    return e;
};

cc.Node.prototype.qgetWorldScale = function (t) {
    let e = this.convertToWorldSpaceAR(cc.Vec2.ZERO), i = this._contentSize.width, o = this._contentSize.height;
    if (t) {
        i *= this.scaleX;
        o *= this.scaleY;
    }
    let n = this.convertToWorldSpaceAR(cc.v2(i, o));
    return {
        x: (n.x - e.x) / i,
        y: (n.y - e.y) / o
    };
};

cc.Node.prototype.qworldRect = function (t) {
    let e = this.convertToWorldSpaceAR(cc.Vec2.ZERO), i = this._contentSize.width, o = this._contentSize.height;
    if (t) {
        i *= this.scaleX;
        o *= this.scaleY;
    }
    let n = this.convertToWorldSpaceAR(cc.v2(i, o));
    i = n.x - e.x;
    o = n.y - e.y;
    return cc.rect(e.x - this._anchorPoint.x * i, e.y - this._anchorPoint.y * o, i, o);
};

cc.Node.prototype.qsetWorldPosition = function (t, e, i) {
    void 0 != t.y ? this.qsetPosition(this.parent.convertToNodeSpaceAR(t, e)) : this.qsetPosition(this.parent.convertToNodeSpaceAR(cc.v2(t, e)), i);
    return this;
};

cc.Node.prototype.qsetPosition = function (t, e, i) {
    this.setPosition(t, e);
    i ? this.setAnchorPoint(i) : void 0 != t.y && e && this.setAnchorPoint(e);
    return this;
};

cc.Node.prototype.qsetWorldAlign = function (t, e, i) {
    this.qsetAlign(t, this.parent.convertToNodeSpaceAR(void 0 != e.y ? e : cc.v2(e, i)));
    return this;
};

cc.Node.prototype.qsetAlign = function (t, e, i) {
    let o = t, n = void 0 != e.y ? e : {
        x: e,
        y: i
    }, c = this.qgetContentSize(), r = {};
    r.x = n.x + (this._anchorPoint.x - o.x) * c.width * this._scale.x;
    r.y = n.y + (this._anchorPoint.y - o.y) * c.height * this._scale.y;
    this.setPosition(r);
    return this;
};

cc.Node.prototype.qsetAlignWithParent = function (t, e) {
    e = e || t;
    let i = this.parent.qlocalRect();
    this.qsetAlign(t, i.x + i.width * e.x, i.y + i.height * e.y);
    return this;
};

cc.Node.prototype.qtransferAnchorPoint = function (t) {
    let e = this._anchorPoint;
    if (t.x == e.x && t.y == e.y) return this;
    let i = this._position, o = this.qgetContentSize(), n = {};
    n.x = i.x + (t.x - e.x) * o.width * this._scale.x;
    n.y = i.y + (t.y - e.y) * o.height * this._scale.y;
    this.setAnchorPoint(t);
    this.setPosition(n);
    return this;
};

cc.Node.prototype.qblockInput = function () {
    let t = function (t) {
        t.stopPropagation();
    };
    this.on(cc.Node.EventType.TOUCH_START, t, this);
    this.on(cc.Node.EventType.TOUCH_MOVE, t, this);
    this.on(cc.Node.EventType.TOUCH_END, t, this);
    this.on(cc.Node.EventType.TOUCH_CANCEL, t, this);
    return this;
};

cc.Node.prototype.qgetComponentInParent = function (t) {
    let e = this.getParent();
    for (; e && !(e instanceof cc.Scene);) {
        let i = e.getComponent(t);
        if (i) return i;
        e = e.getParent();
    }
    return null;
};

cc.Node.prototype.qaddMask = function (t) {
    this.addComponent(cc.Mask).type = t || cc.Mask.Type.RECT;
    return this;
};

cc.Node.prototype.qaddGraphics = function (t) {
    let e = this.addComponent(cc.Graphics);
    if (e && t) {
        let i = this.qgetContentSize();
        e.fillColor = t;
        e.fillRect(-i.width / 2, -i.height / 2, i.width, i.height);
    }
    return this;
};

cc.Node.prototype.qaddSprite = function (t, e, i) {
    let o = this.addComponent(cc.Sprite);
    if (o) {
        void 0 != e && (o.type = e);
        void 0 == i && (i = 0 == this._contentSize.width ? cc.Sprite.SizeMode.RAW : cc.Sprite.SizeMode.CUSTOM);
        o.sizeMode = i;
        this.qsetSpriteFrame(t);
    }
    return this;
};

cc.Node.prototype.qsetSpriteFrame = function (t) {
    let e = this.getComponent(cc.Sprite);
    if (e) if ("string" != typeof t || t.startsWith("/") || t.startsWith("http:")) t instanceof cc.SpriteFrame ? e.spriteFrame = t : e.spriteFrame = new cc.SpriteFrame(t); else {
        let i = be.AssetAdaptor.getAssetsPath(t);
        i && (t = i);
        let o = cc.loader.getRes(t, cc.SpriteFrame);
        o ? e.spriteFrame = o : cc.loader.loadRes(t, cc.SpriteFrame, function (t, i) {
            t || (e.spriteFrame = i);
        });
    }
    return this;
};

cc.Node.prototype.qaddLabel = function (t, e, i) {
    let o = this.addComponent(cc.Label);
    if (o) {
        e = e || 48;
        o.string = t;
        o.fontSize = e;
        o.lineHeight = e;
        i && (this.color = i);
    }
    return this;
};

cc.Node.prototype.qsetLabelString = function (t, e, i) {
    let o = this.getComponent(cc.Label);
    if (o) {
        o.stringKey = "";
        o.string = "string" == typeof t ? t : t + "";
        if (void 0 !== e) {
            o.fontSize = e;
            o.lineHeight = e;
        }
        i && (this.color = i);
    }
    return this;
};

cc.Node.prototype.qsetRichTextString = function (t, e, i) {
    let o = this.getComponent(cc.RichText);
    if (o) {
        o.stringKey = "";
        o.string = "string" == typeof t ? t : t + "";
        if (void 0 !== e) {
            o.fontSize = e;
            o.lineHeight = e;
        }
        i && (this.color = i);
    }
    return this;
};

cc.Node.prototype.qupdateLabelImmediately = function () {
    let t = this.getComponent(cc.Label);
    t && t._updateRenderData(!0);
    return this;
};

cc.Node.prototype.qsetAntiAliasTexture = function (t) {
    let e = this.getComponent(cc.Sprite);
    e && e.spriteFrame && e.spriteFrame._texture && (t ? e.spriteFrame._texture.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR) : e.spriteFrame._texture.setFilters(cc.Texture2D.Filter.NEAREST, cc.Texture2D.Filter.NEAREST));
    return this;
};