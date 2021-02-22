be.ListenerHub = function () {
    this._serialnumber = 1;
    this._listeners = {};
    this._pausedEvents = {};
    this.reg = function (e, t, s) {
        let i = this._listeners[e];
        i || (i = this._listeners[e] = []);
        i.find(e => e.callback === t && e.target === s) || i.push({
            callback: t,
            target: s
        });
    };
    this.unreg = function (e, t, s) {
        if (!this._listeners[e]) return;
        let i = this._listeners[e], n = i.findIndex(e => e.callback === t && e.target === s);
        n >= 0 && i.splice(n, 1);
    };
    this.clear = function (e) {
        void 0 !== e ? this._listeners[e] = [] : this._listeners = {};
    };
    this.fire = function (e, t) {
        if (!this._listeners[e]) return;
        let s = {
            id: this._serialnumber++,
            type: e
        };
        void 0 !== t && (s.data = t);
        let i = this._pausedEvent(e);
        i.paused ? i.events.push(s) : this._fireEvent(s);
    };
    this._fireEvent = function (e) {
        this._listeners[e.type].forEach(t => {
            t.target ? t.callback.call(t.target, e) : t.callback(e);
        });
    };
    this._pausedEvent = function (e) {
        this._pausedEvents[e] || (this._pausedEvents[e] = {
            paused: !1,
            events: []
        });
        return this._pausedEvents[e];
    };
    this.pause = function (e) {
        if (void 0 !== e) this._pausedEvent(e).paused = !0; else for (var t in this._listeners) this._pausedEvent(t).paused = !0;
    };
    this.resume = function (e) {
        if (void 0 !== e) this._resume(e); else for (var t in this._listeners) this._resume(t);
    };
    this._resume = function (e) {
        let t = this._pausedEvent(e);
        t.paused && t.events.forEach(e => {
            this._fireEvent(e);
        });
        t.paused = !1;
    };
};