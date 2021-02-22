var _screenSizes = [{
    width: 0,
    height: 0
}, {
    width: 240,
    height: 320
}, {
    width: 320,
    height: 480
}, {
    width: 480,
    height: 800
}, {
    width: 480,
    height: 854
}, {
    width: 540,
    height: 960
}, {
    width: 640,
    height: 960
}, {
    width: 640,
    height: 1136
}, {
    width: 720,
    height: 1280
}, {
    width: 750,
    height: 1334
}, {
    width: 768,
    height: 1024
}, {
    width: 1080,
    height: 1920
}, {
    width: 1536,
    height: 2048
}, {
    width: 1125,
    height: 2436
}, {
    width: 1242,
    height: 2688
}, {
    width: 828,
    height: 1792
}, {
    width: 720,
    height: 1558
}], Screen = {
    NONE: 0,
    S240_320: 1,
    S320_480: 2,
    S480_800: 3,
    S480_854: 4,
    S540_960: 5,
    S640_960: 6,
    S640_1136: 7,
    S720_1280: 8,
    S750_1334: 9,
    S768_1024: 10,
    S1080_1920: 11,
    S1536_2048: 12,
    S1125_2436: 13,
    S1242_2688: 14,
    S828_1792: 15,
    S720_1558: 16
};

be.Device = {
    Screen: Screen,
    _deviceScreenSize: {
        width: 375,
        height: 667
    },
    _screenOrientation: 1,
    get deviceScreenSize() {
        return this._deviceScreenSize;
    },
    get screenOrientation() {
        return this._screenOrientation;
    },
    _designedDefaultScreen: 8,
    _designedScreens: [8],
    _designedScreen: 8,
    get designedDefaultScreen() {
        return this._designedDefaultScreen;
    },
    get designedScreens() {
        return this._designedScreens;
    },
    get designedScreen() {
        return this._designedScreen;
    },
    get designedScreenSize() {
        return _screenSizes[this._designedScreen];
    },
    _designedResolutionSize: {
        width: 720,
        height: 1280
    },
    _screenSize: {
        width: 720,
        height: 1280
    },
    _notchScreen: !1,
    _safeAreaNDC: new cc.Rect(0, 0, 1, 1),
    _safeArea: new cc.Rect(0, 0, 720, 1280),
    _adapterSizeRatioForMatchHeight: 1,
    get designedResolutionSize() {
        return this._designedResolutionSize;
    },
    get screenSize() {
        return this._screenSize;
    },
    get notchScreen() {
        return this._notchScreen;
    },
    get safeAreaNDC() {
        return this._safeAreaNDC;
    },
    get safeArea() {
        return this._safeArea;
    },
    get adapterSizeRatioForMatchHeight() {
        return this._adapterSizeRatioForMatchHeight;
    },
    initialize: function () {
        this._initialized = !0;
        this._initialize();
        cc.sys.isMobile ? window.addEventListener("resize", this.onResized.bind(this)) : cc.view.on("canvas-resize", this.onResized, this);
    },
    _initialize: function () {
        if (this._initialized) {
            this._deviceScreenSize = {
                width: cc.view._frameSize.width,
                height: cc.view._frameSize.height
            };
            this._designedResolutionSize = {
                width: cc.view._designResolutionSize.width,
                height: cc.view._designResolutionSize.height
            };
            this._screenSize = {
                width: cc.view._visibleRect.width,
                height: cc.view._visibleRect.height
            };
            this._safeArea.x = this._safeAreaNDC.x * this._screenSize.width;
            this._safeArea.y = this._safeAreaNDC.y * this._screenSize.height;
            this._safeArea.width = this._safeAreaNDC.width * this._screenSize.width;
            this._safeArea.height = this._safeAreaNDC.height * this._screenSize.height;
            this._screenSize.height / this._screenSize.width < 1.5 && (this._adapterSizeRatioForMatchHeight = this._designedResolutionSize.width / (this._designedResolutionSize.height * this._screenSize.width / this._screenSize.height));
            this._initScreen();
            CC_DEBUG && be.logD("Device._initialize", this._designedScreen + "(" + this.designedScreenSize.width + "x" + this.designedScreenSize.height + ")", "(" + this._designedResolutionSize.width + "x" + this._designedResolutionSize.height + ") -> ", "(" + this._screenSize.width + "x" + this._screenSize.height + ")");
        }
    },
    _initScreen: function () {
        // let e = be.AppInfo.getProperty("__screens");
        // if (e) {
        //     this._designedScreens.length = 0;
        //     e.split(",").forEach(e => {
        //         this._designedScreens.push(parseInt(e));
        //     });
        //     this._designedDefaultScreen = parseInt(be.AppInfo.getProperty("__default_screen"));
        //     this._designedScreens.find(e => e == this._designedDefaultScreen) || be.logE("Locale error config:", this._designedDefaultScreen, " not in ", this._designedScreens);
        // }
        this._designedScreen = this._designedDefaultScreen;
        if (this._designedScreens.length <= 1) return;
        let i = this.getDeviceScreenSize(!0), t = i.height / i.width;
        this._designedScreen = this._designedScreens[0];
        let s = _screenSizes[this._designedScreen], n = s.height / s.width, h = [];
        this._designedScreens.forEach(e => {
            let i = _screenSizes[e], s = i.height / i.width;
            if (Math.abs(n - s) < .12) h.push(e); else if (Math.abs(s - t) < Math.abs(n - t)) {
                h.length = 0;
                n = s;
                h.push(e);
            }
        });
        this._designedScreen = h[0];
        s = _screenSizes[this._designedScreen];
        h.forEach(e => {
            let t = _screenSizes[e];
            if (Math.abs(t.width - i.width) < Math.abs(s.width - i.width)) {
                this._designedScreen = e;
                s = _screenSizes[this._designedScreen];
            }
        });
    },
    onResized: function () {
        this._initialize();
    },
    isSingleScreen() {
        return this._designedScreens.length <= 1;
    },
    isScreenDesignedDefault() {
        return this._designedDefaultScreen === this._designedScreen;
    },
    getDeviceScreenSize: function (e) {
        let i = this._deviceScreenSize;
        e && i.width > i.height && (i = {
            width: i.height,
            height: i.width
        });
        return i;
    },
    isDeviceScreenPortrait: function () {
        return 1 == this._screenOrientation;
    },
    isDeviceScreenLandscape: function () {
        return 2 == this._screenOrientation;
    },
    getScreenSize: function () {
        return this._screenSize;
    },
    isNotchScreen: function () {
        return this._notchScreen;
    },
    getSafeAreaInNDC: function () {
        return this._safeAreaNDC;
    },
    getSafeArea: function () {
        return this._safeArea;
    },
    convertScreenRectToWorld: function (e, i) {
        let t = this._screenSize.width / this._deviceScreenSize.width, s = this._screenSize.height / this._deviceScreenSize.height, n = {
            x: e.x * t,
            y: e.y * s,
            width: e.width * t,
            height: e.height * s
        };
        (void 0 == i || i) && (n.y = this._screenSize.height - n.y - n.height);
        return n;
    },
    convertWroldRectToScreen: function (e, i) {
        let t = this._deviceScreenSize.width / this._screenSize.width, s = this._deviceScreenSize.height / this._screenSize.height, n = {
            x: e.x * t,
            y: e.y * s,
            width: e.width * t,
            height: e.height * s
        };
        (void 0 == i || i) && (n.y = this._deviceScreenSize.height - n.y - n.height);
        return n;
    },
    applyAutoResolutionPolicyToCanvas: function (e) {
        e instanceof cc.Node && (e = e.getComponent(cc.Canvas));
        e.applySettings();
        e.alignWithScreen();
        be.Device._initialize();
    },
    autoResolutionPolicy: function (e) {
        if (!this._initialized) return e;
        if (void 0 !== this._resolutionPolicy) return this._resolutionPolicy;
        this._resolutionPolicy = cc.ResolutionPolicy.FIXED_WIDTH;
        if (CC_WECHATGAME) return this._resolutionPolicy;
        if (this.isSingleScreen()) if (this._deviceScreenSize.height > this._deviceScreenSize.width) {
            this._resolutionPolicy = cc.ResolutionPolicy.FIXED_WIDTH;
            this._deviceScreenSize.height / this._deviceScreenSize.width <= 1.34 ? this._resolutionPolicy = cc.ResolutionPolicy.SHOW_ALL : this._deviceScreenSize.height / this._deviceScreenSize.width < this._designedResolutionSize.height / this._designedResolutionSize.width && (this._resolutionPolicy = cc.ResolutionPolicy.EXACT_FIT);
        } else {
            this._resolutionPolicy = cc.ResolutionPolicy.FIXED_HEIGHT;
            this._deviceScreenSize.width / this._deviceScreenSize.height <= 1.34 ? this._resolutionPolicy = cc.ResolutionPolicy.SHOW_ALL : this._deviceScreenSize.width / this._deviceScreenSize.height < this._designedResolutionSize.width / this._designedResolutionSize.height && (this._resolutionPolicy = cc.ResolutionPolicy.EXACT_FIT);
        } else this._deviceScreenSize.height / this._deviceScreenSize.width < this._designedResolutionSize.height / this._designedResolutionSize.width ? this._resolutionPolicy = cc.ResolutionPolicy.FIXED_HEIGHT : this._resolutionPolicy = cc.ResolutionPolicy.FIXED_WIDTH;
        return this._resolutionPolicy;
    }
};

module.exports = be.Device;