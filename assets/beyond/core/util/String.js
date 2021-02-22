be.String = {
    _formatBytes: function (t) {
        for (var r = 0; r < t.length; r++) t[r] &= 255;
        return t;
    },
    convertToUTFBytes: function (t) {
        for (var r = [], e = 0; e < t.length; e++) {
            var n = t.charCodeAt(e);
            if (0 <= n && n <= 127) {
                1;
                r.push(n);
            } else if (128 <= n && n <= 2047) {
                2;
                r.push(192 | 31 & n >> 6);
                r.push(128 | 63 & n);
            } else if (2048 <= n && n <= 55295 || 57344 <= n && n <= 65535) {
                3;
                r.push(224 | 15 & n >> 12);
                r.push(128 | 63 & n >> 6);
                r.push(128 | 63 & n);
            }
        }
        for (e = 0; e < r.length; e++) r[e] &= 255;
        return r;
    },
    convertToUTFString: function (t) {
        for (var r = "", e = this._formatBytes(t), n = 0; n < e.length; n++) {
            var o = e[n].toString(2), i = o.match(/^1+?(?=0)/);
            if (i && 8 == o.length) {
                for (var g = i[0].length, s = e[n].toString(2).slice(7 - g), f = 1; f < g; f++) s += e[f + n].toString(2).slice(2);
                r += String.fromCharCode(parseInt(s, 2));
                n += g - 1;
            } else r += String.fromCharCode(e[n]);
        }
        return r;
    },
    convertToHexBytes: function (t) {
        for (var r = [], e = 0, n = Math.trunc(t.length / 2); e < n; e++) r[e] = parseInt(t.substring(2 * e, 2 * e + 2), 16);
        return r;
    },
    convertToHexString: function (t) {
        for (var r = "", e = this._formatBytes(t), n = 0; n < e.length; n++) {
            var o = e[n].toString(16);
            1 == o.length && (o = "0" + o);
            r += o;
        }
        return r;
    }
};

be.Long = {
    convertToBytes: function (t) {
        var r = t.toString(16);
        if (r.length > 16) r = r.substring(r.length - 16); else if (r.length < 16) for (let t = 16 - r.length; --t >= 0;) r = "0" + r;
        return be.String.convertToHexBytes(r);
    },
    convertToNumber: function (t) {
        var r = be.String.convertToHexString(t);
        return parseInt(r, 16);
    }
};

module.exports = be.String;