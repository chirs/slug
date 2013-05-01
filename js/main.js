var input = require('./input.js')
var env = require('./env.js')

exports.interpret = input.interpret
exports.Env = env.Env
exports.makeGlobalEnv = env.makeGlobalEnv

input.repl(env.makeGlobalEnv())
