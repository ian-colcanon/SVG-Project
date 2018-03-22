var TokenTypes = {

    optable: {
        //Limit
        '->': 'LEFT_LIMIT',
        '<-': 'RIGHT_LIMIT',

        //Unary Operators
        '++': 'INCREMENT',
        '--': 'DECREMENT',
        '!': 'NOT',

        //Binary Operators
        '+': 'PLUS',
        '-': 'MINUS',
        '*': 'MULTIPLY',
        '/': 'DIVIDE',
        '%': 'MOD',
        '==': 'EQUAL',
        '!=': 'NOT_EQUAL',
        '<=': 'LESS_EQUAL',
        '>=': 'GREATER_EQUAL',
        '>': 'GREATER',
        '<': 'LESS',
        '=': 'ASSIGN',

        //Grouping
        ';': 'SEMI',
        ',': 'COMMA',
        '(': 'L_PAREN',
        ')': 'R_PAREN',
        '{': 'L_BRACE',
        '}': 'R_BRACE',
        '[': 'L_BRACKET',
        ']': 'R_BRACKET',
        '\n': 'NEWLINE',
        '\0': 'EOF',
        
        //Signifiers
        '~': 'STYLE',
    },

    keytable: {
        't': 'FRAME',
        'var': 'VAR',
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

        //Shapes & Related
        'rect': 'RECT',
        'circle': 'CIRCLE',
        'ellipse': 'ELLIPSE',
        'text': 'TEXT',
        'line': 'LINE',
        'poly': 'POLY',
        
        //Style & Color
        'rgb': 'RGB',
        'fill': 'FILL',
        'color': 'COLOR',
        'stroke-width': 'STROKE_W',
        
        //Math operations
        'sin': 'SINE',
        'cos': 'COSINE',
        'tan': 'TANGENT',
        'log': 'LOG',
        'ln': 'NAT_LOG',
        

    },

    types: {
        STRING: 'STRING',
        REAL: 'REAL',
        INTEGER: 'INTEGER',
        BOOLEAN: 'BOOLEAN',
        ID: 'ID',
        STYLE: 'STYLE',
    },
    
    attributes: {
        'fill': 'FILL',
        'color': 'COLOR',
        'stroke-width': 'STROKE_W',
        'stroke': 'STROKE',
    },
    
    math: {
        'sin': 'SINE',
        'cos': 'COSINE',
        'tan': 'TANGENT',
        'log': 'LOG',
        'ln': 'NAT_LOG',
    }

};