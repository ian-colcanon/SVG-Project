

var Token = function (type, id, text, line) {
        
    this.type = type;
    this.id = id;
    this.text = text;
    this.line = line;


};

Token.prototype.toString = function () {
        
     return "Type: " + this.type + "\n   -Lexeme: " + this.id + "\n   -Line #: " + this.line + "\n";
};

var Lexer = function (txt) {
    this.source = txt;
    
    this.start = 0;
    this.current = 0;
    this.line = 0;
    
    this.tokens = [];
    this.text_regex = /[a-z]/;
    
    
    this.non_complex_ops = {
    
        '+':  'PLUS',
        '*':  'MULTIPLY',
        '.':  'PERIOD',
        '\\': 'BACKSLASH',
        '/': 'DIVISION',
        ':':  'COLON',
        '%':  'PERCENT',
        '!':  'EXCLAMATION',
        '?':  'QUESTION',
        ';':  'SEMI',
        ',':  'COMMA',
        '(':  'L_PAREN',
        ')':  'R_PAREN',
        '>':  'R_ANG',
        '{':  'L_BRACE',
        '}':  'R_BRACE',
        '[':  'L_BRACKET',
        ']':  'R_BRACKET',
        '\\0': 'EOF'
    };
    
    this.keytable = {
        'for': 'FOR',
        'if': 'IF',
        'else': 'ELSE',
        'while': 'WHILE',
        'and': 'AND',
        'or': 'OR',
        
    };
    
    this.types = {
        OPERATOR: 'OPERATOR',
        STRING: 'STRING',
        REAL: 'REAL',
        INTEGER: 'INTEGER',
        KEYWORD: 'KEYWORD',
        IDENTIFIER: 'IDENTIFIER'
    };
    
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
        

    var txt = this.source.substring(this.start + 1, this.current - 1);
    
    this.addToken(this.types.STRING, txt);
   
    this.advance();
    
};

Lexer.prototype.isDigit = function (n) {
    return /[0-9]/.test(n);
};

Lexer.prototype.isText = function (n) {
    return /[A-z]/.test(n);
}

Lexer.prototype.number = function () {
    while(this.isDigit(this.peek())) this.advance();
    
    var type = this.types.INTEGER;    
   
    if(this.peek() == '.' && this.isDigit(this.peekNext())){
        type = this.types.REAL;
        this.advance();
        while(this.isDigit(this.peek())) this.advance();
        
    }    
    
    var numText = this.source.substring(this.start, this.current);
    this.addToken(type, parseFloat(numText));
    
};

Lexer.prototype.text = function () {
    
    while(this.isText(this.peek())){
        this.advance();  
    } 
    
    var idText = this.source.substring(this.start, this.current);
    
    if(this.keytable[idText] !== undefined){
        
        this.addToken(this.types.KEYWORD, this.keytable[idText]);
    
    }else{
        
        this.addToken(this.types.IDENTIFIER, idText);
    }
};

Lexer.prototype.getCurrent = function () {
    return this.source.charAt(this.source.length-1);
};

Lexer.prototype.peek = function () {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
    
};

Lexer.prototype.peekNext = function () {
    if(this.current + 1 >= this.source.length) return '\\0'; 
    return this.source.charAt(this.current + 1);
}

Lexer.prototype.addToken = function (type, id, text) {
    this.tokens.push(new Token(type, id, text, this.line));
    
};
    
Lexer.prototype.scanTokens = function () {
    
    var t0 = performance.now();
        
    while (!this.isAtEnd()) {
        this.start = this.current;
        this.scanToken();
    }
        
    if(this.isAtEnd()) {
        this.addToken(this.types.OPERATOR, this.non_complex_ops['\\0'], '\\0');
    
    }else{
        console.error("Failed to reach end of file.");
    }
    
    var t1 = performance.now();
    console.log("Process completed in " + (t1-t0).toFixed(3) + " milliseconds.");

};

Lexer.prototype.scanToken = function () {
    
        var c = this.advance();
        
        //If the given character matches an operator and is not a forward slash, create a token for it
        //          ---forward slashes are handled separatly because of their use in denoting comments
    
        if(this.non_complex_ops[c] !== undefined){
            
            this.addToken(this.types[this.types.OPERATOR], this.non_complex_ops[c], c);
            
        } else {
            switch (c) {

                case '-':
                    if(this.match('>')) {
                        this.addToken(this.types.OPERATOR, 'LEFT_LIMIT', '->')
                    }else{
                        this.addToken(this.types.OPERATOR, 'MINUS', c);
                    }
        
                    break;
                
                case '<':
                    if(this.match('-') && !/[1-9]/.test(this.peek())){
                        this.addToken(this.types.OPERATOR, 'RIGHT_LIMIT', '<-');
                    }else{
                        this.addToken(this.types.OPERATOR, 'L_ANG');
                    }
                    
                    break;
                    
                //If the given character is an equals, check to see if it's being used for assignment or equality
                case '=':
                    if (this.match('=')){
                        this.addToken(this.types.OPERATOR, 'DOUBLE_EQUALS', '==');

                    }else{
                        this.addToken(this.types.OPERATOR, 'SINGLE_EQUAlS', c);

                    }
                    break;
                //If the given character is a forward slash, check if its a comment signifier or a division operator
                case '/':
                    if (this.match('/')){
                        //If it's a one-line comment, skip all the way to the end of the line, or until the string ends.
                        while(this.peek() != '\n' && !this.isAtEnd()) this.advance();
                    
                    }else if (this.match('*')){
                        //If it's a multi-line comment, continue through the text until a '*/' is reached or the string ends.
                        while(!(this.peek() == '/' && this.getCurrent() == '*') && !this.isAtEnd()){
                            this.advance();
                        }
                
                    }else{
                        //If the previous two cases evaluated false, the forward slash is a division operator. Add it as a token.
                        this.addToken(this.types.OPERATOR, 'DIVISION', c);
                    }
                    
                break;
                
                //Double quotes signify the beginning of a String literal, lexing of which is handled by the string() function
                case '"': this.string(); break;
                
                //Newline characters mark the end of a statement, and advance the Lexer's line index variable
                case '\n': this.line++; break;
               
                //All carriage returns, tabs, and spaces are ignored by the lexer.
                case '\r': break;
                case '\t': break;
                case ' ': break;
                
                //Numbers are handled within the default case because regular expressions are used for identification
                default: 
                    
                    //If the character is a number [0-9], process it as a potential integer or real number using the number() function.
                    if(this.isDigit(c)){
                        
                        this.number();    
                    
                    //If the character is a letter [A-z], process it as a potential keyword or identifier.
                    }else if(this.isText()){
                        
                        this.text();
                    
                    }else{
                        //If the character is not a number or a character between A and z,it is unidentifiable. Throw an error message to the console.
                    
                        
                        console.error("Unexpected Character: |" + c + "| at index " + (this.current-1) + ".");
                    }
                    
                    
                    break;
            }        
        } 
};

Lexer.prototype.printTokens = function () {
    var text = "";
    for(var i = 0; i<this.tokens.length; i++){
        text = text + ">" + this.tokens[i].toString() + "\n";
       
    }
    return text;
};