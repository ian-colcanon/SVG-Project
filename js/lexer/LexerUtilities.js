/* global TokenTypes LexingError*/

var Token = function (type, text, line) {
        
    this.type = type;
    this.text = text;
    this.line = line;


};

Token.prototype.toString = function () {
        
     return "Type: " + this.type + "\n   -Lexeme: " + this.text + "\n   -Line #: " + this.line + "\n";
};

var Lexer = function () {
    this.source = "";
    
    this.start = 0;
    this.current = 0;
    this.line = 0;
    
    this.errors = [];
    this.tokens = [];
    
    
    this.non_complex_ops = {
    
        '+':  'PLUS',
        '*':  'MULTIPLY',
        '/': 'DIVISION',
        '%':  'PERCENT',
        '\\': 'BACKSLASH',
        '.':  'PERIOD',
        ':':  'COLON',
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
    
};

Lexer.prototype.init = function (src) {
    this.tokens = [];
    this.source = src;
    this.start = 0;
    this.current = 0;
    this.line = 0;
}

Lexer.prototype.hasNext = function () {
    return this.current < this.source.length;    
    
}; 
    
Lexer.prototype.next = function () {
    this.current++;
    return this.source.charAt(this.current - 1);
};

Lexer.prototype.match = function (char) {
    if(this.hasNext() && this.peek() == char){
            this.current++;
            return true;
    }else{
            return false;
    }
        
};

Lexer.prototype.string = function (c) {
    var txt = "";
    while(this.hasNext() && this.peek() != c){
        
        if(this.peek() == '\n') this.line++;
        if(this.peek() == '\\' && (this.peekNext() == '\'' || this.peekNext() == '\"')) this.current++;
        txt += this.next();
         
    }
     
    if (!this.hasNext()) {
        throw new LexingError(this.line, "Unterminated String.");       
        
    }else{
        
        this.addToken(TokenTypes.types.STRING, txt);
    }
    
    this.next();
    
};

Lexer.prototype.isDigit = function (n) {
    return /[0-9]/.test(n);
};

Lexer.prototype.isText = function (n) {
    return /[A-Za-z]/.test(n);
};

Lexer.prototype.number = function () {
    while(this.isDigit(this.peek())) this.next();
    
    var type = TokenTypes.types.INTEGER;    
   
    if(this.peek() == '.' && this.isDigit(this.peekNext())){
        type = TokenTypes.types.REAL;
        this.next();
        while(this.isDigit(this.peek())) this.next();
        
    }    
    
    var numText = this.source.substring(this.start, this.current);
    this.addToken(type, parseFloat(numText));
    
};

Lexer.prototype.text = function () {
    
    while(this.isText(this.peek())){
        this.next();  
    } 
    
    var idText = this.source.substring(this.start, this.current);
    
    if(TokenTypes.keytable[idText] !== undefined){
        this.addToken(TokenTypes.keytable[idText], idText);
    
    }else if(idText == 'true' || idText == 'false'){
        this.addToken(TokenTypes.types.BOOLEAN, idText);
        
    }else{
        this.addToken(TokenTypes.types.IDENTIFIER, idText);
    }
};

Lexer.prototype.comment = function(c) {
    switch(c){
        case '/':
            if (this.match('/')){
                        //If it's a one-line comment, skip all the way to the end of the line, or until the string ends.
                        while(this.peek() != '\n' && this.hasNext()) this.next();
                    
                    }else if (this.match('*')){
                        //If it's a multi-line comment, continue through the text until a '*/' is reached or the string ends.
                        while(!(this.peek() == '/' && this.getCurrent() == '*') && this.hasNext()){
                            this.next();
                        }
                
                    }else{
                        //If the previous two cases evaluated false, the forward slash is a division operator. Add it as a token.
                        this.addToken(TokenTypes.optable['/'], c);
                    }
            break;
        case '#':
            while(this.peek() != '\n' && this.hasNext()) this.next();
            break;
    }
};

Lexer.prototype.getCurrent = function () {
    return this.source.charAt(this.source.length-1);
};

Lexer.prototype.peek = function () {
    if (!this.hasNext()) return '\0';
    return this.source.charAt(this.current);
    
};

Lexer.prototype.peekNext = function () {
    if(this.current + 1 >= this.source.length) return '\\0'; 
    return this.source.charAt(this.current + 1);
}

Lexer.prototype.addToken = function (type, text) {
    this.tokens.push(new Token(type, text, this.line));
    
};

Lexer.prototype.scanTokens = function () {
    
   
        
    while (this.hasNext()) {
        this.start = this.current;
        this.scanToken();
    }
        
    if(!this.hasNext()) {
        this.addToken(TokenTypes.optable['\n'], '\\n');
        this.addToken(TokenTypes.optable['\0'], '\\0');
        
    }else{
        console.error("Failed to reach end of file.");
    }
    
    return this.tokens;
};

Lexer.prototype.scanToken = function () {
    
        var c = this.next();
    
            switch (c) {
               
                case '*': this.addToken(TokenTypes.optable[c], c); break;
                case '(': this.addToken(TokenTypes.optable[c], c); break;
                case ')': this.addToken(TokenTypes.optable[c], c); break;
                case '[': this.addToken(TokenTypes.optable[c], c); break;
                case ']': this.addToken(TokenTypes.optable[c], c); break;
                case '{': this.addToken(TokenTypes.optable[c], c); break;
                case '}': this.addToken(TokenTypes.optable[c], c); break;
                case ',': this.addToken(TokenTypes.optable[c], c); break;
                case ';': this.addToken(TokenTypes.optable[c], c); break;
                case '%': this.addToken(TokenTypes.optable[c], c); break;
                
                case '+': 
                    if(this.match('+')){
                        this.addToken(TokenTypes.optable['++'], '++'); break;
                    }else{
                        this.addToken(TokenTypes.optable[c], c); 
                    }
                    break;
                    
                case '-':
                    if(this.match('>')) {
                        this.addToken(TokenTypes.optable['->'], '->');
                    
                    }else if(this.match('-')){
                        this.addToken(TokenTypes.optable['--'], '--');
                    
                    }else{
                        this.addToken(TokenTypes.optable[c], c);
                    }
                    
                    break;
                
                case '<':
                    if(this.match('-') && !/[1-9]/.test(this.peek())){
                        this.addToken(TokenTypes.optable['<-'], '<-');
                    }else if(this.match('=')){
                        this.addToken(TokenTypes.optable['<='], '<=');
                    
                    }else{
                        this.addToken(TokenTypes.optable[c], c);
                    }
                    
                    break;
                
                case '>':
                    if(this.match('=')){
                        this.addToken(TokenTypes.optable['>='], '>=');
                    }else{
                        this.addToken(TokenTypes.optable[c], c);
                    }
                    break;
                
                //If the given character is an equals, check to see if it's being used for assignment or equality
                case '=':
                    if (this.match('=')){
                        this.addToken(TokenTypes.optable['=='], '==');

                    }else{
                        this.addToken(TokenTypes.optable[c], c);

                    }
                    break;
                //If the given character is an exclamation mark, check to see whether it's unary or binary.
                case '!':
                    if (this.match('=')){
                        this.addToken(TokenTypes.optable['!='], '!=');   
                    }else{
                        this.addToken(TokenTypes.optable[c], c);
                        
                    }
                break;
                //If the character is either a forward slash or a pound sign, refer to the comment() function.
                case '/': this.comment(c); break;
                case '#': this.comment(c); break;
                    
                
                //Double or single quotes signify the beginning of a String literal; refer to the string() function.
                case '"': this.string(c); break;
                case '\'': this.string(c); break;
                
                //Newline characters mark the end of a statement, and next the Lexer's line index variable
                case '\n':
                    this.addToken(TokenTypes.optable[c], '\\n');
                    this.line++;
                    break;
               
                //All carriage returns, tabs, and spaces are ignored by the lexer.
                case '\r': break;
                case '\t': break;
                case ' ': break;
    
                //Numbers are handled within the default case because regular expressions are used for identification
                default: 
                    
                    //If the character is a number [0-9], process it as a potential integer or real number using the number() function.
                    if(this.isDigit(c)){
                        
                        this.number();    
                    
                    //If the character is alphabetical, process it as a potential keyword or identifier.
                    }else if(this.isText(c)){
                        
                        this.text();
                    
                    }else{
                        //if the charactrer is not numeric or alphabetical, mark it as an error.  
                    
                    }
                    break;
            }        
};

Lexer.prototype.printTokens = function () {
    
    var text = "";
    
    for(var i = 0; i<this.errors.length; i++){
        text += this.errors[i].toString() + '\n';
    }
    
    for(var j = 0; j<this.tokens.length; j++){
        text = text + ">" + this.tokens[j].toString() + "\n";
       
    }
    return text;
};





