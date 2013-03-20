
var isNumber = function(s){ return /^\d+$/.exec(s) !== null;};


symbolTable = {}

var toAtom = function(token){
  if (token == '#t') { return true; }
  else if (token == '#f') { return false; }
  else if (token[0] == '"') { return token.slice(1, token.length-1); }
  else if (isNumber(token)){ return parseInt(token); }
  else { return toSymbol(token); }
};

var toSymbol = function(s){
  if (s in symbolTable){
    //return symbolTable[s];
  } else {
    var o = { s: s, _symbol: true, };
    symbolTable[s] = o;
  }
  return symbolTable[s];
}

var isSymbol = function(s) { return (s._symbol === true ); }
    




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
exports.toSymbol = toSymbol;
exports.toAtom = toAtom;
exports.isSymbol = isSymbol;


