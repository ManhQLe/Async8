var MA = require("./MA");

var Async8 = {
    Queue: function (Actions, param, endfx,gparams, noblock) {
        var i = 0;
        endfx ? 1 : endfx = function () { };

        function Start(x, err) {
            err ? endfx(err) :
                i < Actions.length ? Actions[i++](Start, x, gparams) : endfx(x, gparams);
        }
        (noblock) ?
            setImmediate(Start, param) : Start(param);
    },
    PQueue: function (Actions, param, endfx, gparams) {
        endfx ? 1 : endfx = function () { };
        var RetData = []
        var I = 0;
        var Ended = false;
        function DoneCall(i, ret,err) {
            RetData[i] = ret;
            if (err && !Ended) {
                Ended = true;
                endfx(RetData, err, i,gparams);
            }
            else
                ++I == RetData.length ? endfx(RetData, gparams) : 1;
        }

        Actions.length ? Actions.forEach(function (fx, i) {
            RetData.push(null);
            setImmediate(fx, function (retdata, err) {
                DoneCall(i, retdata, err);
            }, param, i, gparams);
        }) : endfx(RetData, gparams);

        
    },
    DPQueue: function (Data, threadfx, endfx, gparams, NOT) {
        NOT = NOT ? NOT : Data.length;
        var fxs = [];
        for (var i = 0; i < NOT; i++) {
            fxs.push(threadfx);
        }
        this.PQueue(fxs, Data, endfx, gparams);
    },
    MA: function (R) {
        return new MA.MA(R);
    },
    DESC:MA.DESC
}

module.exports = Async8;