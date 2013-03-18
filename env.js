
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

var makeGlobalEnv = function(){
  return makeEnv(undefined, operators);
}



exports.makeEnv = makeEnv;
exports.makeGlobalEnv = makeGlobalEnv;