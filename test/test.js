var assert = require('assert');
var scheme = require('../scheme.js');


// From http://stackoverflow.com/questions/7837456/comparing-two-arrays-in-javascript - comparing arrays...
Array.prototype.compare = function(array) {  //prototype defines the .compare as method of any object
  if(this.length!=array.length)  //first compare length - saves us a lot of time
    return false;
  for(var i=0; i<this.length; i++) {
    if(this[i] instanceof Array&&array[i] instanceof Array){   //Compare arrays
      if(!this[i].compare(array[i]))                         //!recursion!
        return false;
    }
    else if(this[i]!=array[i]) {                     //Warning - two diferent objec instances will never be equal: {x:20}!={x:20}
      return false;
    }
  }
  return true;
}



describe('tokenize', function(){
  describe('equal', function() {
    var je = function(o) { return JSON.encode(o)}; // For comparing arrays.
    it("should return [ '(', '+', '5', '8', ')'] ", function(){ assert.equal(true, scheme.tokenize("(+ 5 8 )").compare(['(', '+', '5', '8', ')'])); });
    it("should return ['(', '+', '(', '-', '6', '1', ')' '8', ')']", function(){ assert.equal(true, scheme.tokenize("(+ (- 6 1) 8 )").compare(                                                                   ['(', '+', '(', '-', '6', '1', ')', '8', ')'])); });
  });
});


describe('Integers', function(){
  describe('equal', function(){
    it('should return 5', function(){ assert.equal(scheme.interpret("5"), 5); });
    it('should return 13', function(){ assert.equal(scheme.interpret("(+ 5 8)"), 13);});
    it('should return -3', function(){ assert.equal(scheme.interpret("(- 5 8)"), -3);});
    it('should return 40', function(){ assert.equal(scheme.interpret("(* 5 8)"), 40);});
    it('should return 40', function(){ assert.equal(scheme.interpret("(* (+ 5 2) 8)"), 56);});
    it('should return 40', function(){ assert.equal(scheme.interpret("(* (+ 5 (- 2)) 8)"), 24);});
  });
});

describe('define', function(){
  it('should define', function() {assert.equal('undefined', typeof(scheme.interpret("(define x 5)")))});
  it('should return 5', function() {assert.equal(5, scheme.interpret("x"))});
  it('should define', function() {assert.equal('undefined', typeof(scheme.interpret("(set! x 8)")))});
  it('should return 5', function() {assert.equal(8, scheme.interpret("x"))});
});

describe('lambda', function(){
  it('should define', function() {assert.equal('undefined', typeof(scheme.interpret("(define mult (lambda (x y) (* x y)))")));});
  it('should define', function() {assert.equal(12, scheme.interpret("(mult 2 6)"))});
})
  
