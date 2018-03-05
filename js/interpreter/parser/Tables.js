var TokenTypes = function () {
     this.table = {
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
        '\\0': 'EOF',
        '->': 'LEFT_LIMIT',
        '<-': 'RIGHT_LIMIT'
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

TokenTypes.prototype.check = function (token) {
    return this.optable[token] != undefined || this.keytable[token] != undefined;
};

TokenTypes.prototype.isOperator = function (token) {
    return this.optable[token] != undefined;  
};
    
TokenTypes.prototype.isKeyword = function (token) {
    return this.keytable[token] != undefined;  
};