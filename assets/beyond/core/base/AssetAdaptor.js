be.AssetAdaptor = {
    initialize() {
        this._assetsPathMap = cc.js.createMap(!0);
        this._assetsUuidMap = cc.js.createMap(!0);
        let e, t, i = [];
        be.Locale.isSingleLanguage() || be.Locale.isLanguageDesigned() || (i = [e = be.Locale.languageName]);
        be.Device.isSingleScreen() || be.Device.isScreenDesignedDefault() || (i = [t = "v" + be.Device.designedScreen]);
        e && t && (i = [e + "/" + t, t, e]);
        let r = cc.loader._resources._pathToUuid;
        for (let e in r) for (let t = 0; t < i.length && !this._createMap(r, e, i[t] + "/" + e); t++);
    },
    _createMap(e, t, i) {
        var r = e[t], a = e[i];
        if (!a) return !1;
        if (r instanceof Array && r.length === a.length) {
            for (var s = r.length; --s >= 0;) if (r[s].type !== a[s].type) {
                be.logW("AssetAdaptor._createMap ", t + " ~" + i);
                return !0;
            }
            this._assetsPathMap[t] = i;
            for (s = r.length; --s >= 0;) {
                var c = r[s], u = a[s];
                this._assetsUuidMap[c.uuid] = {
                    uuid: u.uuid,
                    type: u.type,
                    path: i
                };
                if (c.type === cc.SpriteAtlas) {
                    let e = cc.loader.getRes(t, cc.SpriteAtlas);
                    e ? e.getSpriteFrames().forEach(e => {
                        this._assetsUuidMap[e._uuid] = {
                            uuid: u.uuid,
                            type: u.type,
                            path: i
                        };
                    }) : cc.loader.loadRes(t, cc.SpriteAtlas, (e, t) => {
                        e || t.getSpriteFrames().forEach(e => {
                            this._assetsUuidMap[e._uuid] = {
                                uuid: u.uuid,
                                type: u.type,
                                path: i
                            };
                        });
                    });
                }
            }
        } else {
            u = a;
            if ((c = r).type === u.type) {
                this._assetsPathMap[t] = i;
                this._assetsUuidMap[c.uuid] = {
                    uuid: u.uuid,
                    type: u.type,
                    path: i
                };
            } else be.logW("AssetAdaptor._createMap ", t + " ~" + i);
        }
        return !0;
    },
    _getAssetsPathByUuid(e) {
        if (!e) return;
        let t = cc.loader._resources._pathToUuid;
        for (let i in t) {
            let r = t[i];
            if (r instanceof Array) {
                for (let t = r.length; --t >= 0;) if (r[t].uuid === e) return i;
            } else if (r.uuid === e) return i;
        }
        return null;
    },
    getAssetsPath(e) {
        if (this._assetsPathMap) {
            let t = this._assetsPathMap[e];
            return t || e;
        }
        return null;
    },
    getAssetsUuid(e) {
        if (this._assetsUuidMap) {
            let t = this._assetsUuidMap[e];
            return t || {
                uuid: e
            };
        }
        return null;
    },
    localizeSprite(e) {
        if (e._localized) return;
        if (!e.spriteFrame) return;
        let t = this.getAssetsUuid(e.spriteFrame._uuid);
        if (t) {
            e._localized = !0;
            if (t.uuid === e.spriteFrame._uuid) return;
            if (t.type === cc.SpriteAtlas) {
                let i = cc.loader.getRes(t.path, cc.SpriteAtlas);
                i ? e.spriteFrame = i.getSpriteFrame(e.spriteFrame.name) : cc.loader.loadRes(t.path, cc.SpriteAtlas, function (t, i) {
                    t || e.isValid && (e.spriteFrame = i.getSpriteFrame(e.spriteFrame.name));
                });
            } else if (t.type === cc.SpriteFrame) {
                let i = cc.loader.getRes(t.path, cc.SpriteFrame);
                i ? e.spriteFrame = i : cc.loader.loadRes(t.path, cc.SpriteFrame, function (t, i) {
                    t || e.isValid && (e.spriteFrame = i);
                });
            }
        }
    },
    localizeLabel(e) {
        if (!e.stringKey) return;
        if (e._localized) return;
        if (!be.Locale.prepared) return;
        e._localized = !0;
        if (!e.useSystemFont && e.font) {
            let t = this.getAssetsUuid(e.font._uuid);
            if (t && t.uuid !== e.font._uuid) {
                let i = cc.loader.getRes(t.path, cc.BitmapFont);
                i ? e.font = i : cc.loader.loadRes(t.path, cc.BitmapFont, function (t, i) {
                    t || (e.font = i);
                });
            }
        }
        let t = be.Locale.getPlainMessage(e.stringKey);
        t !== e.string && (e.string = t);
    },
    localizeRichText(e) {
        if (!e.stringKey) return;
        if (e._localized) return;
        if (!be.Locale.prepared) return;
        e._localized = !0;
        if (e.font) {
            let t = this.getAssetsUuid(e.font._uuid);
            if (t && t.uuid !== e.font._uuid) {
                let i = cc.loader.getRes(t.path, cc.BitmapFont);
                i ? e.font = i : cc.loader.loadRes(t.path, cc.BitmapFont, function (t, i) {
                    t || (e.font = i);
                });
            }
        }
        let t = be.Locale.getPlainMessage(e.stringKey);
        t !== e.string && (e.string = t);
    },
    localizeButton(e) {
        if (e.transition === cc.Button.Transition.SPRITE && !e._localized) for (var t = 1; t <= 4; t++) {
            if (r = this._buttonSpriteFrame(e, t)) {
                e._localized = !0;
                var i = this.getAssetsUuid(r._uuid);
                if (!i || i.uuid === r._uuid) continue;
                if (i.type === cc.SpriteAtlas) {
                    let a = cc.loader.getRes(i.path, cc.SpriteAtlas);
                    a ? this._buttonSpriteFrame(e, t, a.getSpriteFrame(r.name)) : cc.loader.loadRes(i.path, cc.SpriteAtlas, function (i, a) {
                        i || this._buttonSpriteFrame(e, t, a.getSpriteFrame(r.name));
                    });
                } else if (i.type === cc.SpriteFrame) {
                    var r;
                    (r = cc.loader.getRes(i.path, cc.SpriteFrame)) ? this._buttonSpriteFrame(e, t, r) : cc.loader.loadRes(i.path, cc.SpriteFrame, function (i, r) {
                        i || this._buttonSpriteFrame(e, t, r);
                    }.bind(this));
                }
            }
        }
    },
    _buttonSpriteFrame(e, t, i) {
        switch (t) {
            case 1:
                i && (e.normalSprite = i);
                return e.normalSprite;

            case 2:
                i && (e.pressedSprite = i);
                return e.pressedSprite;

            case 3:
                i && (e.hoverSprite = i);
                return e.hoverSprite;

            case 4:
                i && (e.disabledSprite = i);
                return e.disabledSprite;

            default:
                return null;
        }
    }
};

module.exports = be.AssetAdaptor;