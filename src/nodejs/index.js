var MA = require("./MA");

var Async8 = {
    Queue: function (Actions, param, endfx, noblock) {
        var i = 0;
        endfx ? 1 : endfx = function () { };

        function Start(x, err) {
            err ? endfx(err) :
                i < Actions.length ? Actions[i++](Start, x, err) : endfx(x);        
        }
        (noblock) ?
            setImmediate(Start, param) : Start(param);
    },
    PQueue: function (Actions, param, endfx) {
        endfx ? 1 : endfx = function () { };
        var RetData = []
        var I = 0;
        var Ended = false;
        function DoneCall(i, ret,err) {
            RetData[i] = ret;
            if (err && !Ended) {
                Ended = true;
                endfx(RetData, err, i);
            }
            else
                ++I == RetData.length ? endfx(RetData) : 1;
        }

        Actions.forEach(function (fx, i) {
            RetData.push(null);
            setImmediate(fx, function (retdata,err) {
                DoneCall(i, retdata, err);
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