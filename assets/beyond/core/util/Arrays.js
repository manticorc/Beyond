be.Arrays = {
    first: function (t) {
        return t.length > 0 ? t[0] : void 0;
    },
    last: function (t) {
        return t.length > 0 ? t[t.length - 1] : void 0;
    },
    contains: function (t, n) {
        return !!t.find(t => t === n);
    },
    copy: function (t, n) {
        let r = [];
        n ? t.forEach((i, o) => {
            n(i, o, t) && r.push(i);
        }) : r = r.concat(t);
        return r;
    },
    shuffle: function (t) {
        for (var n = [], r = 0; r < t.length; r++) n[r] = r;
        if (n.length > 1) for (r = 0; r < n.length - 1; r++) {
            var i = be.Random.nextInt(n.length - r), o = n[i];
            n.splice(i, 1);
            n.push(o);
        }
        var e = [];
        for (r = 0; r < t.length; r++) e[r] = t[n[r]];
        return e;
    },
    rforEachBreak: function (t, n, r, i) {
        (r = void 0 !== r ? r : t.length - 1) >= (i = void 0 !== i ? i : 0) && this._forEach(t, n, !0, r, i);
    },
    rforEach: function (t, n, r, i) {
        (r = void 0 !== r ? r : t.length - 1) >= (i = void 0 !== i ? i : 0) && this._forEach(t, n, !1, r, i);
    },
    forEachBreak: function (t, n, r, i) {
        (r = void 0 !== r ? r : 0) <= (i = void 0 !== i ? i : t.length - 1) && this._forEach(t, n, !0, r, i);
    },
    forEach: function (t, n, r, i) {
        (r = void 0 !== r ? r : 0) <= (i = void 0 !== i ? i : t.length - 1) && this._forEach(t, n, !1, r, i);
    },
    _forEach: function (t, n, r, i, o) {
        if (i <= o) {
            i = Math.max(i, 0);
            o = Math.min(o, t.length - 1);
            for (let e = i; e <= o; e++) {
                let i = n(t[e], e, t);
                if (r && !i) break;
            }
        } else {
            i = Math.min(i, t.length - 1);
            o = Math.max(o, 0);
            for (let e = i; e >= o; e--) {
                let i = n(t[e], e, t);
                if (r && !i) break;
            }
        }
    },
    find: function (t, n, r) {
        let i = this.findIndex(t, n, r);
        if (i >= 0) return t[i];
    },
    findIndex: function (t, n, r) {
        for (let i = void 0 !== r ? Math.max(r, 0) : 0; i < t.length; i++) if (n(t[i], i, t)) return i;
        return -1;
    },
    rfind: function (t, n, r) {
        let i = this.rfindIndex(t, n, r);
        if (i >= 0) return t[i];
    },
    rfindIndex: function (t, n, r) {
        for (let i = void 0 !== r ? Math.min(r, t.length - 1) : t.length - 1; i >= 0; i--) if (n(t[i], i, t)) return i;
        return -1;
    }
};

Array.prototype.first || (Array.prototype.first = function () {
    return be.Arrays.first(this);
});

Array.prototype.last || (Array.prototype.last = function () {
    return be.Arrays.last(this);
});

Array.prototype.contains || (Array.prototype.contains = function (t) {
    return be.Arrays.contains(this, t);
});