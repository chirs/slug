

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

exports.Env = Env;
exports.makeGlobalEnv = makeGlobalEnv;