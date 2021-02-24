gs.Settings = {
    sound: true,
    vibrate: true,
    gameAutox : false,
    hideNoticePop:true,

    init: function () {
        this.vibrate = cc.sys.os != cc.sys.OS_ANDROID;
        let data = be.DataStorage.getJson('settings');
        if (data) {
            this.sound = data.sound;
            this.vibrate = data.vibrate;
            this.gameAutox = data.gameAutox;
            this.hideNoticePop = data.hideNoticePop;
        }
    },

    save: function () {
        be.DataStorage.setJson("settings", {
            "sound": this.sound,
            "vibrate": this.vibrate,
            "gameAutox": this.gameAutox,
            "hideNoticePop": this.hideNoticePop
        });
    },

    _refreshAutoXSetting: function () { 
        this.gameAutox = gs.Settings.getSetting_zdtx() == 1;
        this.save();
    }
};

//针对自动填x进行AB测试；
//增加开关zdtx，控制设置中的自动填x选项默认情况，=0时默认关闭；=1时默认开启；默认值=0；
gs.Settings.getSetting_zdtx = function (mapValues) { 
    if (this._setting_zdtx === undefined) {
        this._setting_zdtx = be.AppInfo.getSettingAsInt("zdtx", 0);
        if (CC_DEV) { // 测试
            // this._setting_scyd = 0;
        }
    }
    if (mapValues !== undefined) {
        let value = mapValues[this._setting_zdtx];
        be.assert(value !== undefined, "");
        return value;
    } else {
        return this._setting_zdtx;
    }   
}

module.exports = gs.Settings;