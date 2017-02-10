# Async8
>Multi Async Library for web application. I personally think it is fun and useful.

# Version 0.0.1

# Installation
>npm install async8 --save

# Table Of Content
1. [Sequential Async](#sequential-asynchronization---async8queue)
2. [Parallel Async](#parallel-asynchronization---async8pqueue)
3. [Complex Async](#complex-asynchronization---async8ma)

# Documentations
## Presentation
Link is [here](http://www.8thdensity.com/Demo/Presentation/Async8.html)
## References
```html
<script src='Async8.js'></script>
<script>
      //Do your stuff
</script>
```

## Quick references
### Sequential asynchronization - Async8.Queue
#### Description:
>Execute all asynchronous javascript functions in sequential order. After the last async function is complete a callback(finish) function will be called to notify the developer for further action if need.

#### Syntax
```javascript
      Async8.Queue(Actions, parameter, finishfx, noblock);
```
#### Parameters Explanation
1. Actions: a javascript array of async functions
2. parameter: parameter provided by developer to pass to the *first* async function in *Actions* list. Can be anything
3. finishfx: a callback function provided by developer to be called when the "last" function in the *Actions* list is done. This is optional
4. noblock: spawn a seudo thread for each async function. This is optional. Default: false

#### Parameters format example:
```javascript
   Async8.Queue(MyActions, parameter, completefx);
   
   //Actions:
   var MyActions = [fx1,fx2,action3]
   function fx1(Done,pa1){
       //Do stuff here
       Done("optional parameter to the next function in chain");
   }
   function fx2(Done,pa2){
        //Do stuff here
       Done();
   }
   function action3(Done,pa3){
        //Do stuff here
       Done();
   }
   
   //parameter:
   var parameter = {Just:"A Test"};
   
   //completefx
   function completefx(param)
   {
      //param is an optional param passed by the last function in the chain.
   }  
```
#### Example:
```javascript
      Async8.Queue([Add5,Mul2,Sub13],1,AllComplete);
      function Add5(Done,input)
      {
          console.log("Doing add 5...");
          setTimeout(function(){
            Done(input+5);
          },3000);
      }
      function Mul5(Done,input)
      {
          console.log("Multiply by 2...");
          setTimeout(function(){
            Done(input*2);
          },3000);
      }
      function Sub13(Done,input)
      {
          console.log("Subtracting 13...");
          setTimeout(function(){
            Done(input-13);
          },3000);
      }      
      function AllComplete(input)
      {
          console.log("The final result is: " + input);
      }      
```
### Parallel Asynchronization - Async8.PQueue
#### Description:
>Execute all asynchronous javascript functions in parallel. After the last async function is complete a callback(finish) function will be called to notify the developer for further action if need.

#### Syntax
```javascript
      Async8.PQueue(Actions, parameter, finishfx);
```
#### Parameters Explanation
1. Actions: a javascript array of async functions
2. parameter: parameter provided by developer to pass to *all* async functions in *Actions* list. Can be anything
3. finishfx: a callback function provided by developer to be called when the "all" functions in the *Actions* list are done. This is optional

#### Parameters format example:
```javascript
   Async8.PQueue(MyActions, parameter, completefx);
   
   //Actions:
   var MyActions = [fx1,fx2,action3]
   function fx1(Done,pa1,ith){
       //ith is thread number start from 0
       //Do stuff here
       Done("optional parameter");
   }
   function fx2(Done,pa2,ith){
        //Do stuff here
       Done();
   }
   function action3(Done,pa3,ith){
        //Do stuff here
       Done();
   }
   
   //parameter:
   var parameter = {Just:"A Test"};
   
   //completefx
   function completefx(results)
   {
      //results: is an array of results passed by async function. The length of result array = #number of async function;
      var paramfromfirstfunction = results[0]
   }  
```
#### Example:
```javascript
      Async8.PQueue([Add5,Mul2,Sub13],[1,2,3],AllComplete);
      function Add5(Done,input,ith)
      {
          console.log("Doing add 5...");
          setTimeout(function(){
            Done(input[ith]+5);
          },3000);
      }
      
      function Mul5(Done,input,ith)
      {
          console.log("Multiply by 2...");
          setTimeout(function(){
            Done(input[ith]*2);
          },3000);
      }
      
      function Sub13(Done,input,ith)
      {
          console.log("Subtracting 13...");
          setTimeout(function(){
            Done(input[ith]-13);
          },3000);
      }
      
      function AllComplete(inputs)
      {
          console.log("The final result is: " + inputs);
      }      
```
### Complex Asynchronization - Async8.MA
#### Description:
>Execute all asynchronous javascript functions in the order specified by a diagram.

#### Syntax
```javascript
      Async8.MA(Diagram).Fire(Param,Names,Completefx);
```
#### Parameters Explanation
1. Diagram: a javascript array of arrays of async functions.
2. Param: Optional parameter has the following format:
			{
				"CHIP1": {
					"AINPUT":X
				},
				"CHIP2":{
					"BINPUT":Y
				}
			}

3. Names: An array of string. Each string is name of starting nodes in the circuit. Required WHEN a diagram has *NO* root node.
4. Completefx is the callback function for non circular circuit

#### Example of Diagram:
```html
Diagram/Circuit 1
A------> B ----> D ----.
|                      |
 `-----> C ----> E ----+
         |             |
          `----> F ----+-------> G


Diagram/Circuit 2
X---> Y ---> Z ---.
↑     |           |
|      `---> W ---+
|                 |
 `----------------'

 In the examples above, A,B,D,C,E,F,G,XY,Z,W I call them chips/modules. Each chips will have core logic, uniquename locally to the circuit, properties, inputs, and single output.
 Output of circuit can fan out to different chips inputs.

 
 Diagram 1 has one root node (A) and one leaf node(A)
 Diagram 2, I call it circular circuit. This type of circuit requires a Names parameter to be put to Fire function in order for it to have a start point. Kind of like boostrap

 A circuit can have many leaves and roots.

 
     .------+----------+-------.
 A---+      |          |       |
     | NAME | LOGIC FX + PROPS +--->Output
 B---+      |          |       |
      `-----+----------'-------'
      
	Below is an example of how to describe a chip.
```

```javascript
	// This code is to instantiate a chip name ADD with input A and B
	// Its job is to add numbers;
	// Also we want to create another type of chip that can request JSON from remote server with input of URL
	// This chip can be configured to POST or GET depends on Props Data
	
	var async8 = require("async8");
	var DESC = async8.DESC;

	function AddLogicFx(Done,p){
		Done(p.A+p.B)
	}

	var AddChip = DESC("ADD",AddLogicFx);
	var AddChip2 = DESC("ADD2",AddLogicFx);


	function RestfulLogic(Done,p){
		var Data = this.Props.Data;
		var Method = Data? "POST":"GET";
		$.ajax({
		  url: p.URL,
		  data:JSON.stringify(Data),
		  type:Method,
		  dataType:"json"
		  success:Done
		});
	}

	var GETChip = DESC("REST1",RestfulLogic);
	var POSTChip = DESC("REST1",RestfulLogic,{
		Data: {
			"Name":"Manh",
			"Demand":"JSON"
		}
	});	

```



#### Example:
>Create an async digram that computes [(x+5)*(x/2)+3]/13 then write the result to console.

```html
      An example of the requirement.
      
      Add5--------.
                  ↓
      Div2-----> Mult ---> Add3 ---> Div13 --> WriteConsole
```
```javascript
var Async8 = require("async8");
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

//The flow is of this format [Chip1, "InputOfChip2", Chip2, "InputOfChip3", Chip3]

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
```


# Author
Manh Le
# Contribution
is Welcome
# License
It is free. Free to use on any project, type of project. Have fun : ).
