


var Parser = function (lexer) {
    this.lex = lexer;
    this.tokens = lexer.scanTokens();
    this.current = 0;
    this.table = new TokenTypes();
};

Parser.prototype.isAtEnd = function () {
    return this.current >= this.tokens.length;
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

Parser.prototype.check = function (id) {
    if(this.isAtEnd()) return false;
    
    return this.peek().type == id;
    
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

Parser.prototype.parse = function () {

    
};

Parser.prototype.atom = function (token){  
        if(token.type == 'INTEGER'){ 
            return new Literal(parseInt(token.text));
        }else if(token.type == 'REAL'){
            return new Literal(parseFloat(token.text));
        }else if(token.type == 'STRING'){
            return new Literal(token.text);
        }
        
    
};

Parser.prototype.expression = function (){
  
    return this.multiplicative();
   
};
    


Parser.prototype.additive = function (atom) {
    var left = atom;
    while(this.has("+")){
        this.advance();
        var right = this.atom(this.advance());
        left = new Addition(left, right);
    }
    if(!(left instanceof Addition)){
        return undefined;
    }else{
        return left;
    }
    
};
Parser.prototype.multiplicative = function (expr) {
    var left = (expr == undefined ? this.atom(this.advance()) : new Literal(expr.eval()));
    
    while(this.has("*")){
        this.advance();
        var right = this.atom(this.advance());
        left = new Multiplication(left, right);
    }
    if(!(left instanceof Multiplication)){
        return this.divisive(left);
    }else{
        return left;
    }
    
};
Parser.prototype.divisive = function (atom) {
    var left = atom;
    while(this.has("/")){
        this.advance();
        var right = this.atom(this.advance());
        left = new Division(left, right);
    }
    if(!(left instanceof Division)){
        return this.modulative(left);
    }else{
        return left;
    }
}
Parser.prototype.subtractive = function (atom) {
    var left = atom;
    while(this.has("-")){
        this.advance();
        var right = this.atom(this.advance());
        left = new Subtraction(left, right);
    }
    if(!(left instanceof Subtraction)){
        return this.additive(left);
    }else{
        return left;
    }
}
Parser.prototype.modulative = function (atom){
    var left = atom;
    while(this.has("%")){
        this.advance();
        var right = this.atom(this.advance());
        left = new Modulus(left, right);
    }
    if(!(left instanceof Modulus)){
        return this.subtractive(left);
    }else{
        return left;
    }
}
Parser.prototype.eval = function () {
   
    var l = this.expression();
    console.log(l.eval());
};