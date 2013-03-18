var scheme = require('./scheme.js');

var repl = function(env) {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdout.write("scheme>> ");
  process.stdin.on('data', function (chunk) {
    var expr = scheme.parse(chunk);
    try {
      returnValue = String(scheme.sEval(expr), env);
      process.stdout.write(returnValue + '\n');
    } catch(err) {
      process.stdout.write("Whoops! We had an error.\n");
    }
    process.stdout.write("scheme>> ");

  });
};


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
var globalEnv = scheme.makeEnv(undefined, operators);

repl(globalEnv);


exports.globalEnv = globalEnv