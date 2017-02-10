﻿var Async8 = require("./index.js");
var DESC = Async8.DESC;

function DivConst(Done, p) {    
    var Divisor = this.Props.Const;
    console.log(this.Name + " is doing math: " + p.A + "/" + Divisor);
    setTimeout(Done, Math.random() * 1700, p.A / Divisor);
}

function Mult(Done, p) {
    console.log(this.Name + " is doing math: " + p.A + "*" + p.B);
    setTimeout( Done, Math.random()*1700, p.A * p.B);
}

function AddConst(Done, p) {
    var Const = this.Props.Const;
    console.log(this.Name + " is doing math: " + p.A + "+" + Const);
    setTimeout(Done, Math.random()*1700, p.A + Const);
}

function WriteConsole(Done, p) {
    console.log(this.Name + " is writing to console...");
    setTimeout(function () {
        console.log(p.INP);
        Done("I had written it down for you!");
    }, Math.random() * 1700);
    
}


var Circuit = [
    [
        DESC("ADD5", AddConst, { "Const": 5 }), "A",
        DESC("MULT", Mult), "A",
        DESC("ADD3", AddConst, { Const: 3 }), "A",
        DESC("DIV13", DivConst, { Const: 13 }), "INP",
        DESC("CONSL", WriteConsole)
    ],
    [
        DESC("DIV2", DivConst, { Const: 2 }), "B", "MULT"
    ]
];
var X = 10;
Async8.MA(Circuit).Fire({
    "ADD5": {
        "A":X
    },
    "DIV2": {
        "A":X
    }
},null, function (p) {
    console.log("Everything is done, chief");
    console.log(p);
})