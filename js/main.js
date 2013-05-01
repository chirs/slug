var input = require('./input.js')
var env = require('./env.js')

exports.interpret = input.interpret
exports.makeEnv = env.makeEnv
exports.makeGlobalEnv = env.makeGlobalEnv
//input.repl(env.makeGlobalEnv())
