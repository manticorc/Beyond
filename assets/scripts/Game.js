// ============================================================================
gs.Game = {
    initialize: function (scene) {
        scene.node.parent._scene = scene;
        if (this._initialized) {
            return;
        }
        
        this.regGameEventListener();
        this.setKeyBackCallback();
        this._initialized = true;
    },

    preload: function () {
        if (this._preloaded) { return; }
        
        cc.loader.loadResDir("data", function (err, object) {
            if (err) {
                be.logE(err);
                return;
            }
         
            this._preloaded = true;
        }.bind(this));
    },

    regGameEventListener: function () {
        cc.game.on(cc.game.EVENT_HIDE, function () {
            be.logD("游戏进入后台");
        }, this);
        cc.game.on(cc.game.EVENT_SHOW, function () {
            be.logD("游戏进入前台");
        }, this);
    },

    setKeyBackCallback: function (callback) {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            be.logD("event type=" + event.type + " keyCode=" + event.keyCode + " == " + cc.macro.KEY.back);
            if (event.keyCode == cc.macro.KEY.backspace || event.keyCode == cc.macro.KEY.back) {
                if (callback != undefined) {
                    callback();
                } else {
                    be.App.exit();
                }
            }
            event.stopPropagation();
        }, this);
    },

    loadResoures: function (funcDoing, funcDone) {
        if (this._loadResoures) {
            if (funcDoing) {
                funcDoing(1);
            }
            if (funcDone) {
                funcDone();
            }
        } else {
            var _this = this;
            let loader = new gs.ResLoader(function (process) {
                // be.logD("loadResoures = " + process);
                if (funcDoing) {
                    funcDoing(process);
                }
                if (process >= 1) {
                    _this._loadResoures = true;
                    if (funcDone) {
                        funcDone();
                    }
                }
            });
            gs.Sounds._assets.forEach(sound => {
                loader.addFile("sounds/" + sound.name);
            });
            loader.addFile("message-bundle");
            if (!be.Locale.isLanguageDesigned()) {
                loader.addDir(be.Locale.languageName);
            }
            loader.addDir(["common", "user", "home", "game", "jigsaw", "task"]);
            // loader.addFile("common/prefabs/LoadingWin");
            // loader.addFile("common/prefabs/AlertWin");
            // loader.addFile("common/prefabs/ConfirmWin");
            //
            loader.addDir(["chapter/difficulty"]);
            loader.addFile("chapter/ChapterLevelsLayer");
            ChapterManager.getChapterBuildingResPaths().forEach(path => { loader.addFile(path, cc.SpriteFrame); });
            //
            loader.addFile("shop/ShopWin");
            loader.addFile("shop/ShopLayer");
            // 
            if (be.Device.designedScreen === be.Device.Screen.S768_1024 ) {
                loader.addDir("v10");
            }
            loader.start();
        }
    },

    // =================================================================================
    startGame: function () {
      
    },

    restartGame: function (callback) {
       
    },
    
};