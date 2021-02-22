be.Class = function (t) { };

be.Class.defineProtoFunctions = function (t, e) {
    for (var o in e) t.prototype[o] = e[o];
};

be.Class.defineStaticFunction = function (t, e) {
    for (var o in e) t[o] = e[o];
};

be.Class.extendsConstructor = function (t, e) {
    if (arguments.length > 2) {
        let o = [];
        for (let t = 2; t < arguments.length; t++) o.push(arguments[t]);
        e.apply(t, o);
    } else e.call(t);
};

be.Class.extendsPrototype = function (t, e, o) {
    t.prototype = Object.create(e.prototype);
    t.prototype.constructor = t;
    if (o) for (let e = 2; e < arguments.length; e++) {
        let o = arguments[e];
        Object.assign(t.prototype, o.prototype);
    }
};