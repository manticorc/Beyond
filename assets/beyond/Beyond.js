/****************************************************************************
 Copyright (c) 2018-2098 Beyond.
 Modified Time: Wed Jun 19 2019 12:47:15 GMT+0800 (GMT+08:00)
 ****************************************************************************/

var _global = typeof window === 'undefined' ? global : window;
_global._be = _global._be || { available : false };
_global.be = {};
_global.gs = {}; // namespace for game

/////////////////////////////////////////////////////////////////
be.logD = function (format, args) {
    if (CC_DEBUG) {
        cc.log.apply(this, arguments);
    }
};
be.logI = function (format, args) {
    cc.log.apply(this, arguments);
};
be.logW = function (format, args) {
    cc.log.apply(this, arguments);
};
be.logE = function (format, args) {
    cc.error.apply(this, arguments);
};

be.assert = function (cond, msg) {
    if (CC_DEBUG) {
        cc.assert(cond, msg);
    }
};

require('./core/base/App');

if (CC_DEV || CC_WECHATGAME) { // PURE_JS_ENV
    // require('./purejs/base/App');
}