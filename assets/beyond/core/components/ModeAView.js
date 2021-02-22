const ModeAView = cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        menu: "i18n:MAIN_MENU.component.ui/BEModeAView"
    },
    properties: {
        banner: cc.Node,
        bannerOffset: {
            default: 0,
            tooltip: CC_DEV && "Banner停靠位置偏移量(下方)"
        },
        body: cc.Node,
        offsetTop: 0,
        offsetBottom: 0,
        screenAdapted: {
            default: !0,
            tooltip: CC_DEV && "屏幕适配，全屏模式下使用"
        },
        extendViewport: {
            default: !0,
            tooltip: CC_DEV && "将显示扩展至屏幕上部的非安全区域"
        }
    },
    onLoad() {
        be.logD(this.name + ".onLoad");
        this._init();
    },
    _init() {
        this._viewport = this.node.qgetChild("view");
        this._content = this._viewport.qgetChild("content");
        this._content.qtransferAnchorPoint(be.anchorTopLeft);
        this._prepare();
    },
    _prepare() {
        let e = 0;
        if (this.screenAdapted) {
            let t = be.Device.getScreenSize(), i = be.Device.getSafeArea();
            e = t.height - i.yMax;
            this.banner.setContentSize(t.width, this.banner.height);
            let n = this.banner.height, o = 0;
            if (this.body) {
                let e = this._content.children;
                for (let i = e.length; --i >= 0;) {
                    let n = e[i];
                    if (n !== this.banner && n !== this.body) {
                        n.setContentSize(t.width, n.height);
                        o += n.height;
                    }
                }
            }
            this.node.setContentSize(t.width, i.height - this.offsetBottom + (this.extendViewport ? e : 0));
            this.node.qsetWorldAlign(be.anchorTopLeft, 0, this.extendViewport ? t.height : i.yMax);
            this._viewport.setContentSize(this.node.getContentSize());
            this._content.setContentSize(this.node.width, this.node.height + n);
            this._content.qsetAlignWithParent(be.anchorTopLeft);
            let h = this.node.height - this.bannerOffset - o - (this.extendViewport ? e : 0);
            this.body.setContentSize(this.node.width, h);
            this.body.qfind("view").setContentSize(this.node.width, h);
            this.body.qfind("view/content").setContentSize(this.node.width, h);
            this.body.qfind("view/content").qsetAlignWithParent(be.anchorTopLeft);
        }
        be.UI.doLayout(this._content, {
            type: be.UI.LayoutType.VERTICAL,
            space: 0
        });
        let t = this._viewport.qlocalRect();
        this._content.qlocalRect();
        this.minPos = cc.Vec2.ZERO;
        this.maxPos = cc.Vec2.ZERO;
        this.minPos.y = t.yMax;
        this.maxPos.y = t.yMax + this.banner.height - this.bannerOffset - (this.extendViewport ? e : 0);
    }
});

be.ModeAView = module.exports = ModeAView;