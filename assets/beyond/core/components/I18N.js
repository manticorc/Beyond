const I18N = cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        menu: "i18n:MAIN_MENU.component.ui/BEI18N"
    },
    properties: {
        stringKey: {
            get() {
                let e = this.getComponent(cc.Label);
                if (e) return e.stringKey ? e.stringKey : "";
                let t = this.getComponent(cc.RichText);
                return t ? t.stringKey ? t.stringKey : "" : "";
            },
            set(e) {
                let t = this.getComponent(cc.Label);
                t && (t.stringKey = e);
                let n = this.getComponent(cc.RichText);
                n && (n.stringKey = e);
                CC_EDITOR;
            },
            tooltip: CC_DEV && "在message-bundle中定义的key值，应用于cc.Label"
        }
    }
});

be.I18N = module.exports = I18N;