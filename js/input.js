var scheme = require('./scheme.js');
var parse = require('./parse.js');


var interpret = function(s, env){ 
  return scheme.sEval(parse.parse(s), env); 
};


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

exports.interpret = interpret
exports.repl = repl
