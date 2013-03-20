
var makeEnv = require('./env.js').makeEnv


var isString = function(s){ return typeof(s) == 'string';};
var isSymbol = function(s) {}
var isArray = function (o) {
  return (o instanceof Array) ||
    (Object.prototype.toString.apply(o) === '[object Array]');
};


var _if = "if"
var _quote = "quote"
var _set = "set"
var _define = "define"
var _lambda = "lambda"
var _begin = "begin"

var sEval2 = function(expr, env){
  while (true) {
    if (isSymbol(expr)) { return env.get(expr) }
    else if (!isArray(expr)) { return expr;  } // Constant literal.
    else if (expr[0] == _quote) { return x.slice(1, x.length) } 
    else if (expr[0] == _if) { // Don't return, just delegate evaluation to the correct expression.
      var pred = sEval2(expr[1], env)
      if (pred) { expr = expr[2] } 
      else { expr = expr[3] }
    } else if (expr[0] == _set){
      // What's the difference between set! and define?
      env.set(expr[1], sEval2(expr[2], env))
      return
    } else if (expr[0] == _define) {
      env.set(expr[1], sEval2(expr[2], env))
      return      
    } else if (expr[0] == _lambda) {
      // Lambda magic.
      var args = expr[1];
      var fexpr = expr[2];
      var e = makeEnv(env)
      return function(){
        var bindings = Array.prototype.slice.call(arguments); // Get bindings from function property.
        for (var i=0; i<bindings.length; i++){ 
          var val= sEval2(bindings[i], env);
          e.set(args[i], val);
      }
      return sEval2(fexpr, e);
      }

    } else if (expr[0] == _begin) {
      var exprs = expr.slice(1, expr.length)
      for (var i=1; i < exprs.length-1; i++) {
        sEval2(exprs[i], env)
      }
      expr = expr[exprs.length-1]
    } else {
      var proc = sEval2(expr[0], env);
      var args = [];
      if (expr.length > 1){
        for (var i=1; i < expr.length; i++){
          var e = sEval2(expr[i], env)
          args.push(e);
        };
      };
      return proc.apply(this, args);


    }
  }
}


var sEval = function(expr, env){
  //env = env || globalEnv;

  if (isString(expr)) {
    return env.get(expr);
  } else if (!isArray(expr)) {
    return expr
  } else if (expr[0] == 'quote') {
    return expr[1]
  } else if (expr[0] == 'if') {
    if (sEval(expr[1], env)) {
      return sEval(expr[2], env) 
    } else {
      return sEval(expr[3], env) 
    }
  } else if (expr[0] == 'set!'){
    env.set( expr[1], sEval(expr[2], env) )
  } else if (expr[0] == 'define'){
    env.set( expr[1], sEval(expr[2], env) ) // Presumably key can be anything?
  } else if (expr[0] == 'lambda'){

    var args = expr[1];
    var fexpr = expr[2];
    var e = makeEnv(env)
    
    return function(){
      
      var bindings = Array.prototype.slice.call(arguments); // Get bindings from function property.
      // Need to figure out scope. This is doing global binding for function parameters.
      for (var i=0; i<bindings.length; i++){ 
        var val= sEval(bindings[i], env);
        e.set(args[i], val);
      }
      return sEval(fexpr, e);
    }

  } else if (expr[0] == 'begin'){
    // Evaluate, Skipping expr[0]
    for (var i=1; i < expr.length; i++){ 
      var ret = sEval(expr[i], env); 
    };
    return ret;
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
  }; 
};

sEval = sEval2


exports.sEval = sEval;
exports.isArray = isArray;
