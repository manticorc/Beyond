gs.Sounds = {
    _assets: [
        { name: "click" }, // 1 点击按钮，填方块，填X
        { name: "win" }, // 2 胜利
        { name: "lose" }, // 3 死亡
        { name: "full" }, // 4 满行,列
        { name: "wrong" }, // 5 填错
    ],

    playClick: function () { this._play(1); },
    playWin: function () { this._play(2); },
    playLose: function () { this._play(3); },
    playFull: function () { this._play(4); },
    playWrong: function () { this._play(5); },

    _play: function (id, loop) {
        if (!gs.Settings.sound) { return; }
        
        let sound = this._assets[id - 1];
        if (sound) {
            if (sound.audio) {
                cc.audioEngine.play(sound.audio, !!loop, 1);
            } else {
                let audio = cc.loader.getRes("sounds/" + sound.name, cc.AudioClip);
                if (audio) {
                    sound.audio = audio;
                    cc.audioEngine.play(sound.audio, !!loop, 1);
                } else {
                    cc.loader.loadRes("sounds/" + sound.name, cc.AudioClip, (err, audio) => {
                        if (err) { return; }
                        sound.audio = audio;
                        cc.audioEngine.play(sound.audio, !!loop, 1);
                    });
                }
            }
        }
    },

}

module.exports = gs.Sounds;