

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
    if (b === undefined) { return -1 * sEval(a); } 
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

var loadOperators = function(){
  for (var i=0; i < operators.length; i++){
    var symbol = operators[i][0]
    var func = operators[i][1]
    env.set(symbol, func);
  };
};


// Create env and load basic operators.
var env = makeEnv(undefined, operators);



var isNumber = function(s){
  return /^\d+$/.exec(s) !== null;
};

var isString = function(s){
  return typeof(s) == 'string';
};

var isOperator = function(s){
  var ops = ['+', '-', '/', '*', 'not',
             '>', '<', '<=', '>=', 'eq?',
             'length', 'cons', 'car', 'cdr',
             'append', 'list', 'list?', 'null?',
             'symbol?',]
  return ops.indexOf(s) >= 0;
};

var isArray = function (o) {
  return (o instanceof Array) ||
    (Object.prototype.toString.apply(o) === '[object Array]');
};

var isSymbol = function(s) {}

var toAtom = function(s) {
  if (isNumber(s)) {
    return parseInt(s);
  } else {
    return s;
  }
}


var performOperator = function(expr){
  var op = expr[0];
  var e1 = function(){ return sEval(expr[1]); };
  var e2 = function(){ return sEval(expr[2]); };

  switch (op) {
  case '+': return e1() + e2();
  case '-': {
    if (expr.length == 2){ return -1 * e1(); }
    else { return e1() - e2(); }
  }
  case '/': return e1() / e2();
  case '*': return e1() * e2();
  case '>': return e1() > e2();
  case '>=': return e1() >= e2();
  case '<': return e1() < e2();
  case '<=': return e1() <= e2();
  case 'eq?': return e1() === e2(); // What about lists...
  // case 'length': return
  case 'cons': return [e1()].concat(e2());
  case 'car': return e1()[0];
  case 'cdr': return e1().slice(1)
  //case append
  // case list
  // case list?
  case 'null?': return e1() === []
  // case null?
  // case symbol?
  };

return null;
}
             

var sEval = function(expr){
  if (isString(expr)) {
    return env.get(expr);
  } else if (!isArray(expr)) {
    return expr
  } else if (expr[0] == 'quote') {
    return expr[1]
  } else if (expr[0] == 'if') {
    if (sEval(expr[1])) {
      return sEval(expr[2]) 
    } else {
      return sEval(expr[3]) 
    }
  } else if (expr[0] == 'set!'){
    env.set( expr[1], sEval(expr[2]) )
  } else if (expr[0] == 'define'){
    env.set( expr[1], sEval(expr[2]) ) // Presumably key can be anything...
  } else if (expr[0] == 'lambda'){
    // figure out how to apply functions.
    return new Proc(expr[1], expr.slice(2));


  } else if (expr[0] == 'begin'){
    // Evaluate, Skipping expr[0]
    //for (var i=1, i < expr.length, i++){ var ret = sEval(expr[i]); };
    return ret;
  } else {

    var proc = sEval(expr[0]);
    var args = [];
    if (expr.length > 1){
      for (var i=1; i < expr.length; i++){
        var e = sEval(expr[i])
        args.push(e);
      };
    };
    return proc.apply(this, args);
  }; 
};


var parse = function(s){ return readFrom(tokenize(s)); }

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

var interpret = function(s){ return sEval(parse(s)); };

exports.interpret = interpret
//exports.performOperator = performOperator
exports.readFrom = readFrom;
exports.toAtom = toAtom;
exports.sEval = sEval;
exports.parse = parse;
exports.tokenize = tokenize;
exports.isArray = isArray;
exports.env = env;
exports.makeEnv = makeEnv;