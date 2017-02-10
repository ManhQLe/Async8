var MA = require("./MA");

var Async8 = {
    Queue: function (Actions, param, endfx, noblock) {
        var i = 0;
        function Start(x) {
            i < Actions.length ? Actions[i++](Start, x) : (endfx ? endfx(x) : 1);
        }
        (noblock) ?
            setImmediate(Start, param) : Start(param);
    },
    PQueue: function (Actions, param, endfx) {
        var RetData = []
        var I = 0;
        function DoneCall(i, ret) {
            RetData[i] = ret;
            ++I == RetData.length ? endfx ? endfx(RetData) : 1 : 0;
        }

        Actions.forEach(function (fx, i) {
            RetData.push(null);
            setImmediate(fx, function (retdata) {
                DoneCall(i, retdata)
            }, param, i);
        })
    },
    DPQueue: function (Data, threadfx, endfx, NOT) {
        NOT = NOT ? NOT : Data.length;
        var fxs = [];
        for (var i = 0; i < NOT; i++) {
            fxs.push(threadfx);
        }
        this.PQueue(fxs, Data, endfx);
    },
    MA: function (R) {
        return new MA.MA(R);
    },
    DESC:MA.DESC
}

module.exports = Async8;