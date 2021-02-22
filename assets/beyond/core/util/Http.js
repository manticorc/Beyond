be.Http = {
    _do: function (e) {
        let o = new XMLHttpRequest();
        e.responseType && (o.responseType = e.responseType);
        o.onload = function () {
            if (200 == o.status) {
                CC_DEBUG && be.logD(e.method + " " + e.url + " resp.type=" + o.responseType);
                "arraybuffer" == o.responseType ? e.onLoad(o.response) : "json" == o.responseType ? e.onLoad(o.response) : e.onLoad(o.responseText);
            } else {
                CC_DEBUG && be.logD(e.method + " " + e.url + " resp.status=" + o.status);
                e.onError && e.onError(o.status, o.statusText);
            }
        };
        o.onerror = function () {
            CC_DEBUG && be.logD(e.method + " " + e.url + " error resp.status=" + o.status);
            e.onError && e.onError(o.status, o.statusText);
        };
        o.ontimeout = function () {
            CC_DEBUG && be.logD(e.method + " " + e.url + " timeout resp.status=" + o.status);
            e.onError && e.onError(o.status, o.statusText);
        };
        o.open(e.method, e.url, !0);
        o.setRequestHeader("Access-Control-Allow-Origin", "*");
        e.data ? o.send(e.data) : o.send();
    },
    doGET: function (e, o, t) {
        let s;
        if (e.url) s = e; else {
            s = {
                url: e,
                onLoad: o
            };
            t && (s.responseType = t);
        }
        s.method = "GET";
        this._do(s);
    },
    doPOST: function (e, o, t, s) {
        let r;
        if (e.url) r = e; else {
            r = {
                url: e,
                data: o,
                onLoad: t
            };
            s && (r.responseType = s);
        }
        r.method = "POST";
        this._do(r);
    }
};

module.exports = be.Http;