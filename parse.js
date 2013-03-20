
var isNumber = function(s){ return /^\d+$/.exec(s) !== null;};

// This should be called in eval, right?
var toAtom = function(s) {
  if (isNumber(s)) {
    return parseInt(s);
  } else {
    return s;
  }
}



var tokenize = function(s){ 
  var s2 = s.replace(/\(/g, " ( ").replace(/\)/g, " ) ")
  var l = s2.split(/\s+/).filter(function(e){return e !== "";}); // Remove empty elements.
  return l
};

var readFrom = function(tokens){
  // Turn the token list into a tree.
  if (tokens.length == 0){ throw "out of tokens!" };

  var token = tokens.shift();
  if (token == '('){
    var L = [];
    while (tokens[0] != ')'){ 
      L.push(readFrom(tokens)); 
    }
    tokens.shift(); // Remove )
    return L;
  } else if (token == ')'){
    throw "mismatched parentheses!"
  } else {
    return toAtom(token);
  }
};

var parse = function(s){ return readFrom(tokenize(s)); }





exports.tokenize = tokenize;
exports.readFrom = readFrom;
exports.parse = parse;


