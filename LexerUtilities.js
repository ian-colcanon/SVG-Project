var Dict = {
    
    EOF: "\\0",
    LEFT_PAREN: "(",
    RIGHT_PAREN: ")",
    LEFT_BRACE: "[",
    RIGHT_BRACE: "]",
    LEFT_BRACK: "{",
    RIGHT_BRACK: "}",
    COMMA: ",",
    DOT: ".",
    MINUS: "-",
    PLUS: "+",
    SEMICOLON: ";",
    SLASH: "/",
    STAR: "*",
    
    BANG: "!",
    BANG_EQUAL: "!=",
    EQUAL: "=",
    EQUAL_EQUAL: "==",
    GREATER: ">",
    GREATER_EQUAL: ">=",
    LESS: "<",
    LESS_EQUAL: "<=",
    
    AND: "&&",
    ELSE: "else",
    FALSE: "false",
    FOR: "for",
    IF: "if",
    OR: "||",
    PRINT: "print",
    RETURN: "return",
    THIS: "this",
    TRUE: "true",
    VAR: "var",
    WHILE: "while"

    
};

var Token = function (type, lex, lit, line) {
    
    this.type = type;
    this.lexeme = lex;
    this.literal = lit;
    this.line = line;
    
    this.toString = function () {
        return "Type: " + this.type + "  |  Lexeme: " + this.lex + "  |  Literal: " + this.lit + "  |";

    };
    
};

var Scanner = {
    
    source: "Hello all!",
    start: 0,
    current: 0,
    line: 1,
    tokens: [],
    
    init: function (txt) {
        this.source = txt;
    },
    
    getCurrent: function () {
        return this.source.charAt(this.current);
    },
    
    isAtEnd: function () {
        return this.current >= this.source.length;
    },
    
    advance: function () {
        this.current++;
        return this.source.charAt(this.current - 1);
    },
    
    match: function (char) {
        if(!this.isAtEnd() && this.getCurrent()){
            this.current++;
            return true;
        }else{
            return false;
        }
        
    },
    
    peek: function () {
        if (this.isAtEnd()) return '\0';
        return this.getCurrent();
    },
    
    addToken: function (type) {
       var current = new Token(type, null, null, this.line);
       this.tokens.push(current);
    },
    
    addTokenLiteral: function (type, lit) {
       var text = this.source.substr(this.start, this.current);
       this.tokens.push(new Token(type, text, lit, this.line));
       
    },
    
    scanTokens: function () {
        
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        
        if(this.isAtEnd()) {
            this.addToken(Dict.EOF);
        }else{
            console.error("Failed to reach end of file.");
        }
    },
    
    scanToken: function () {
        var c = this.advance();
        
        switch (c) {
            case '(': this.addToken(Dict.LEFT_PAREN); break;
            case ')': this.addToken(Dict.RIGHT_PAREN); break;
            case '[': this.addToken(Dict.LEFT_BRACE); break;
            case ']': this.addToken(Dict.RIGHT_BRACE); break;
            case '{': this.addToken(Dict.LEFT_BRACK); break;
            case '}': this.addToken(Dict.RIGHT_BRACK); break;
            case ',': this.addToken(Dict.COMMA); break;
            case '.': this.addToken(Dict.DOT); break;
            case '-': this.addToken(Dict.MINUS); break;
            case '+': this.addToken(Dict.PLUS); break;
            case ';': this.addToken(Dict.SEMICOLON); break;
            case '*': this.addToken(Dict.STAR); break;    
            case '!': this.addToken(this.match('=') ? Dict.BANG_EQUAL : Dict.BANG); break;
            case '=': this.addToken(this.match('=') ? Dict.EQUAL_EQUAL : Dict.EQUAL); break;
            case '>': this.addToken(this.match('=') ? Dict.GREATER_EQUAL : Dict.GREATER); break;
            case '<': this.addToken(this.match('=') ? Dict.LESS_EQUAL : Dict.LESS); break;
            
            case '/':
                if (this.match('/')){
                    while(this.peek() != '\n' && !this.isAtEnd()) this.advance();
                     
                }else{
                    this.addToken(Dict.SLASH);
                }
                break;
            
            case '\n': this.line++; break;
            case '\r': break;
            case '\t': break;
            case ' ': break;
            default: console.error("Unexpected Character: |" + c + "| at index " + (this.current-1) + "."); break;
                
        }
        
    },
    
    printTokens: function () {
        alert("The length of the array is " + this.tokens.length);
        for(var i = 0; i<this.tokens.length; i++){
            console.log(">" + this.tokens[i].toString());
        }
    }
    
    
      
};



