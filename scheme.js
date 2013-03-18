
// https://github.com/fogus/lithp/blob/master/src/py/lisp.py
// The original Lisp described by McCarthy in his 1960 paper describes the following function set:
//
//    1.  `atom`
//    2.  `car`
//    3.  `cdr`
//    4.  `cond`
//    5.  `cons`
//    6.  `eq`
//    7.  `quote`
//
// Plus two special forms:
//
//    1.  `lambda` *(defined in [lithp.py](index.html))*
//    2.  `label`
//
// <http://www-formal.stanford.edu/jmc/recursive.html>
//
// The `Lisp` class defines the magnificent seven in terms of the runtime environment built thus far (i.e. dynamic scope, lambda, etc.).


var makeEnv = require('./env.js').makeEnv


var isString = function(s){ return typeof(s) == 'string';};
var isSymbol = function(s) {}
var isArray = function (o) {
  return (o instanceof Array) ||
    (Object.prototype.toString.apply(o) === '[object Array]');
};




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




exports.sEval = sEval;
exports.isArray = isArray;
