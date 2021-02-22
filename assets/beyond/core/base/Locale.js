var _languageNames = ["", "en", "zh-Hans", "zh-Hant", "ja", "ko", "ru", "fr", "es", "pt", "it", "de"], Type = {
    default: 0,
    en: 1,
    zh_hans: 2,
    zh_hant: 3,
    ja: 4,
    ko: 5,
    ru: 6,
    fr: 7,
    es: 8,
    pt: 9,
    it: 10,
    de: 11
}, _messageBundle = null, loadMessageBundle = function (e) {
    _messageBundle = null;
    let a = "message-bundle";
    e.isLanguageDesigned() || (a = e.languageName + "/" + a);
    cc.loader.loadRes(a, function (e, a) {
        if (e) {
            be.logE(e);
            _messageBundle = {};
        } else _messageBundle = a.json;
    });
};

be.Locale = {
    Type: Type,
    _systemLanguageName: "",
    _designedDefaultLanguage: 2,
    _designedLanguages: [2],
    _language: 2,
    _messageBundle: null,
    get systemLanguageName() {
        return this._systemLanguageName;
    },
    get designedDefaultLanguage() {
        return this._designedDefaultLanguage;
    },
    get designedLanguages() {
        return this._designedLanguages;
    },
    get language() {
        return this._language;
    },
    set language(e) {
        if (this._designedLanguages.find(a => e === a)) {
            this._language = e;
            loadMessageBundle(this);
        }
    },
    get languageName() {
        return _languageNames[this._language];
    },
    get prepared() {
        return !!_messageBundle;
    },
    initialize: function () {
        let e = cc.sys.language;
        be._env && be._env.dev && be._env.dev.systemLanguage ? e = be._env.dev.systemLanguage : "zh" === e && (e = "zh-Hans");
        let a = be.AppInfo.getProperty("__languages");
        if (a) {
            this._designedLanguages.length = 0;
            a.split(",").forEach(e => {
                this._designedLanguages.push(parseInt(e));
            });
            this._designedDefaultLanguage = parseInt(be.AppInfo.getProperty("__default_language"));
            this._designedLanguages.find(e => e == this._designedDefaultLanguage) || be.logE("Locale error config:", this._designedDefaultLanguage, " not in ", this._designedLanguages);
        }
        this._systemLanguageName = e;
        this._language = this._designedLanguages[0];
        for (var g = !1, s = 0; s < this._designedLanguages.length; s++) {
            let e = this._designedLanguages[s];
            if (this._systemLanguageName == _languageNames[e]) {
                this._language = e;
                g = !0;
            }
        }
        if (!g) {
            var n = [[Type.zh_hans, Type.zh_hant], [Type.zh_hant, Type.zh_hans]];
            for (s = 0; s < n.length; s++) if (this._systemLanguageName == _languageNames[n[s][0]] && this._designedLanguages.find(e => e == n[s][1])) {
                this._language = n[s][1];
                g = !0;
                break;
            }
        }
        CC_DEBUG && be.logD("Locale.initialize", e + " -> " + this._systemLanguageName + " -> " + this.languageName);
        loadMessageBundle(this);
    },
    isSingleLanguage() {
        return this._designedLanguages.length <= 1;
    },
    isLanguageDesigned() {
        return this._designedDefaultLanguage === this.language;
    },
    getPlainMessage(e) {
        let a = _messageBundle ? _messageBundle[e] : null;
        return a || "[" + e + "]";
    },
    getMessage(e) {
        let a = this.getPlainMessage(e);
        if (arguments.length <= 1) return a;
        let g = "", s = 0, n = a.indexOf("%"), t = 1;
        for (; n >= s && t < arguments.length;) {
            let e = a.charAt(n + 1);
            if ("%" === e) {
                g += a.substring(s, n);
                g += "%";
                s = n + 2;
                n = a.indexOf("%", s);
            } else if ("s" === e || "d" === e) {
                g += a.substring(s, n);
                g += arguments[t++];
                s = n + 2;
                n = a.indexOf("%", s);
            }
        }
        return g += a.substring(s);
    },
    getResourcePath(e) {
        if (this.isSingleLanguage()) return e;
        for (let a = this._designedLanguages.length; --a >= 0;) {
            let g = _languageNames[this._designedLanguages[a]];
            if (e.startsWith(g + "/")) {
                e.substring(g.length + 1);
                break;
            }
        }
        return this.isLanguageDesigned() ? e : this.languageName + "/" + e;
    }
};

module.exports = be.Locale;