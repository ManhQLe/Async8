﻿# Async8
>Multi Async Library for web application. Easy to use and to have fun with.

# Version
Latest: [Async8.v2.js](http://8thdensity.com/Resources/JS/Async8.v2.js)

# Table Of Content
1. [Sequential Async](#sequential-asynchronization---async8queue)
2. [Parallel Async](#parallel-asynchronization---async8pqueue)
3. [Complex Async](#complex-asynchronization---async8ma)
4. [Next Update](#next-updates)

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
>Execute all asynchronous javascript functions in the order specified by the diagram.

#### Syntax
```javascript
      Async8.MA(Diagram).Fire(Param,Names);
```
#### Parameters Explanation
1. Diagram: a javascript array of arrays of async functions.
2. Param: Optional parameter. Can be anything.
3. Names: An array of string. Each string is name of root function/node. Required WHEN a diagram has *NO* root node.

#### Example of Diagram:
```html
Diagram 1
A------> B ----> D ----.
|                      |
 `-----> C ----> E ----+
         |             |
          `----> F ----+-------> G

Diagram 2          
X---> Y ---> Z ---.
↑     |           |
|      `---> W ---+
|                 |
 `----------------'
      
```
```javascript
//A is a root node
//Each array is a link from a node/function to a node/function
MyDiagram = [
      [A,B],
      [A,C],
      
      [B,D],
      
      [C,E],
      [C,F],
      
      [D,G],
      [E,G],
      [F,G]
];
// With Async8.v2.js we can do this
MyDiagram = [
      [A,B,D,G],
      [A,C,E,G],
      [C,F,G]
]

Async8.MA(MyDiagram).Fire() //No parameter and auto detect root node.

MyDiagram2 = [
      [X,Y],
      
      [Y,Z],
      [Y,W],
      
      [Z,X],
      [W,Z]
]
// With Async8.v2.js we can do this
MyDiagram2 = [
      [X,Y,Z,X],
      [Y,W,X]
]


Async8.MA(MyDiagram).Fire(null,["Y"]) //No parameter and specify Y as root node/starting point
```
#### Example:
>Create an async digram that computes [(x+5)*(x/2)+3]/13 then write the result to console.

```html
      An example of the requirement.
      
      Add5--------+
                  ↓
      Div2-----> MultAdd3 ---> Div13 --> WriteConsole
```
```javascript
      function Add5(Done,input)
      {
            var me = this;
            console.log("Doing add 5...");
            setTimeout(function(){
                  Done(input+5);
            },3000);
      }

      function Div2(Done,input)
      {
            var me = this;
            console.log("Doing division 2...");
            setTimeout(function(){
                  Done(input/2);
            },3000);
      }

      function MultAdd3(Done,input)
      {
            var me = this;
            console.log("Doing the magic of adding 3...");
            setTimeout(function(){
                  Done(input["Add5"]*input["Div2"] + 3)
            },3000);
      }

      function Div13(Done,input)
      {
            var me = this;
            console.log("Doing Division by 3...");
            setTimeout(function(){
                  Done(input["MultAdd3"]/13);
            },3000);
      }
      
      function WriteConsole(input){
            console.log(input);
      }

      Async8.MA([
            [Add5,MultAdd3],
            [Div2,MultAdd3],
            
            [MultAdd3,Div13],
            [Div13,WriteConsole]
      ]).Fire(17);
      
```
>The example above can also be rewritten as

```javascript
      function Div(Done,input) {
            console.log("Diving the result by " + this.Props.Divisor);
            setTimeout(function (me) {
                  Done((me.Props.InputName ? input[me.Props.InputName] : input) / me.Props.Divisor);
            }, 3000, this);
      }
      
      function MultAdd3(Done,input)
      {
            var me = this;
            console.log("Doing the magic of adding 3...");
            setTimeout(function(){
                  Done(input["Add5"]*input["Div2"] + 3)
            },3000);
      }
      
      function Add5(Done,input)
      {
            var me = this;
            console.log("Doing add 5...");
            setTimeout(function(){
                  Done(input+5);
            },3000);
      }
      
      Async8.MA([
            [Add5,MultAdd3],
            [N0(Div,"Div2",{"Divisor":2} ),MultAdd3],
            
            [MultAdd3,N0(Div,"Div13",{"InputName":"MultAdd3","Divisor":13})],
            ["Div13",WriteConsole]
      ]).Fire(17);      
```
### Next Updates
[ x ] Simplify Diagram typing/specification

# Author
Manh Le
# Contribution
is Welcome
# License
It is free. Free to use on any project, type of project. Have fun : ).
