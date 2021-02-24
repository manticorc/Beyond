gs.ResLoader = function (listener) {
    this.listener = listener;
    this._files = [
        { files: [], weight: 0, progress: 0 }, // default
        { files: [], type: cc.SpriteFrame, weight: 0, progress: 0 }, // spriteFrame
    ];
    this._dirs = [];


    this.addFile = function (file, type) {
        let group = this._files[0];
        if (type === cc.SpriteFrame) {
            group = this._files[1];
        }
        group.files.push(file);
        group.weight = group.files.length;
    }
    
    this.addDir = function (dir) {
        if (dir instanceof Array) {
            for (let i = 0; i < dir.length; i++) {
                this._dirs[this._dirs.length] = { dir: dir[i], weight: 10, progress: 0 };
            }
        } else {
            this._dirs[this._dirs.length] = { dir: dir, weight: 10, progress: 0 };
        }
    }

    this.start = function () {
        var _this = this;
        var total = 0;
        this._files.forEach(group => {
            if (group.files.length == 0) { return; }
            total++;
            cc.loader.loadResArray(group.files, group.type, function (completedCount, totalCount) {
                group.progress = Math.min(0.99, completedCount / totalCount);
                _this._onCompleted();
            }, function (error, resource) {
                if (error) { cc.log("Loader error:" + error); return; }
                group.progress = 1;
                _this._onCompleted();
            });
        });
        this._dirs.forEach(dir => {
            total++;
            cc.loader.loadResDir(dir.dir, function (completedCount, totalCount) {
                dir.progress = Math.min(0.99, completedCount / totalCount);
                _this._onCompleted();
            }, function (error, resource) {
                if (error) { cc.log("Loader error:" + error); return; }
                dir.progress = 1;
                _this._onCompleted();
            })
        });
        if (total == 0) {
            if (this.listener) {
                this.listener(1.0);
            }
            return;
        }
    }

    this._onCompleted = function (completedCount, totalCount) {
        var total = 0, completed = 0;
        this._files.forEach(group => {
            if (group.files.length == 0) { return; }
            total += group.weight;
            completed += group.weight * group.progress;
        });
        this._dirs.forEach(dir => {
            total += dir.weight;
            completed += dir.weight * dir.progress;
        });
        let progress = total == completed ? 1.0 : Math.min(0.99, completed / total);
        // be.logD("Loader progress", progress);
        if (this.listener) {
            this.listener(progress);
        }
    }
}

module.exports = gs.ResLoader;