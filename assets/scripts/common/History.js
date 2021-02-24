gs.History = {
    _data: {}, //
    essential: {}, // 基本信息
    init: function () {
        this._data = be.DataStorage.getJson("history", {});

        this.essential = this.getData("essential", {
            appver: 0,
            installTime: 0, // 安装时间
            launchTimes: 0, // 启动次数
            lastLaunchTime: 0, // 最近启动时间
        })
     
        this.updateEssential();
    },

    save: function () {
        be.DataStorage.setJson("history", this._data);
    },

    getData: function (name, defaultValue) {
        if (this._data[name] === undefined && defaultValue !== undefined) {
            this._data[name] = defaultValue;
        }
        return this._data[name];
    },

    setData: function (name, value) {
        this._data[name] = value;
        this.save();
    },

    // =======================================================================
    updateEssential() {
        this.essential.appver = 0;
        if (this.essential.installTime == 0) {
            this.essential.installTime = be.Date.currentTimeMillis();
        }
        this.essential.lastLaunchTime = be.Date.currentTimeMillis();
        this.essential.launchTimes++;
        this.save();
    },
};

module.exports = gs.History;