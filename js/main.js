var input = require('./input.js')
var env = require('./env.js')


input.repl(env.makeGlobalEnv())
