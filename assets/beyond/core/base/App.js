be.App = {
    initialize: function () {
        be.Device.initialize();
        be.Locale.initialize();
        be.AssetAdaptor.initialize();
        this.setDefaultFrameRate();
    },

    exit: function () {
        cc.game.end();
    },

    pause: function () {
        cc.game.pause();
    },

    resume: function () {
        cc.game.resume();
    },

    _frameRateNormal: 30,
    _frameRateHigh: 60,
    _frameRateTokens: [],
    _frameRateTokenSeed: 1,

    setDefaultFrameRate: function (e, t) {
        e && (this._frameRateNormal = e);
        t && (this._frameRateHigh = t);
        this._setFrameRate(this._frameRateNormal);
    },

    _setFrameRate: function (e) {
        e != cc.game.getFrameRate() && cc.game.setFrameRate(e);
    },

    genFrameRateToken: function () {
        return this._frameRateTokenSeed++;
    },

    requireHighFrameRate: function (e) {
        if (this._frameRateNormal !== this._frameRateHigh) {
            if (e) {
                this._frameRateTokens.findIndex(t => t === e) < 0 && this._frameRateTokens.push(e);
            }
            this._setFrameRate(this._frameRateHigh);
        }
    },

    resetFrameRate: function (e) {
        if (this._frameRateNormal !== this._frameRateHigh) {
            if (e) {
                let t = this._frameRateTokens.findIndex(t => t === e);
                t >= 0 && this._frameRateTokens.splice(t, 1);
            } else this._frameRateTokens.length = 0;
            0 === this._frameRateTokens.length && this._setFrameRate(this._frameRateNormal);
        }
    }
}
module.exports = be.App;