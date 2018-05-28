/* global LexingError*/

var Lexer = {
    source: '',
    start: 0,
    current: 0,
    line: 1,

    errors: [],
    tokens: [],
    
    types: {
        STRING: 'STRING',
        INTEGER: 'INTEGER',
        BOOLEAN: 'BOOLEAN',
        REAL: 'REAL',
        ID: 'ID',
        OP: 'OP',
        KEY: 'KEY',
        SHAPE: 'SHAPE',
        ATTRIBUTE: 'ATTRIBUTE',
        T: 'T',
    },
    
    keys: {
        //Control flow
        'for': 'FOR',
        'if': 'IF',
        'else': 'ELSE',
        'while': 'WHILE',

        //Boolean Logic
        'and': 'AND',
        'or': 'OR',

        //Inherent functions
        'print': 'PRINT',
        'bounds': "BOUNDS",
        'draw': 'DRAW',
        
        //Style & Color
        'rgb': 'RGB',
        
        //Trig
        'sin': 'SINE',
        'cos': 'COSINE',
        'tan': 'TANGENT',
        'log': 'LOG',
        'ln': 'NAT_LOG',
        
    },
    
    attributes: {
        'fill': 'FILL',
        'color': 'COLOR',
        'stroke-width': 'STROKE_W',
        'stroke': 'STROKE',
        'alignment-baseline': "ALIGNMENT_BASELINE",
        'baseline-shift': 'BASELINE_SHIFT',
        'clip': 'CLIP',
        'clip-path': 'CLIP_PATH',
        'clip-rule': 'CLIP_RULE',

        'color-interpolation': 'COLOR_INTER',
        'color-interpolation-filters': 'COLOR_INTER_FILTERS',
        'color-rendering': 'COLOR_RENDER',
        'direction': 'DIRECTION',
        'dominant-baseline': 'DOMINANT_BASE',
        'fill-opacity': 'FILL_OPACITY',
        'fill-rule': 'FILL_RULE',
        'filter': 'FILTER',
        'flood-color': 'FLOOD_COLOR',
        'flood-opacity': 'FLOOD_OPACITY',
        'font-family': 'FONT_FAMILY',
        'font-size': 'FONT_SIZE',
        'font-size-adjust': 'FONT_SIZE_ADJUST',
        'white-space': "WHITE_SPACE",
        'word-spacing': 'WORD_SPACING',
        'font-stretch': 'FONT_STRETCHING',
        'font-style': 'FONT_STYLE',
        'font-variant': 'FONT_VARIANT',
        'font-weight': 'FONT_WEIGHT',
        'mask': 'MASK',
        'opacity': 'OPACITY',
        'overflow': 'OVERFLOW',
        'solid-color': 'SOLID_COLOR',
        'solid-opacity': 'SOLID_OPACITY',
        'stop-color': 'STOP_COLOR',
        'stop-opacity': 'STOP_OPACITY',
        'stroke-dasharray': 'STROKE_DASHARRAY',
        'stroke-dashoffset': 'STROKE_DASHOFFSET',
        'stroke-linecap': 'STROKE_LINECAP',
        'stroke-linejoin': 'STROKE_LINEJOIN',
        'stroke-miterlimit': 'STROKE_MITERLIMIT',
        'stroke-opacity': 'STROKE_OPACITY',
        'text-anchor': 'TEXT_ANCHOR',
        'text-decoration': 'TEXT_DECORATION',
        'text-overflow': 'TEXT_OVERFLOW',
        'text-rendering': 'TEXT_RENDER',

    },
    
    shapes: {
        'rect': 'RECT',
        'circle': 'CIRCLE',
        'ellipse': 'ELLIPSE',
        'text': 'TEXT',
        'line': 'LINE',
        'polyline': 'POLYLINE',
        'polygon': 'POLYGON',
    },
    
    init: function (src) {
        this.tokens = [];
        this.source = src;
        this.start = 0;
        this.current = 0;
        this.line = 1;
    },

    hasNext: function () {
        return this.current < this.source.length;
    },

    next: function () {
        this.current++;
        return this.source.charAt(this.current - 1);
    },

    match: function (char) {
        if (this.hasNext() && this.peek() == char) {
            this.current++;
            return true;
        } else {
            return false;
        }
    },

    string: function (char) {
        var txt = "";
        while (this.hasNext() && this.peek() != char) {

            if (this.peek() == '\n') this.line++;
            if (this.peek() == '\\' && (this.peekNext() == '\'' || this.peekNext() == '\"')) this.current++;
            txt += this.next();

        }

        if (!this.hasNext()) {
            throw new LexingError(this.line, "Unterminated String.");

        } else {

            this.addToken(txt, this.types.STRING);
        }

        this.next();

    },

    isDigit: function (char) {
        return /[0-9]/.test(char);
    },

    isText: function (char) {
        return /[[A-Z-a-z]/.test(char);
    },

    number: function () {
        while (this.isDigit(this.peek())) this.next();

        var type = this.types.INTEGER;

        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            type = this.types.REAL;
            this.next();
            while (this.isDigit(this.peek())) this.next();

        }
        var numText = this.source.substring(this.start, this.current);

        this.addToken(parseFloat(numText), type);
    },

    text: function () {
        while (this.isText(this.peek()) || this.peek().text == '-') {
            this.next();
        }

        var idText = this.source.substring(this.start, this.current);   
          
        if (this.keys[idText] !== undefined) {
            this.addToken(idText, this.types.KEY);

        } else if (this.shapes[idText] !== undefined) {
            this.addToken(idText, this.types.SHAPE);
        
        } else if (this.attributes[idText] !== undefined){
            this.addToken(idText, this.types.ATTRIBUTE);
        
        } else if (idText == 'true' || idText == 'false') {
            this.addToken(idText, this.types.BOOLEAN);

        } else {
            this.addToken(idText, this.types.ID);
        }
    },

    comment: function (char) {
        switch (char) {
            case '/':
                if (this.match('/')) {
                    //If it's a one-line comment, skip all the way to the end of the line, or until the string ends.
                    while (this.peek() != '\n' && this.hasNext()) this.next();

                } else if (this.match('*')) {
                    //If it's a multi-line comment, continue through the text until a '*/' is reached or the string ends.
                    while (!(this.peek() == '/' && this.getCurrent() == '*') && this.hasNext()) {
                        this.next();
                    }

                } else {
                    //If the previous two cases evaluated false, the forward slash is a division operator. Add it as a token.
                    this.addToken(char);
                }
                break;
            case '#':
                while (this.peek() != '\n' && this.hasNext()) this.next();
                break;
        }
    },

    getCurrent: function () {
        return this.source.charAt(this.source.length - 1);
    },

    peek: function () {
        if (!this.hasNext()) return '\0';
        return this.source.charAt(this.current);
    },

    previous: function () {
        if (this.current > 0) return this.source.charAt(this.current - 1);
        return null;
        
    },

    peekNext: function () {
        if (this.current + 1 >= this.source.length) return '\\0';
        return this.source.charAt(this.current + 1);
    },

    addToken: function (text, type) {
        if(type != undefined){
            this.tokens.push(new Token(type, text, this.line));    
        }else{
            this.tokens.push(new Token(this.types.OP, text, this.line));

        }
    },

    scanTokens: function () {
        while (this.hasNext()) {
            this.start = this.current;
            this.scanToken();
        }

        if (!this.hasNext()) {
            this.addToken('\\n', 'NEWLINE');
            this.addToken('\\0', 'EOF');
             

        } else {
            throw new LexingError(this.line, "Failed to reach EOF.");
        }

        return this.tokens;
    },

    scanToken: function () {
        var c = this.next();
        switch (c) {
            case 't':
                this.addToken(c, 'T');
                break;
                
            case '*':
            case '(':
            case ')':
            case '[':
            case ']':
            case '{':
            case '}':
            case ',':
            case '%':
            case '.':
            case '^':
            case '~':
            case ';':
                //if no type is specified, it is assumed to be an operator
                this.addToken(c);
                break;
            case '+':
                if (this.match('+')) {
                    this.addToken('++');

                } else if (this.match('=')) {
                    this.addToken('+=');

                } else {
                    this.addToken(c);
                }
                break;

            case '-':
                if (this.isDigit(this.peek()) && !this.isDigit(this.previous())) {
                    this.number();

                } else if (this.match('>')) {
                    this.addToken('->');

                } else if (this.match('-')) {
                    this.addToken('--');

                } else if (this.match('=')) {
                    this.addToken('-=');

                } else {
                    this.addToken(c);
                }

                break;

            case '<':
                if (this.match('-') && !/[1-9]/.test(this.peek())) {
                    this.addToken('<-');
                } else if (this.match('=')) {
                    this.addToken('<=');

                } else {
                    this.addToken(c);
                }
                break;

            case '>':
                if (this.match('=')) {
                    this.addToken('>=');
                } else {
                    this.addToken(c);
                }
                break;

                //If the given character is an equals, check to see if it's being used for assignment or equality
            case '=':
                if (this.match('=')) {
                    this.addToken('==');

                } else {
                    this.addToken(c);

                }
                break;
            case '|':
                if (this.match('=')) {
                    this.addToken('|=');
                }else if(this.match('|')){
                    this.addToken('||');
                }
                break;
                //If the given character is an exclamation mark, check to see whether it's unary or binary.
            case '!':
                if (this.match('=')) {
                    this.addToken('!=');
                } else {
                    this.addToken(c);

                }
                break;
                //If the character is either a forward slash or a pound sign, refer to the comment() function.
            case '/':
            case '#':
                this.comment(c);
                break;
                //Double or single quotes signify the beginning of a String literal; refer to the string() function.
            case '"':
            case '\'':
                this.string(c);
                break;

                //Newline characters mark the end of a statement, and next the Lexer's line index variable
            case '\n':
                this.addToken('\\n', 'NEWLINE');
                this.line++;
                break;

                //All carriage returns, tabs, and spaces are ignored by the lexer.
            case '\r':
            case '\t':
            case ' ':
                break;

                //Numbers are handled within the default case because regular expressions are used for identification
            default:

                //If the character is a number [0-9], process it as a potential integer or real number using the number() function.
                if (this.isDigit(c)) {

                    this.number();

                    //If the character is alphabetical, process it as a potential keyword or identifier.
                } else if (this.isText(c)) {

                    this.text();

                } else {
                    //if the charactrer is not numeric or alphabetical, mark it as an error.

                }
                break;
        }
    },

    printTokens: function () {

        var text = '';

        for (var i = 0; i < this.errors.length; i++) {
            text += this.errors[i].toString() + '\n';
        }

        for (var j = 0; j < this.tokens.length; j++) {
            text = text + '>' + this.tokens[j].toString() + '\n';

        }
        
        return text;
    }
}

var Token = function (type, text, line) {
    this.type = type;
    this.text = text;
    this.line = line;

};

Token.prototype.toString = function () {
    return "Type: " + this.type + "\n   -Lexeme: " + this.text + "\n   -Line #: " + this.line + "\n";
};