
var interpret = function(s, env){ 
  return scheme.sEval(parse.parse(s), env); 
};


// Repl doesn't seem to work without node.
var repl = function(env) {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdout.write("scheme>> ");
  process.stdin.on('data', function (chunk) {
    //var expr = parse.parse(chunk);
    try {
      returnValue = String(interpret(chunk, env));
      process.stdout.write(returnValue + '\n');
    } catch(err) {
      process.stdout.write("Whoops! We had an error.\n");
    }
    process.stdout.write("scheme>> ");

  });
};


var Env = function(parentEnv, o){
  this.parentEnv = parentEnv
  this.o = o || {}
};

Env.prototype.get = function(key){
  if (key in this.o){
    return this.o[key]; 
  } else if (typeof(this.parentEnv) == 'undefined'){
    return null;
  } else {
    return parentEnv.get(key);
  }
};

Env.prototype.set = function(key, value){
  this.o[key] = value;
}

var makeGlobalEnv = function(){
  return new Env(undefined, primitives);
}


var primitives = {
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


var isNumber = function(s){ return /^\d+$/.exec(s) !== null;};


symbolTable = {}

var toAtom = function(token){
  if (token == '#t') { return true; }
  else if (token == '#f') { return false; }
  else if (token[0] == '"') { return token.slice(1, token.length-1); }
  else if (isNumber(token)){ return parseInt(token); }
  else { return toSymbol(token); }
};

var toSymbol = function(s){
  if (s in symbolTable){
    //return symbolTable[s];
  } else {
    var o = { s: s, _symbol: true, };
    symbolTable[s] = o;
  }
  return symbolTable[s];
}

var isSymbol = function(s) { return (s._symbol === true ); }
    
var tokenize = function(s){ 
  var s2 = s.replace(/\(/g, " ( ").replace(/\)/g, " ) ")
  var l = s2.split(/\s+/).filter(function(e){return e !== "";}); // Remove empty elements.
  return l
};

var readFrom = function(tokens){
  // Turn the token list into a tree.
  if (tokens.length == 0){ throw "out of tokens!" };

  var token = tokens.shift();
  if (token == '('){
    var L = [];
    while (tokens[0] != ')'){ 
      L.push(readFrom(tokens)); 
    }
    tokens.shift(); // Remove )
    return L;
  } else if (token == ')'){
    throw "mismatched parentheses!"
  } else {
    return toAtom(token);
  }
};

var parse = function(s){ return readFrom(tokenize(s)); }


//var Env = require('./env.js').Env


var isString = function(s){ return typeof(s) == 'string';};

var isArray = function (o) {
  return (o instanceof Array) ||
    (Object.prototype.toString.apply(o) === '[object Array]');
};



var _if = toSymbol("if")
, _quote = toSymbol("quote")
, _set = toSymbol("set!")
, _define = toSymbol("define")
, _lambda = toSymbol("lambda")
, _begin = toSymbol("begin")


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


