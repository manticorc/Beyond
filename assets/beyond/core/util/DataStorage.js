// require("../../../cocos2d/core");

be.DataStorage = {
    setSecretKey: function (e) {
        this._secretKey = e;
    },
    _enc: function (e) {
        if (this._secretKey) {
            e = require("encryptjs").encrypt(e, this._secretKey, 256);
        }
        return e;
    },
    _dec: function (e) {
        if (this._secretKey) {
            e = require("encryptjs").decrypt(e, this._secretKey, 256);
        }
        return e;
    },
    getString: function (e, t) {
        let r = this.getItem(e);
        return r || (void 0 != t ? t : "");
    },
    getInteger: function (e, t) {
        let r = this.getItem(e);
        return r ? parseInt(r) : void 0 != t ? t : 0;
    },
    getFloat: function (e, t) {
        let r = this.getItem(e);
        return r ? parseFloat(r) : void 0 != t ? t : 0;
    },
    getJson: function (e, t) {
        let r = cc.sys.localStorage.getItem(e);
        if (r) try {
            return JSON.parse(r);
        } catch (t) {
            be.logE("Storage.getJson '%s'", e, t);
        }
        return void 0 != t ? t : null;
    },
    setJson: function (e, t) {
        t = JSON.stringify(t);
        cc.sys.localStorage.setItem(e, t);
    },
    getItem: function (e, t) {
        let r = cc.sys.localStorage.getItem(e);
        return r || (void 0 != t ? t : null);
    },
    setItem: function (e, t) {
        return cc.sys.localStorage.setItem(e, t);
    },
    removeItem: function (e) {
        return cc.sys.localStorage.removeItem(e);
    },
    clear: function () {
        return cc.sys.localStorage.clear();
    }
};