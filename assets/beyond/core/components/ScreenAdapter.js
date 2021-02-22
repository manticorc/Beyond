var AlignMode = cc.Enum({
    CUSTOM: 0,
    TOP: 1,
    BOTTOM: 2,
    LEFT: 4,
    RIGHT: 8,
    VCENTER: 16,
    HCENTER: 32,
    CENTER: 48
});

const ScreenAdapter = cc.Class({
    extends: cc.Component,
    editor: {
        menu: "i18n:MAIN_MENU.component.ui/BEScreenAdapter"
    },
    properties: {
        alignMode: {
            default: AlignMode.CUSTOM,
            type: AlignMode
        },
        alignPosition: {
            default: cc.v2(0, 0),
            tooltip: "相对屏幕的位置坐标，使用归一化坐标系，(0,0)表示左下角，(1,1)表示右上角"
        },
        alignAnchor: {
            default: cc.v2(0, 0),
            tooltip: "对齐基准点"
        },
        offset: cc.Vec2
    },
    onEnable() {
        let e = be.Device.getSafeArea(), t = this.node;
        switch (this.alignMode) {
            case AlignMode.TOP:
                t.y = t.parent.convertToNodeSpaceAR(cc.v2(t.x, e.yMax)).y + this.offset.y + t.qgetContentSize().height * t._scale.y * (t._anchorPoint.y - 1);
                break;

            case AlignMode.BOTTOM:
                t.y = t.parent.convertToNodeSpaceAR(cc.v2(t.x, e.yMin)).y + this.offset.y + t.qgetContentSize().height * t._scale.y * (t._anchorPoint.y - 0);
                break;

            case AlignMode.VCENTER:
                t.y = t.parent.convertToNodeSpaceAR(cc.v2(t.x, e.center.y)).y + this.offset.y + t.qgetContentSize().height * t._scale.y * (t._anchorPoint.y - .5);
                break;

            case AlignMode.LEFT:
                t.x = t.parent.convertToNodeSpaceAR(cc.v2(e.xMin, t.y)).x + this.offset.x + t.qgetContentSize().width * t._scale.x * (t._anchorPoint.x - 0);
                break;

            case AlignMode.RIGHT:
                t.x = t.parent.convertToNodeSpaceAR(cc.v2(e.xMax, t.y)).x + this.offset.x + t.qgetContentSize().width * t._scale.x * (t._anchorPoint.x - 1);
                break;

            case AlignMode.HCENTER:
                t.x = t.parent.convertToNodeSpaceAR(cc.v2(e.center.x, t.y)).x + this.offset.x + t.qgetContentSize().width * t._scale.x * (t._anchorPoint.x - .5);
                break;

            case AlignMode.CENTER:
                t.qsetWorldAlign(be.anchorCenter, e.center);
                break;

            case AlignMode.CUSTOM:
                this.alignPosition.x = e.xMin + e.width * Math.max(0, Math.min(1, this.alignPosition.x));
                this.alignPosition.y = e.yMin + e.height * Math.max(0, Math.min(1, this.alignPosition.y));
                this.alignAnchor.x = Math.max(0, Math.min(1, this.alignAnchor.x));
                this.alignAnchor.y = Math.max(0, Math.min(1, this.alignAnchor.y));
                t.qsetWorldAlign(this.alignAnchor, this.alignPosition);
        }
    },
    onDisable() { }
});

be.ScreenAdapter = module.exports = ScreenAdapter;