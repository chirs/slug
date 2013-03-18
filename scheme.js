

var makeEnv = (function(parentEnv, o){
  var o = o || {}
  return {
    get: function(key) { 
      if (key in o){
        return o[key]; 
      } else if (typeof(parentEnv) == 'undefined'){
        return null;
      } else {
        return parentEnv.get(key);
      }
    },
    set: function(key, value) { o[key] = value; },
  };
});


operators = {
  '+': function(a,b) { return a + b; },
  '-': function(a,b) { 
    if (b === undefined) { return -1 * a; } 
    else { return a - b }},
  '*': function(a,b) { return a * b; },
  '/': function(a,b) { return a / b; },
  '>': function(a,b) { return a > b; },
  '<': function(a,b) { return a < b; },
  '>=': function(a,b) { return a >= b; },
  '<=': function(a,b) { return a <= b; },
  'eq?': function(a,b) { return a === b; },
  'cons': function(a,b) { return [a].concat(b); },
  'car': function(a) { return a[0]; },
  'cdr': function(a) { return a.slice(1) },
}



// Create env and load basic operators.
var globalEnv = makeEnv(undefined, operators);

var isNumber = function(s){ return /^\d+$/.exec(s) !== null;};
var isString = function(s){ return typeof(s) == 'string';};
var isSymbol = function(s) {}
var isArray = function (o) {
  return (o instanceof Array) ||
    (Object.prototype.toString.apply(o) === '[object Array]');
};


var toAtom = function(s) {
  if (isNumber(s)) {
    return parseInt(s);
  } else {
    return s;
  }
}

var zip = function(arrays) {
  return arrays[0].map(function(_,i){
    return arrays.map(function(array){return array[i]})
  });
}


var sEval = function(expr, env){
  env = env || globalEnv;

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
    return function(){
      var bindings = Array.prototype.slice.call(arguments); // Get bindings from function property.
      // Need to figure out scope. This is doing global binding for function parameters.
      for (var i=0; i<bindings.length; i++){ env.set(args[i], sEval(bindings[i], env));}
      return sEval(fexpr, env);
    }

  } else if (expr[0] == 'begin'){
    // Evaluate, Skipping expr[0]
    for (var i=1; i < expr.length; i++){ 
      var ret = sEval(expr[i]); 
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




var tokenize = function(s){ 
  var s2 = s.replace(/\(/g, " ( ").replace(/\)/g, " ) ")
  var l = s2.split(/\s+/).filter(function(e){return e !== "";}); // Remove empty elements.
  return l
};

var readFrom = function(tokens){
  // Turn the token list into a tree.
  if (tokens.length == 0){ raise; };

  var token = tokens.shift();
  if (token == '('){
    var L = []
    while (tokens[0] != ')'){ 
      L.push(readFrom(tokens)); 
    }
    tokens.shift(); // Remove )
    return L;
  }  else if (token == ')'){
    raise;
  } else {
    return toAtom(token);
  }
};

var parse = function(s){ return readFrom(tokenize(s)); }
var interpret = function(s){ return sEval(parse(s)); };



exports.interpret = interpret
exports.readFrom = readFrom;
exports.toAtom = toAtom;
exports.sEval = sEval;
exports.parse = parse;
exports.tokenize = tokenize;
exports.isArray = isArray;
exports.globalEnv = globalEnv;
exports.makeEnv = makeEnv;