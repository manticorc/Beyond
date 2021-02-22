be.ByteBuffer = function (t) {
    this._arraybuffer = t || new ArrayBuffer(1024);
    this._dataView = new DataView(this._arraybuffer);
    this._l = t ? t.byteLength : 0;
    this._p = 0;
    this._m = 0;
    this.remaining = function () {
        return this._l - this._p;
    };
    this.position = function (t) {
        void 0 != t && (this._p = t);
        return this._p;
    };
    this.mark = function () {
        this._m = this._p;
    };
    this.reset = function () {
        this._p = this._m;
    };
    this.flip = function () {
        this._l = this._p;
        this._p = 0;
        this._m = 0;
    };
    this.setArrayBuffer = function (t) {
        this._arraybuffer = t;
        this._dataView = new DataView(this._arraybuffer);
        this._p = 0;
        this._p = 0;
    };
    this._requireSize = function (t) {
        if (this._p + t > this._arraybuffer.byteLength) {
            let i = new ArrayBuffer(this._arraybuffer.byteLength + Math.max(t, 1024)), e = new DataView(i);
            for (let t = 0, i = this._arraybuffer.byteLength; t < i; t++) e.setUint8(t, this._dataView.getUint8(t));
            this._arraybuffer = i;
            this._dataView = e;
        }
    };
    this.write = function (t) {
        this.writeByte(t);
    };
    this.writeByte = function (t) {
        this._requireSize(1);
        this._dataView.setUint8(this._p, t);
        this._p += 1;
    };
    this.writeInt = function (t) {
        this._requireSize(4);
        this._dataView.setInt32(this._p, t, !1);
        this._p += 4;
    };
    this.writeShort = function (t) {
        this._requireSize(2);
        this._dataView.setInt16(this._p, t, !1);
        this._p += 2;
    };
    this.writeLong = function (t) {
        this._requireSize(8);
        let i = be.Long.convertToBytes(t);
        for (let t = 0; t < i.length; t++) this._dataView.setUint8(this._p + t, i[t]);
        this._p += 8;
    };
    this.writeFloat = function (t) {
        this._requireSize(4);
        this._dataView.setFloat32(this._p, t, !1);
        this._p += 4;
    };
    this.writeUTF = function (t) {
        let i = be.String.convertToUTFBytes(t);
        this._requireSize(i.length + 2);
        this._dataView.setInt16(this._p, i.length, !1);
        this._p += 2;
        for (let t = 0, e = i.length; t < e; t++) this._dataView.setUint8(this._p + t, i[t]);
        this._p += i.length;
    };
    this.read = function () {
        return this.readByte();
    };
    this.readByte = function () {
        var t = this._dataView.getInt8(this._p);
        this._p += 1;
        return t;
    };
    this.readInt = function () {
        var t = this._dataView.getInt32(this._p, !1);
        this._p += 4;
        return t;
    };
    this.readShort = function () {
        var t = this._dataView.getInt16(this._p, !1);
        this._p += 2;
        return t;
    };
    this.readLong = function () {
        let t = [];
        for (let i = 0; i < 8; i++) t[i] = this._dataView.getUint8(this._p + i);
        this._p += 8;
        return be.Long.convertToNumber(t);
    };
    this.readFloat = function () {
        var t = this._dataView.getFloat32(this._p, !1);
        this._p += 4;
        return t;
    };
    this.readUTF = function () {
        let t = this._dataView.getInt16(this._p, !1);
        this._p += 2;
        let i = [];
        for (let e = 0; e < t; e++) i[e] = this._dataView.getUint8(this._p + e);
        this._p += i.length;
        return be.String.convertToUTFString(i);
    };
    this.toArrayBuffer = function () {
        return this._arraybuffer.slice(0, this._p);
    };
    this.toBytes = function () {
        let t = this._arraybuffer.slice(0, this._p), i = [], e = new DataView(t);
        for (let s = 0, r = t.byteLength; s < r; s++) i[s] = e.getUint8(s);
        return i;
    };
    this.toHexString = function () {
        return be.String.convertToHexString(this.toBytes());
    };
};

module.exports = _be.ByteBuffer;