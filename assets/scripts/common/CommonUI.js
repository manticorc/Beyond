// ============================================================================
gs.UI = {
    listenerHub: new be.ListenerHub(),

    addBlockInputLayer: function (node, rect) {
        node = node ? node : cc.director.getScene().qgetChild("Canvas");
        if (!node._blockInputLayer) {
            if (rect instanceof Object) {
                node._blockInputLayer = be.Node.create(node, rect.width, rect.height).qblockInput();
                if (rect.pos) {
                    node._blockInputLayer.qsetPosition(rect.pos.x, rect.pos.y, rect.anchor);
                }
            } else if (rect == true) {
                node._blockInputLayer = be.Node.create(node, node.width, node.height).qblockInput();
                node._blockInputLayer.qsetPosition(0, 0, node.getAnchorPoint());
            } else {
                node._blockInputLayer = be.Node.create(node, be.Device.screenSize.width, be.Device.screenSize.height).qblockInput();
            }
            node._blockInputLayer.zIndex = cc.macro.MAX_ZINDEX;
            if (CC_DEV) { // 测试
                node._blockInputLayer.qaddSprite("common/default");
                node._blockInputLayer.color = cc.Color.RED;
                node._blockInputLayer.opacity = 64;
            }
        } else {
            if (rect instanceof Object) {
                node._blockInputLayer.setContentSize(rect.width, rect.height);
                if (rect.pos) {
                    node._blockInputLayer.qsetPosition(rect.pos.x, rect.pos.y, rect.anchor);
                }
            } else if (rect == true) {
                node._blockInputLayer.setContentSize(node.width, node.height);
            }
        }
        node._blockInputLayer.active = true;

    },

    removeBlockInputLayer: function (node) {
        node = node ? node : cc.director.getScene().qgetChild("Canvas");
        if (node._blockInputLayer) {
            node._blockInputLayer.active = false;
            // node._blockInputLayer.destroy();
        }
    },

    showWinFromPrefab: function (name, callback) {
        let prefab = cc.loader.getRes(name, cc.Prefab);
        if (prefab) {
            let node = this._showWinFromPrefab(prefab);
            if (callback) { callback(node); }
        } else {
            cc.loader.loadRes(name, cc.Prefab, (err, prefab) => {
                if (err) { be.logE(err); return; }
                let node = this._showWinFromPrefab(prefab);
                if (callback) { callback(node); }
            });
        }
    },

    showWinFromPrefabSync: function (name) {
        let prefab = cc.loader.getRes(name, cc.Prefab);
        if (!prefab) {
            be.logE("资源" + name + "必须预加载");
            return null;
        }
        let node = this._showWinFromPrefab(prefab);
        return node;
    },

    _showWinFromPrefab: function (prefab) {
        let parent = cc.director.getScene().qgetChild("Canvas");
        let node = be.instantiate(prefab, parent);
        let mask = node.qfind("mask");
        if (mask) {
            node.qfind("mask").getComponent(cc.Widget).target = parent;
        }
        return node;
    },

    // ===============================================================================
    _effectWinShow: function (node) {
        let content = node.qfind("content");
        content.setScale(0.5);
        content.runAction(cc.scaleTo(0.3, 1).easing(cc.easeBackInOut()));
    },

    _effectWinHide: function (node, callback) {
        let content = node.qfind("content");
        content.runAction(cc.sequence(cc.scaleTo(0.2, 0.1), cc.callFunc(() => {
            if (callback) {
                callback();
            }
        })));
    },

    effectWinHide2: function (win, callbackFn) {
        win.runAction(cc.sequence(cc.fadeOut(1.0), cc.callFunc(() => {
            if (callbackFn) { callbackFn(); }
            win.destroy();
        })));
    },

    // ===============================================================================
    showHand(owner, target, offset, moveDistance) {
        if (owner._hand) {
            this.hideHand(owner);
            this._showHand(owner._hand, target, offset, moveDistance);
        } else {
            cc.loader.loadRes("common/prefabs/hand", cc.Prefab, (err, prefab) => {
                if (err) { be.logE(err); return; }

                let parent = owner ? owner : cc.director.getScene().qgetChild("Canvas");
                owner._hand = be.instantiate(prefab, parent);
                this._showHand(owner._hand, target, offset, moveDistance);
            });
        }
    },

    _showHand(hand, target, offset, moveDistance) {
        hand.active = true;
        let pos = target.convertToWorldSpace(cc.Vec2.ZERO);
        pos.addSelf(cc.v2(55, -62));
        if (!moveDistance) {
            pos.addSelf(cc.v2(16, 14));
        }
        if (offset) {
            pos.addSelf(offset);
        }
        hand.qsetWorldPosition(pos, hand.getAnchorPoint());
        if (moveDistance) {
            let dura = Math.sqrt(moveDistance.x * moveDistance.x + moveDistance.y * moveDistance.y) / 720 * 2;
            hand.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.3), cc.moveBy(dura, moveDistance), cc.delayTime(0.3), cc.callFunc(function () {
                hand.qsetWorldPosition(pos, hand.getAnchorPoint());
            }, this))));
        } else {
            hand.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
                hand.getComponent(cc.Animation).play("hand_click");
            }, this), cc.delayTime(1.3))));
        }
    },

    hideHand(owner, destory) {
        if (!owner._hand) { return; }
        if (destory) {
            owner._hand.destory();
            owner._hand = null;
        } else if (owner._hand.active) {
            owner._hand.stopAllActions();
            owner._hand.getComponent(cc.Animation).stop();
            owner._hand.rotation = 0;
            owner._hand.active = false;
        }
    },

    // ===============================================================================
    effectFadeIn: function () {
        if (!arguments) { return; }
        Array.from(arguments).forEach(node => {
            node.active = true;
            node.opacity = 0;
            node.runAction(cc.fadeIn(1));
        });
    },

    effectFadeOut: function () {
        if (!arguments) { return; }
        Array.from(arguments).forEach(node => {
            if (node.active) {
                node.runAction(cc.fadeOut(1));
            }
        });
    },

    effectGoldsFly: function (amount, total, parentNode, srcNode, destNode, amountNode, callbackFn) {
        let _amount = Math.abs(amount);
        let num = _amount;
        let nums = [
            [9, 9],
            [30, 12],
            [100, 15],
        ];
        for (let i = nums.length; --i >= 0;) {
            if (_amount >= nums[i][0]) {
                if (i + 1 < nums.length) {
                    num = nums[i][1] + (nums[i + 1][1] - nums[i][1]) * (_amount - nums[i][0]) / (nums[i + 1][0] - nums[i][0]);
                    num = Math.floor(num);
                } else {
                    num = nums[i][1];
                }
                break;
            }
        }
        this._effectPropsFly(amount, total, num, parentNode, srcNode, destNode, amountNode, callbackFn);
        if (amount > 0) {
            this.effectCoinAmountUp(amount, parentNode, srcNode);
        }
    },

    effectDiamondsFly: function (amount, total, parentNode, srcNode, destNode, amountNode, callbackFn) {
        this.effectGoldsFly(amount, total, parentNode, srcNode, destNode, amountNode, callbackFn);
    },

    _effectPropsFly: function (amount, total, num, parentNode, srcNode, destNode, amountNode, callbackFn) {
        if (amount < 0) { let temp = srcNode; srcNode = destNode; destNode = temp; }

        let canvas = cc.director.getScene().qgetChild("Canvas");
        parentNode = be.Node.create(canvas, be.Device.screenSize.width, be.Device.screenSize.height);
        let srcPos = parentNode.convertToNodeSpaceAR(srcNode.convertToWorldSpaceAR(cc.Vec2.ZERO));
        let destPos = parentNode.convertToNodeSpaceAR(destNode.convertToWorldSpaceAR(cc.Vec2.ZERO));
        // let scaleX = destNode.width * destNode.scaleX / (srcNode.width * srcNode.scaleX);
        let scaleX = 1;
        let _destNode = be.instantiate(destNode, parentNode).qsetPosition(destPos);

        let deltaTime = Math.min(0.1, 0.4 / num);
        let duration = deltaTime * (num - 1);
        if (amountNode && amount < 0) {
            this._effectPropsAmountIncrease(amountNode, total, duration);
        }

        let deltaPosParm = { base: 0.4, incr: 1 };
        for (let i = num; --i >= 0;) {
            // let node = be.instantiate(srcNode, parentNode).qsetPosition(srcPos);
            let node = be.instantiate(destNode, parentNode).qsetPosition(srcPos);
            let action_1, action_2, action_3;
            let dura4;
            if (amount > 0) {
                let deltaPos = cc.v2(node.width * (be.Random.nextInt(100) > 50 ? 1 : -1) * (deltaPosParm.base + deltaPosParm.incr * Math.random()),
                    node.height * (be.Random.nextInt(100) > 50 ? 1 : -1) * (deltaPosParm.base + deltaPosParm.incr * Math.random()));
                let pos1 = deltaPos.addSelf(node.getPosition());
                let pos1_2 = cc.v2((destPos.x - pos1.x) * 0.3, (destPos.y - pos1.y) * 0.5);
                action_1 = cc.moveTo(0.2, pos1);
                action_2 = cc.delayTime(0.2);
                action_3 = cc.moveBy(0.4, pos1_2);
                dura4 = 0.3 + deltaTime * i;
            } else {
                action_1 = cc.delayTime(0.01);
                action_2 = cc.delayTime(0.01);
                action_3 = cc.delayTime(0.01);
                dura4 = 1.0;
            }

            node.runAction(cc.sequence(action_1, action_2, action_3,
                // cc.delayTime(i == 0 ? 0 : deltaTime * i),
                cc.spawn(cc.moveTo(dura4, destPos), cc.scaleTo(dura4, scaleX * 0.9)),
                // cc.scaleTo(0.1, scaleX * 1.25).easing(cc.easeBackInOut()),
                cc.callFunc(() => {
                    node.destroy();
                    if (i === 0) {
                        _destNode.runAction(cc.sequence(
                            cc.repeat(cc.sequence(cc.scaleTo(0.1, 1.25), cc.scaleTo(0.05, 1.0)), deltaTime * num / 0.15 + 1),cc.delayTime(0.5),
                            cc.callFunc(() => {
                                _destNode.destroy();
                                parentNode.destroy();
                                if (callbackFn) { callbackFn(); }
                            })
                        ));
                        if (amountNode && amount > 0) { this._effectPropsAmountIncrease(amountNode, total, deltaTime * num + 0.2); }
                    }
                    // if (i === num - 1) { if (callbackFn) { callbackFn(); } }
                })
            ));
        }
    },

    effectCoinsIncrease: function (amountNode, total, callbackFn) {
        this._effectPropsAmountIncrease(amountNode, total, 1, callbackFn);
    },

    _effectPropsAmountIncrease: function (amountNode, total, duration, callbackFn) {
        amountNode.stopAllActions();
        let src = parseInt(amountNode.getComponent(cc.Label).string);
        let delta = (total - src) / 20, i = 1;
        amountNode.runAction(cc.repeat(cc.sequence(cc.delayTime(duration / 20), cc.callFunc(() => {
            amountNode.qsetLabelString(Math.floor(src + delta * i++));
        })), 20));
        amountNode.runAction(cc.sequence(cc.delayTime(duration + 0.2), cc.callFunc(() => {
            amountNode.qsetLabelString(total);
            if (callbackFn) { callbackFn(); }
        })));
    },

    // ===============================================================================
    effectCoinAmountUp(amount, parentNode, srcNode, callbackFn) {
        let srcPos = parentNode.convertToNodeSpaceAR(srcNode.convertToWorldSpaceAR(cc.Vec2.ZERO));
        cc.loader.loadRes("common/prefabs/CoinAmount", cc.Prefab, (err, prefab) => {
            if (err) { be.logE(err); return; }

            let node = be.instantiate(prefab, parentNode);
            node.qfind("label").qsetLabelString("+" + amount);
            node.qsetPosition(srcPos);
            node.runAction(cc.sequence(cc.spawn(cc.moveBy(1, cc.v2(0, 100)), cc.scaleBy(1, 1.5)), cc.fadeOut(0.5), cc.callFunc(() => {
                node.destroy();
                if (callbackFn) { callbackFn(); }
            })));
        });
    },

    // ===============================================================================
    enableMarquee(node, direction, delayTime) {
        if (!node || node._children.length == 0) { return; }
        delayTime = delayTime > 0 ? delayTime : 1;
        let child = node._children[0];
        node.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(() => {
            let rect = node.qlocalRect(), childRect = child.qlocalRect();
            if (childRect.size.width <= rect.size.width) { return; }

            let x1 = -childRect.xMin + rect.xMin;
            let x2 = -childRect.xMin + rect.xMin + (rect.size.width - childRect.size.width);
            let dura = Math.abs(x2 - x1) * 8.5 / be.Device.screenSize.width;
            child.x = x1;
            child.runAction(cc.repeatForever(cc.sequence(cc.moveTo(dura, cc.v2(x2, child.y)), cc.delayTime(1.2),
                cc.moveTo(dura, cc.v2(x1, child.y)), cc.delayTime(1.2))));
        })));
    }
};

module.exports = gs.UI;
