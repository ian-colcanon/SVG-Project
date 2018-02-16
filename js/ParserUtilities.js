


var Parser = function (lexer) {
    this.tokens = lexer.scanTokens();
    this.current = 0;
       
};

Parser.prototype.isAtEnd = function () {
    return this.current >= this.tokens.length;
};

Parser.prototype.previous = function () {
    return this.tokens[this.current-1];
    
};

Parser.prototype.peek = function () {
    return this.tokens[this.current];
};

Parser.prototype.advance = function () {
    if(!this.isAtEnd()) this.current++;
    
    return this.previous();
    
};

Parser.prototype.check = function (id) {
    if(this.isAtEnd()) return false;
    
    return this.peek().id == id;
    
};

Parser.prototype.match = function() {
    if(arguments.length == 0) return false;
    
    for(var tokenID in arguments){
        if(this.check(tokenID)){
            this.advance();
            return true;
        }
        
    }
    
    return false;
};

var BinaryExp = function (type, left, op, right) {};

BinaryExp.prototype.types = {
    ADD: 'ADD',
    MULTIPLY: 'MULTUPLY',
    COMPARE: 'COMPARE',    
    
}

