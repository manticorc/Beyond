var Game = require("Game");

var State = {
    Unpacking: 0, // 包体解压
    Preload: 1, // 预加载
    PicsUncompress: 2, // 关卡图片解压
    Loadres: 3, // 加载图片、音效等资源
    RemoteConfig: 4, // Firebase参数配置获取
    Transition: 5, // 过场
    Over: 6, // 结束
}
gs.PreloadScene = cc.Class({
    extends: cc.Component,

    properties: {
        btnStart: cc.Button,
    },

    onLoad: function () {
        Game.initialize(this);
        this.btnStart.node.on("click", this.buttonCallback, this);
        this.btnStart.node.active = false;

        this.loading = this.node.qfind("loading");
        // this.loading.qfind("progress").runAction(cc.repeatForever(cc.rotateBy(2, 360)));

        this.loadingText = this.loading.qfind("text");
        this.loadingLabel = this.loading.qfind("label");
        this.loadingLabel.qactive(CC_DEBUG);

        this.heart = this.loading.qfind("heart_bg").qactive(false);
        // this.heartSprite = this.loading.qfind("heart_bg/heart").getComponent(cc.Sprite);
        this.progressSprite = this.loading.qfind("progress_bg/progress").getComponent(cc.Sprite);
        this.progress = {};
        this.progress[State.Unpacking] = { weight: 100, progress: 0 };
        this.progress[State.PicsUncompress] = { weight: 100, progress: 0 };
        this.progress[State.Loadres] = { weight: 100, progress: 0 };
        this.progress[State.RemoteConfig] = { weight: 50, progress: 0 };
        this.setProgress();
        
        this.passedtime = 0;
        this.state = State.Unpacking;
        this.subState = 0; // 0:prepare 1:processing 2:complete
        this.subState_progress = 0;
        this.subState_starttime = 0;
        this.subState_consumedtime = 0;
        this.changeState(State.Unpacking);
    },

    start: function () {
       
    },

    update: function (dt) {
        this.passedtime += dt;
        switch (this.state) {
            case State.Unpacking:
                if (!this.subState) { // 处理开始
                    if (be.Files.isPrepared()) {
                        this.progress[State.Unpacking].weight = 0;
                        this.changeState(State.Preload);
                        return;
                    }
                    be.Statistics.logEventOnce("A_2"); // A_2	开始解压
                    this.changeState(this.state, 1);
                    be.Files.prepare(progress => {
                        this.subState_progress = progress;
                    });
                } else if (this.subState == 1) { // 处理中
                    this.loadingLabel.qsetLabelString(Math.round(this.subState_progress * 100) + "%");
                    this.progress[State.Unpacking].progress = this.subState_progress;
                    this.setProgress();
                    if (this.subState_progress >= 1) {
                        this.changeState(this.state, 2);
                    }
                } else if (this.subState == 2) { // 处理结束
                    let t = parseInt(this.subState_consumedtime / 1000);
                    // be.Statistics.logEventOnce("COUNTER_A", "value=" + t + "\nvalue_s=" + t);
                    this.changeState(State.Preload);
                }
                break;
            case State.Preload:
                if (!this.subState) { // 处理开始
                    this.changeState(this.state, 1);
                    Game.preload();
                } else if (this.subState == 1) { // 处理中
                    if (Game._preloaded) {
                        this.changeState(this.state, 2);
                    }
                } else if (this.subState == 2) { // 处理结束
                    this.changeState(State.PicsUncompress);
                }
                break;
            case State.PicsUncompress:
                if (!this.subState) { // 处理开始
                    if (!gs.PictureAssetsLoader.shouldUncompressImagePacks()) {
                        this.progress[State.PicsUncompress].weight = 0;
                        this.changeState(State.Loadres);
                        return;
                    }
                    this.changeState(this.state, 1);
                    gs.PictureAssetsLoader.uncompressImagePacks(progress => {
                        this.subState_progress = progress;
                    })
                } else if (this.subState == 1) { // 处理中
                    this.loadingLabel.qsetLabelString(Math.round(this.subState_progress * 100) + "%");
                    this.progress[State.PicsUncompress].progress = this.subState_progress;
                    this.setProgress();
                    if (this.subState_progress >= 1) {
                        this.changeState(this.state, 2);
                    }
                } else if (this.subState == 2) { // 处理结束
                    be.Statistics.logEventOnce("A_3"); // A_3	解压完成
                    this.changeState(State.Loadres);
                }
                break;
            case State.Loadres:
                if (!this.subState) { // 处理开始
                    be.Statistics.logEventOnce("A_4"); // A_4	开始载入
                    this.changeState(this.state, 1);
                    Game.loadResoures(progress => {
                        this.subState_progress = progress;
                    });
                } else if (this.subState == 1) { // 处理中
                    this.progress[State.Loadres].progress = this.subState_progress;
                    this.setProgress();
                    if (this.subState_progress >= 1) {
                        this.changeState(this.state, 2);
                    }
                } else if (this.subState == 2) { // 处理结束
                    let t = parseInt(this.subState_consumedtime / 1000);
                    // be.Statistics.logEventOnce("COUNTER_B", "value=" + t + "\nvalue_s=" + t);
                    be.Statistics.logEventOnce("A_5"); // A_5	载入完成
                    this.changeState(State.Transition);
                }
                break;
            // case State.RemoteConfig:
            //     if (!this.subState) { // 处理开始
            //         this.changeState(this.state, 1);
            //         this.State_RemoteConfig_totaltime = Math.max(0.1, 15 - this.passedtime);
            //         this.State_RemoteConfig_passedtime = 0;
            //     } else if (this.subState == 1) { // 处理中
            //         if (!be.Statistics.exists(be.Statistics.Statistician.google)
            //                 || be.Statistics.isRemoteConfigReady(be.Statistics.Statistician.google)) {
            //             this.subState_progress = 1;
            //         } else { // timeout
            //             this.State_RemoteConfig_passedtime += dt;
            //             this.subState_progress = Math.min(1, this.State_RemoteConfig_passedtime / this.State_RemoteConfig_totaltime);
            //         }
            //         this.progress[State.RemoteConfig].progress = this.subState_progress;
            //         this.setProgress();
            //         if (this.subState_progress >= 1) {
            //             this.changeState(this.state, 2);
            //         }
            //     } else if (this.subState == 2) { // 处理结束                   
            //         this.changeState(State.Transition);
            //     }
            //     break;
            case State.Transition:
                if (this.passedtime > 1.0) {
                    this.changeState(State.Over);
                    this.onLoadCompleted();
                }
                break;
            case State.Over:
                break;
        }
    },

    changeState: function (state, subState) {
        this.state = state;
        this.subState = subState ? subState : 0;
        if (this.subState == 1) {
            this.subState_progress = 0;
            this.subState_starttime = be.Date.currentTimeMillis();
        } else if (this.subState == 2) {
            this.subState_consumedtime = be.Date.currentTimeMillis() - this.subState_starttime;
        }        
        be.logD("PreloadScene state = ", this.state, this.subState, this.subState == 2 ? " time=" + this.subState_consumedtime : "");
    },

    setProgress: function () {
        let _total = 0, _progress = 0;
        for (var i in this.progress) {
            _total += this.progress[i].weight;
            _progress += this.progress[i].weight * this.progress[i].progress;
        }
        let progress = _progress / _total;
        // this.heart.x = -(this.progressSprite.node.width * 0.5) + this.progressSprite.node.width * progress;
        // this.heartSprite.fillRange = progress;
        this.progressSprite.fillRange = progress;
    },

    onLoadCompleted: function () {
        // this.loading.active = false;
        // this.btnStart.node.active = true;
        if (gs.PurchaseProxy.showSubscribeWinAtEntry((goods) => {
            if (gs.GameTutorialWin.showAtEntry()) {
            } else {
                cc.director.loadScene("HomeScene");
            }
        })) {
        } else if (gs.GameTutorialWin.showAtEntry()) {
        } else {
            cc.director.loadScene("HomeScene");
        }
    },

    buttonCallback: function (btn) {
        if (btn === this.btnStart) {
            cc.director.loadScene("HomeScene");
        }
    }
});