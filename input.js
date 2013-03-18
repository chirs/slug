var scheme = require('./scheme.js');

var repl = function() {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdout.write("scheme>> ");
  process.stdin.on('data', function (chunk) {
    var expr = scheme.parse(chunk);
    try {
      returnValue = String(scheme.sEval(expr));
      process.stdout.write(returnValue + '\n');
    } catch(err) {
      process.stdout.write("Whoops! We had an error.\n");
    }
    process.stdout.write("scheme>> ");

  });
};

repl();

