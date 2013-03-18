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

//describe('lambda', function(){
//  it('should define', function() {assert.equal('undefined', typeof(scheme.interpret("(define mult (lambda (x y) (* x y)))")));});
//  it('should define', function() {assert.equal(12, scheme.interpret("(mult 2 6)"))});
//})


describe('env', function(){
  it('should define', function() {
    var e1 = scheme.makeEnv(undefined, {'a': 'b'})
    var e2 = scheme.makeEnv(e1, {2: 3})
    var e3 = scheme.makeEnv(e2, {'a': 'c'})

    assert.equal(e3.get('a'), 'c');
    assert.equal(e2.get('a'), 'b');

    assert.equal(e2.get(2), 3);
    assert.equal(e1.get(2), null);
    
    e2.set('a', 'd');
    assert.equal(e3.get('a'), 'c');    
    assert.equal(e2.get('a'), 'd');    
    assert.equal(e1.get('a'), 'b');    
  });
})


describe('begin', function(){
  it('should define', function() {
    var result = scheme.interpret("(begin (+ 1 2) (+ 1 3) (+ 2 3))")
    assert.equal(result, 5);
  });
})


describe('lambda', function(){
  it('should define', function() {

    scheme.interpret("(define times5 (lambda (b) (* b 5)))")
    assert.equal(40, scheme.interpret("(times5 8)"));

    scheme.interpret("(define foo (lambda (a b) (+ a b)))")
    assert.equal(scheme.interpret("(foo 3 8)"), 11)

    scheme.interpret("(define higher (lambda (a) (lambda (b) (* a b))))")
    scheme.interpret("(define times6 (higher 6))")
    assert.equal(48, scheme.interpret("(times6 8)"));

  });
})
  


describe('lambda', function(){
  it('should define', function() {
    scheme.interpret("(define x 100)")
    assert.equal(100, scheme.interpret("x"))

    scheme.interpret("(define foo (lambda (x y) (+ x y)))")
    assert.equal(100, scheme.interpret("x"))

    // Make sure parameter binding doesn't overwrite outer variables.
    scheme.interpret("(foo 10 20)")
    assert.equal(scheme.interpret("x"), 100)

                 

  });
})