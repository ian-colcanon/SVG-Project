var Lexer = function (txt) {
    this.source = txt;
    
    this.start = 0;
    this.current = 0;
    this.line = 0;
    
    this.tokens = [];
    this.text_regex = /[a-z]/;
    
    
    this.optable = {
    
        '+':  'PLUS',
        '-':  'MINUS',
        '*':  'MULTIPLY',
        '.':  'PERIOD',
        '\\': 'BACKSLASH',
        ':':  'COLON',
        '%':  'PERCENT',
        '|':  'PIPE',
        '!':  'EXCLAMATION',
        '?':  'QUESTION',
        '#':  'POUND',
        '&':  'AMPERSAND',
        ';':  'SEMI',
        ',':  'COMMA',
        '(':  'L_PAREN',
        ')':  'R_PAREN',
        '<':  'L_ANG',
        '>':  'R_ANG',
        '{':  'L_BRACE',
        '}':  'R_BRACE',
        '[':  'L_BRACKET',
        ']':  'R_BRACKET',
        '=':  'EQUALS',
        '\\0': 'EOF'
    };
    
    this.keytable = {
        'for': 'FOR',
        'if': 'IF',
        'else': 'ELSE',
        'while': 'WHILE',
            
    };
    
    this.types = {
        OPERATOR: 'OPERATOR',
        STRING: 'STRING',
        REAL: 'REAL',
        INTEGER: 'INTEGER',
        KEYWORD: 'KEYWORD',
        IDENTIFIR: 'IDENTIFIER'
    };
    
};

var Token = function (type, lex, line) {
        
    this.type = type;
    this.lexeme = lex;
    this.line = line;


};

Token.prototype.toString = function () {
     return "Type: " + this.type + "  |  Lexeme: " + this.lexeme + "  |  Line #: " + this.line + "  |";
};


Lexer.prototype.isAtEnd = function () {
    return this.current >= this.source.length;    
    
}; 
    
Lexer.prototype.advance = function () {
    this.current++;
    return this.source.charAt(this.current - 1);
};

Lexer.prototype.match = function (char) {
    if(!this.isAtEnd() && this.peek() == char){
            this.current++;
            return true;
    }else{
            return false;
    }
        
};

Lexer.prototype.string = function () {
    while(this.peek() != '"' && !this.isAtEnd()){
        
        if(this.peek() == '\n') this.line++;
        this.advance();
                
    }
        
    if (this.isAtEnd()) console.error("Unterminated string detected.");
        

    var txt = this.source.substr(this.start + 1, this.current - 1);
    
    this.addToken(this.types.STRING, txt, this.line);
   
    this.advance();
    
};

Lexer.prototype.isDigit = function (n){
    return /[0-9]/.test(n);
};

Lexer.prototype.number = function (){
    while(this.isDigit(this.peek())) this.advance();
    
    var type = this.types.INTEGER;    
   
    if(this.peek() == '.' && this.isDigit(this.peekNext())){
        type = this.types.REAL;
        this.advance();
        while(this.isDigit(this.peek())) this.advance();
        
    }    
    
    var numText = this.source.substr(this.start, this.current);
    this.addToken(type, parseFloat(numText), this.line);
    
}

Lexer.prototype.getCurrent = function () {
    return this.source.charAt(this.source.length-1);
};

Lexer.prototype.peek = function () {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
    
};

Lexer.prototype.peekNext = function (){
    if(this.current + 1 >= this.source.length) return '\\0'; 
    return this.source.charAt(this.current + 1);
}

Lexer.prototype.addToken = function (type, text) {
    this.tokens.push(new Token(type, text, this.line));
    
};
    
Lexer.prototype.scanTokens = function () {
    
    var t0 = performance.now();
        
    while (!this.isAtEnd()) {
        this.start = this.current;
        this.scanToken();
    }
        
    if(this.isAtEnd()) {
        this.addToken('EOF', '\\0', this.line);
    
    }else{
        console.error("Failed to reach end of file.");
    }
    
    var t1 = performance.now();
    console.log("Process completed in " + (t1-t0).toFixed(3) + " milliseconds.");

};

Lexer.prototype.scanToken = function () {
        
        
        var c = this.advance();
        
        if(this.optable[c] !== undefined && c !== '/'){
            
            this.addToken(this.types[this.types.OPERATOR], c, this.line);
         
        }else {
            
            switch (c) {
           
                case '/':
                    if (this.match('/')){
                        while(this.peek() != '\n' && !this.isAtEnd()) this.advance();
                    
                    }else if (this.match('*')){
                   
                        while(!(this.peek() == '/' && this.getCurrent() == '*') && !this.isAtEnd()){
                            this.advance();
                        }
                
                    }else{
                        this.addToken(this.optable[c], c, this.line);
                    }
                    
                break;
                
                case '"': this.string(); break;
                case '\n': this.line++; break;
                case '\r': break;
                case '\t': break;
                case ' ': break;
                default: 
                    if(this.isDigit(c)){
                        this.number();    
                    }else{
                        console.error("Unexpected Character: |" + c + "| at index " + (this.current-1) + ".");
                    }
                    break;
            }        
        } 
};

Lexer.prototype.printTokens = function () {

    for(var i = 0; i<this.tokens.length; i++){
        console.log(">" + this.tokens[i].toString());
        console.log("");
    }
};