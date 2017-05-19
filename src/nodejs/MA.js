function DESC(name, fx, props, async) {
    return new N0(name, fx, props, async);
}

function N0(name, fx, props, async) {
    this.Name = name;
    this.fx = fx;
    this.Props = props;
    this.Async = async;
    this.InputCount = 0;
    this.Params = {},
    this.Collected = 0;
    this.Link2 = [];
    this.Board = null;
}

N0.prototype.Fire = function (Done, p) {
    this.Async ? setImmediate(this.fx.call, this, Done, p, this.Board.Global, this.Board) : this.fx(Done, p, this.Board.Global, this.Board);
}

function MA(Routes) {
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

MA.prototype.GetNode = function (unknown) {
    var type = typeof unknown;
    var Node = {}
    switch (type) {
        case "object":
            Node = unknown;
            break;
        case "function":
            Node.Name = unknown.name || MA.Config.GetName();
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
        Node = DESC(Node.Name, Node.fx, Node.Props, Node.Async)
        Node.Board = this;
        this.Nodes.push(Node);
    }
    else {
        Node = this.Nodes[idx];
    }
    return Node;
}

MA.prototype.ExecNode = function (n, p, Pre) {
    //Pre: Advance input to allow node to be fired
    var me = this;
    if (me.Error)
        return;

    function Done(nparam, err, Names) {
        if (err)
        {
            me.Error = err;
            me.Endfx(null, err);
            return;
        }

        var Flows = MA.FX.GetFlows(Names);
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
                ++me.Leafed == me.Leaves ? (me.Leafed = 0, me.Endfx(me.LastParams)) : 1
            )
    }

    if ((Pre ? Pre : 0) + n.Collected >= n.InputCount) {
        n.Collected = 0;
        n.Fire(Done, p);
    }
}

MA.prototype.Fire = function (Params, Names, Endfx, Global) {
    this.Global = Global;
    this.LastParams = {};
    this.Endfx = Endfx || function () { };
    var me = this;

    this.Nodes.forEach(function (n) {
        if ((Names && Names.indexOf(n.Name) >= 0) || n.InputCount == 0) {
            var p = Params.hasOwnProperty(n.Name) ? Params[n.Name] : {}
            n.Params = p;
            me.ExecNode(n, n.Params, n.InputCount)
        }
    })
}

MA.Config = {
    i: 0,
    GetName: function () {
        return "Annonymous" + (this.i++);
    }
}

MA.Flows = {
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

MA.FX = {
    GetFlows: function (u) {
        if (u) {
            return Array.isArray(u) ? MA.Flows.FireBoost :
                (
                    u.call ? u : MA.Flows.ChooseCurrent
                )
        }
        else
            return MA.Flows.Default;
    }
}


module.exports = {
    "MA": MA,
    "DESC": DESC
}