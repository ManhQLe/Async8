var Async8 = require("./Async8");
function A(Done,input) {
    console.log("Beginning A");
    console.log(input);
    setTimeout(function () {
        Done(input + 1);
    }, 2600);
}

function B(Done, input) {
    console.log("Beginning B");
    console.log(input);
    setTimeout(function () {
        Done(input + 2);
    }, 2600);
}

//Async8.Queue([A, B], 1, function (inp) {
//    console.log(inp);
//});



function P1(Done, input, i) {
    console.log("P" + i + " is doing it job...");
    setTimeout(function () {
        Done(input * (i + 1));
    }, 2600);
}

function P2(Done, input, i ) {
    console.log("P" + i + " is doing it job...");
    setTimeout(function () {
        Done(input * (i + 1));
    }, 2600);
}

//Async8.PQueue([P1, P2], 2, function (out) {
//    console.log(out);
//})


function AddLogic(Done, p, board) {
    console.log("Adding logic...[" + p.A + " + " + p.B + "]");
    setTimeout(Done, 1700, p.A + p.B);    
}

function Mult3Logic(Done, p, board) {
    console.log("Multiplying [" + p.A + " * 3]");
    setTimeout(Done, 1700, p.A * 3);
}
var DESC = Async8.DESC;

var Circuit = [
    [DESC("M1", Mult3Logic), "B", DESC("A1", AddLogic)],
    [DESC("A0", AddLogic), "A", "A1"]
]
var C = Async8.MA(Circuit)
//C.Nodes.forEach(function (n) {
//    console.log(n.Name+ ": " +n.InputCount);
//})
C.Fire({
    "A0": {
        "A": 1,
        "B":2
    },
    "M1": {
        "A":4
    }
}, null, function (p) {
    console.log("DONE");
    console.log(p);
})