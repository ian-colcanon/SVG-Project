/* global TokenTypes Literal BinaryExpr Unary*/


var Parser = function (lexer) {
    this.lex = lexer;
    this.tokens = lexer.scanTokens();
    this.current = 0;
    this.table = new TokenTypes();
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

Parser.prototype.checkType = function (id) {
    if(this.isAtEnd()) return false;
    
    return this.peek().type == id;
    
};
Parser.prototype.checkOperator = function(op) {
    if(this.isAtEnd()) return false;
    
    return this.peek().text == op;
}

Parser.prototype.matchType = function() {
    if(arguments.length == 0) return false;
    
    for(var i = 0; i<arguments.length; i++){
        var tokenID = arguments[i];
        if(this.checkType(tokenID)){
            this.advance();
            return true;
        }
        
    }
    
    return false;
};

Parser.prototype.matchOperator = function() {
    if(arguments.length == 0) return false;

    for(var i = 0; i<arguments.length; i++){
        var tokenTxt = arguments[i];
        if(this.checkOperator(tokenTxt)){
            this.advance();
            return true;
        }
    }
    
    return false;
};

Parser.prototype.parse = function () {

    
};



Parser.prototype.expression = function (){
   return this.additive();
};
    


Parser.prototype.additive = function () {
    var left = this.multiplicative();
    while(this.matchOperator('+', '-')){
        var operator = this.previous().text;
        var right = this.multiplicative();
        left = new BinaryExpr(left, operator, right);
    }
    
    return left;

};

Parser.prototype.multiplicative = function () {
    var left = this.unary();
    while(this.matchOperator('*', '/', '%')){
        var operator = this.previous().text;
        var right = this.unary();
        left = new BinaryExpr(left, operator, right);
    }
    
    return left;
    
};

Parser.prototype.unary = function (){
    if(this.matchOperator('!', '--', '++')){
        var operator = this.previous();
        var right = this.unary();
        return new Unary(operator, right);
    }
    return this.atom();
};

Parser.prototype.atom = function (){  
        if(this.matchType('INTEGER')){ 
            return new Literal(parseInt(this.previous().text));
        }else if(this.matchType('REAL')){
            return new Literal(parseFloat(this.previous().text));
        }else if(this.matchType('STRING')){
            return new Literal(this.previous().text);
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