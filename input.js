var scheme = require('./scheme.js');

var repl = function() {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function (chunk) {
    var expr = scheme.parse(chunk);
    returnValue = String(scheme.sEval(expr));
    process.stdout.write(returnValue + '\n');
  });
};

repl();

