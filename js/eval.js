var p = require('./parse.js');


var Env = require('./env.js').Env


var isString = function(s){ return typeof(s) == 'string';};

var isArray = function (o) {
  return (o instanceof Array) ||
    (Object.prototype.toString.apply(o) === '[object Array]');
};



var _if = p.toSymbol("if")
, _quote = p.toSymbol("quote")
, _set = p.toSymbol("set!")
, _define = p.toSymbol("define")
, _lambda = p.toSymbol("lambda")
, _begin = p.toSymbol("begin")



// Something is not quite right converting between symbols and values...


var sEval = function(expr, env){
  while (true) {
    if (p.isSymbol(expr)) { return env.get(expr.s) }
    else if (!isArray(expr)) { return expr;  } // Constant literal.
    else if (expr[0] == _quote) { return x.slice(1, x.length) } 
    else if (expr[0] == _if) { // Don't return, just delegate evaluation to the correct expression.
      var pred = sEval(expr[1], env)
      if (pred) { expr = expr[2] } 
      else { expr = expr[3] }
    } else if (expr[0] == _set){
      // What's the difference between set! and define?
      if (p.isSymbol(expr[1])){
        env.set(expr[1].s, sEval(expr[2], env))
        return      
      } else { throw "Cannot set! " + expr[1] + " since it is not a symbol." }
    } else if (expr[0] == _define) {
      // Is this the right place to be doing symbol check?
      if (p.isSymbol(expr[1])){
        env.set(expr[1].s, sEval(expr[2], env))
        return      
      } else { throw "Cannot define " + expr[1] + " since it is not a symbol." }
    } else if (expr[0] == _lambda) {
      // Lambda magic.
      var args = expr[1]; // (x y z)
      var fexpr = expr[2]; // (+ x y z)
      var e = new Env(env)
      return function(){
        var bindings = Array.prototype.slice.call(arguments); // Get variable arguments to funciton.
        for (var i=0; i<bindings.length; i++){ 
          var val = sEval(bindings[i], env); // evaluate argument to function.
          e.set(args[i].s, val); // bind expr value to parameter.
      }
      return sEval(fexpr, e);
      }

    } else if (expr[0] == _begin) {
      var exprs = expr.slice(1, expr.length)
      for (var i=1; i < exprs.length-1; i++) {
        sEval(exprs[i], env)
      }
      expr = expr[expr.length-1]
    } else {
      var proc = sEval(expr[0], env);
      var args = [];
      if (expr.length > 1){
        for (var i=1; i < expr.length; i++){
          var e = sEval(expr[i], env)
          args.push(e);
        };
      };
      return proc.apply(this, args);
    }
  }
}



exports.sEval = sEval;
exports.isArray = isArray;
