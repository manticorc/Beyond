var _asyncFileDecompressCallback, _asyncFileDecompressCallbackTarget, _formatNumber_2 = function (e) {
    return e < 10 ? "0" + e : e;
}, _formatNumber_3 = function (e) {
    return e < 10 ? "00" + e : e < 100 ? "0" + e : e;
};

be.Date = {
    currentTimeMillis: function () {
        return new Date().getTime();
    },
    currentUnixTimestamp: function () {
        return Math.trunc(this.currentTimeMillis() / 1e3);
    },
    currentTimeString: function (e, r) {
        return this.format(new Date(), e, r);
    },
    format: function (e, r, t) {
        r = void 0 != r ? r : 3;
        let a = t || "-";
        switch (r) {
            case 1:
                return e.getFullYear();

            case 2:
                return e.getFullYear() + a + _formatNumber_2(e.getMonth() + 1);

            case 3:
                return e.getFullYear() + a + _formatNumber_2(e.getMonth() + 1) + a + _formatNumber_2(e.getDate());

            case 4:
                return e.getFullYear() + a + _formatNumber_2(e.getMonth() + 1) + a + _formatNumber_2(e.getDate()) + " " + _formatNumber_2(e.getHours());

            case 5:
                return e.getFullYear() + a + _formatNumber_2(e.getMonth() + 1) + a + _formatNumber_2(e.getDate()) + " " + _formatNumber_2(e.getHours()) + ":" + _formatNumber_2(e.getMinutes());

            case 6:
                return e.getFullYear() + a + _formatNumber_2(e.getMonth() + 1) + a + _formatNumber_2(e.getDate()) + " " + _formatNumber_2(e.getHours()) + ":" + _formatNumber_2(e.getMinutes()) + ":" + _formatNumber_2(e.getSeconds());

            case 7:
                return e.getFullYear() + a + _formatNumber_2(e.getMonth() + 1) + a + _formatNumber_2(e.getDate()) + " " + _formatNumber_2(e.getHours()) + ":" + _formatNumber_2(e.getMinutes()) + ":" + _formatNumber_2(e.getSeconds()) + "." + _formatNumber_3(e.getMilliseconds());
        }
        return "";
    }
};

be.Random = {
    nextInt: function (e, r) {
        return void 0 !== r && r > e ? e + Math.trunc(1e7 * Math.random()) % (r - e) : e > 0 ? Math.trunc(1e7 * Math.random()) % e : 0;
    }
};

be.Zip = {
    asyncFileDecompress: function (e, r, t, a) {
        _asyncFileDecompressCallback = t;
        _asyncFileDecompressCallbackTarget = a;

        _asyncFileDecompressCallbackTarget ? _asyncFileDecompressCallback.call(_asyncFileDecompressCallbackTarget, 1) : _asyncFileDecompressCallback(1);
        CC_DEBUG && be.logD("Zip.asyncFileDecompress is not supported @" + cc.sys.os + "-" + cc.sys.platform);
        
    }
};