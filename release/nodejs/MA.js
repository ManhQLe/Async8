function DESC(a,b,c,d){return new N0(a,b,c,d)}function N0(a,b,c,d){this.Name=a;this.fx=b;this.Props=c;this.Async=d;this.InputCount=0;this.Params={};this.Collected=0;this.Link2=[];this.Board=null}N0.prototype.Fire=function(a,b){this.Async?setImmediate(this.fx,this,a,b,this.Board):this.fx(a,b,this.Board)};
function MA(a){this.Nodes=[];var b=this;a.forEach(function(a,d){for(var e=0;e<a.length;e+=2){var l=b.GetNode(a[e]),g=e+1;if(g<a.length){var h=a[g],g=b.GetNode(a[g+1]);g.InputCount++;l.Link2.push({Local:h,Node:g})}}});this.Leaves=this.Leafed=0;this.LastParams={};this.Nodes.forEach(function(a){a.Link2.length?1:b.Leaves++})}
MA.prototype.GetNode=function(a){var b={};switch(typeof a){case "object":b=a;break;case "function":b.Name=a.name||MA.Config.GetName();b.fx=a;break;default:b.Name=a}var c,d=this.Nodes.every(function(a,l){c=l;return a.Name!==b.Name});if(d&&!b.fx)throw"Undeclared node name: "+a;d?(b=DESC(b.Name,b.fx,b.Props,b.Async),b.Board=this,this.Nodes.push(b)):b=this.Nodes[c];return b};
MA.prototype.ExecNode=function(a,b,c){function d(b,c){var d=MA.FX.GetFlows(c),k,f;a.Link2.forEach(function(a){f=a.Node;k=d(f,c);0<k&&(++f.Collected,k--,a.Local?f.Params[a.Local]=b:f.Params=b);e.ExecNode(f,f.Params,k)});a.Link2.length?1:(e.LastParams[a.Name]=b,++e.Leafed==e.Leaves?(e.Leafed=0,e.Endfx?e.Endfx(e.LastParams):0):1)}var e=this;(c?c:0)+a.Collected>=a.InputCount&&(a.Collected=0,a.Fire(d,b))};
MA.prototype.Fire=function(a,b,c,d){this.Global=d;this.LastParams={};c?this.Endfx=c:1;var e=this;this.Nodes.forEach(function(c){if(b&&0<=b.indexOf(c.Name)||0==c.InputCount){var d=a.hasOwnProperty(c.Name)?a[c.Name]:{},h;for(h in d)c.Params[h]=d[h];e.ExecNode(c,c.Params,c.InputCount)}})};MA.Config={i:0,GetName:function(){return"Annonymous"+this.i++}};
MA.Flows={Default:function(a,b){return 1},ChooseCurrent:function(a,b){return b.hasOwnProperty(a.Name)?b[a.Name]:0},FireBoost:function(a,b){return 0<=b.indexOf(a.Name)?a.InputCount:1}};MA.FX={GetFlows:function(a){return a?Array.isArray(a)?MA.Flows.FireBoost:a.call?a:MA.Flows.ChooseCurrent:MA.Flows.Default}};module.exports={MA:MA,DESC:DESC};
