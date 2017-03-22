﻿var Async8 = {
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
        return new Async8._.MA(R);
    },
    N0: function (name, fx, props, async) {
        this.Name = name;
        this.fx = fx;
        this.Props = props;
        this.Async = async;
        this.InputCount = 0;
        this.Params = {},
            this.Collected = 0;
        this.Link2 = [];
        this.Board = null;
    },
    _: {
        
        MA: function (Routes) {
            this.Nodes = [];
            var me = this;
            Routes.forEach(function (r, i) {
                for (var j = 0; j < r.length; j += 2) {
                    var S = me.GetNode(r[j]);
                    var n = j + 1;
                    if (n < r.length) {
                        var Local = r[n];
                        var E = me.GetNode(r[n + 1]);
                        E.InputCount++;
                        S.Link2.push({
                            "Local": Local,
                            "Node": E
                        });
                    }
                }
            })
            this.Leafed = 0;
            this.Leaves = 0;
            this.LastParams = {};
            this.Nodes.forEach(function (n) {
                n.Link2.length ? 1 : me.Leaves++;
            })
        }
    }
}

Async8.N0.prototype.Fire = function (Done, p) {
    this.Async ? setImmediate(this.fx, this, Done, p, this.Board) : this.fx(Done, p, this.Board);
}


Async8._.MA.prototype.GetNode = function (unknown) {
    var type = typeof unknown;
    var Node = {}
    switch (type) {
        case "object":
            Node = unknown;
            break;
        case "function":
            Node.Name = unknown.name || Async8._.MA.Config.GetName();
            Node.fx = unknown
            break;
        default:
            Node.Name = unknown;
    }

    var idx;
    var NotIn = this.Nodes.every(function (n, i) {
        idx = i;
        return n.Name !== Node.Name;
    })
    if (NotIn && !Node.fx)
        throw "Undeclared node name: " + unknown;

    if (NotIn) {
        Node = Async8._.MA.DESC(Node.Name, Node.fx, Node.Props, Node.Async)
        Node.Board = this;
        this.Nodes.push(Node);
    }
    else {
        Node = this.Nodes[idx];
    }
    return Node;
}

Async8._.MA.prototype.ExecNode = function (n, p, Pre) {
    //Pre: Advance input to allow node to be fired
    var me = this;
    function Done(nparam, Names) {
        var Flows = Async8._.MA.FX.GetFlows(Names);
        var PreE, E;
        n.Link2.forEach(function (End) {
            E = End.Node;
            PreE = Flows(E, Names);
            if (PreE > 0) {
                ++E.Collected;
                PreE--;
                End.Local ? E.Params[End.Local] = nparam : E.Params = nparam;
            }
            me.ExecNode(E, E.Params, PreE);
        });
        n.Link2.length ? 1 :
            (
                me.LastParams[n.Name] = nparam,
                ++me.Leafed == me.Leaves ? (me.Leafed = 0, me.Endfx ? me.Endfx(me.LastParams) : 0) : 1
            )
    }

    if ((Pre ? Pre : 0) + n.Collected >= n.InputCount) {
        n.Collected = 0;
        n.Fire(Done, p);
        //n.Async ? setImmediate(n.fx.call, n, Done, p, this) : n.fx(Done, p, this);
    }
}

Async8._.MA.prototype.Fire = function (Params, Names, Endfx, Global) {
    this.Global = Global;
    this.LastParams = {};
    Endfx ? this.Endfx = Endfx : 1;
    var me = this;

    this.Nodes.forEach(function (n) {
        if ((Names && Names.indexOf(n.Name) >= 0) || n.InputCount == 0) {
            var p = Params.hasOwnProperty(n.Name) ? Params[n.Name] : {}            
            n.Params = p;
            me.ExecNode(n, n.Params, n.InputCount)
        }
    })
}

Async8._.MA.Config = {
    i: 0,
    GetName: function () {
        return "Annonymous" + (this.i++);
    }
}

Async8._.MA.Flows = {
    Default: function (E, Flows) {
        return 1;
    },
    ChooseCurrent: function (E, Flows) {
        return Flows.hasOwnProperty(E.Name) ? Flows[E.Name] : 0;
    },
    FireBoost: function (E, Flows) {
        return Flows.indexOf(E.Name) >= 0 ? E.InputCount : 1;
    }
}

Async8._.MA.FX = {
    GetFlows: function (u) {
        if (u) {
            return Array.isArray(u) ? Async8._.MA.Flows.FireBoost :
                (
                    u.call ? u : Async8._.MA.Flows.ChooseCurrent
                )
        }
        else
            return Async8._.MA.Flows.Default;
    }
}

Async8._.MA.DESC = function (name, fx, props, async) {
    return new Async8.N0(name, fx, props, async);
}

Async8.DESC = Async8._.MA.DESC;