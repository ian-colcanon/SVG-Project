/* global Literal BinaryExpr Unary*/


var Parser = function () {
    this.tokens = [];
    this.current = 0;
};

Parser.prototype.init = function (tokens) {
    this.current = 0;
    this.tokens = tokens;
};

Parser.prototype.isAtEnd = function () {
    return this.peek().text == "EOF";
};

Parser.prototype.previous = function () {
    return this.tokens[this.current-1];
    
};

Parser.prototype.has = function (item) {
    return item == this.tokens[this.current].text;
};

Parser.prototype.peek = function () {
    return this.tokens[this.current];
};

Parser.prototype.advance = function () {
    if(!this.isAtEnd()) this.current++;
    
    return this.previous();
    
};

Parser.prototype.consume = function (id) {
    if(this.check(id)) return this.advance();
    throw "Expected \'" + id + "\' but found \'" + this.peek() + "\'.";  
};

Parser.prototype.check = function (id) {
    if(this.isAtEnd()) return false;
    
    return this.peek().type == id;
    
};

Parser.prototype.match = function() {
    if(arguments.length == 0) return false;
    
    for(var i = 0; i<arguments.length; i++){
        var tokenID = arguments[i];
        if(this.check(tokenID)){
            this.advance();
            return true;
        }
        
    }
    
    return false;
};

Parser.prototype.parse = function () {

    
};

Parser.prototype.expression = function (){
   return this.comparison();
};
    
Parser.prototype.comparison = function () {
    var left = this.additive();
    while(this.match('NOT_EQUAL', 'EQUAL')){
        var operator = this.previous().text;
        var right = this.additive();
        left = new BinaryExpr(left, operator, right);
    }
    return left;
};


Parser.prototype.additive = function () {
    var left = this.multiplicative();
    while(this.match('PLUS', 'MINUS')){
        var operator = this.previous().text;
        var right = this.multiplicative();
        left = new BinaryExpr(left, operator, right);
    }
    
    return left;

};

Parser.prototype.multiplicative = function () {
    var left = this.unary();
    while(this.match('MULTIPLY', 'DIVIDE', 'MOD')){
        var operator = this.previous().text;
        var right = this.unary();
        left = new BinaryExpr(left, operator, right);
    }
    
    return left;
    
};

Parser.prototype.unary = function (){
    if(this.match('NOT', 'DECREMENT', 'INCREMENT')){
        var operator = this.previous();
        var right = this.unary();
        return new Unary(operator, right);
    }
    return this.atom();
};

Parser.prototype.atom = function (){  
        if(this.match('INTEGER')){ 
            return new Literal(parseInt(this.previous().text));
        }else if(this.match('REAL')){
            return new Literal(parseFloat(this.previous().text));
        }else if(this.match('STRING')){
            return new Literal(this.previous().text);
        }else if(this.match('L_PAREN')){
            var inner = this.expression();
            this.consume('R_PAREN');
            return inner;
        }else{
            throw "Unrecognizeable operand.";
        }
};

Parser.prototype.eval = function () {
    try{
        var result = this.expression();
    }catch(e){
        
    }
    
    console.log(result.eval());

};