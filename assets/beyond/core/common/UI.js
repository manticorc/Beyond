var LayoutType = cc.Enum({
    NONE: 0,
    HORIZONTAL: 1,
    VERTICAL: 2
}), LayoutDirection = cc.Enum({
    LEFT_TO_RIGHT: 1,
    RIGHT_TO_LEFT: 2,
    TOP_TO_BOTTOM: 3,
    BOTTOM_TO_TOP: 4
}), LayoutAlign = cc.Enum({
    CENTER: 0,
    LEFT: 1,
    RIGHT: 2,
    TOP: 3,
    BOTTOM: 4
});

be.UI = {
    LayoutType: LayoutType,
    LayoutDirection: LayoutDirection,
    LayoutAlign: LayoutAlign,
    doLayout: function (t, i) {
        if (t.children.length) {
            i.type || (i = {
                type: i
            });
            i.space = void 0 !== i.space ? i.space : 0;
            i.align = void 0 !== i.align ? i.align : LayoutAlign.CENTER;
            i.padding = void 0 !== i.padding ? i.padding : {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            };
            i.padding.top = void 0 !== i.padding.top ? i.padding.top : 0;
            i.padding.bottom = void 0 !== i.padding.bottom ? i.padding.bottom : 0;
            i.padding.left = void 0 !== i.padding.left ? i.padding.left : 0;
            i.padding.right = void 0 !== i.padding.right ? i.padding.right : 0;
            if (i.type == LayoutType.HORIZONTAL) {
                i.fitX = void 0 === i.fitX || i.fitX;
                i.fitY = void 0 !== i.fitY && i.fitY;
                this._doLayoutH(t, i);
            } else if (i.type == LayoutType.VERTICAL) {
                i.fitX = void 0 !== i.fitX && i.fitX;
                i.fitY = void 0 === i.fitY || i.fitY;
                this._doLayoutV(t, i);
            }
        }
    },
    _doLayoutH: function (t, i) {
        for (var e = t._children, n = cc.size(i.space, 0), o = 0, a = e.length; o < a; o++) {
            n.width += e[o]._contentSize.width + i.space;
            n.height = Math.max(n.height, e[o]._contentSize.height);
        }
        n.width += i.padding.left + i.padding.right;
        n.height += i.padding.top + i.padding.bottom;
        t.setContentSize(i.fitX ? n.width : t.width, i.fitY ? n.height : t.height);
        var d = t.qlocalRect(), g = be.anchorLeftCenter, h = d.center.y;
        switch (i.align) {
            case LayoutAlign.TOP:
                g = be.anchorTopLeft;
                h = d.yMax - i.padding.top;
                break;

            case LayoutAlign.BOTTOM:
                g = be.anchorBottomLeft;
                h = d.yMin + i.padding.bottom;
        }
        var p = d.xMin + i.padding.left + i.space;
        i.direction == LayoutDirection.RIGHT_TO_LEFT && (p += t.width - n.width);
        for (o = 0, a = e.length; o < a; o++) {
            e[o].qsetAlign(g, p, h);
            p += e[o]._contentSize.width + i.space;
        }
    },
    _doLayoutV: function (t, i) {
        for (var e = t._children, n = cc.size(0, i.space), o = 0, a = e.length; o < a; o++) {
            n.width = Math.max(n.width, e[o]._contentSize.width);
            n.height += e[o]._contentSize.height + i.space;
        }
        n.width += i.padding.left + i.padding.right;
        n.height += i.padding.top + i.padding.bottom;
        t.setContentSize(i.fitX ? n.width : t.width, i.fitY ? n.height : t.height);
        var d = t.qlocalRect(), g = be.anchorTopCenter, h = d.center.x;
        switch (i.align) {
            case LayoutAlign.LEFT:
                g = be.anchorTopLeft;
                h = d.xMin + i.padding.left;
                break;

            case LayoutAlign.RIGHT:
                g = be.anchorTopRight;
                h = d.xMax - i.padding.right;
        }
        var p = d.yMax - i.padding.top - i.space;
        i.direction == LayoutDirection.BOTTOM_TO_TOP && (p -= t.height - n.height);
        for (o = 0, a = e.length; o < a; o++) {
            e[o].qsetAlign(g, h, p);
            p -= e[o]._contentSize.height + i.space;
        }
    }
};