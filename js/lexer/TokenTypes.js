var TokenTypes = {
    optable: {
        //Limit
        '->': 'L_LIMIT',
        '<-': 'R_LIMIT',

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
        '+=': 'INCR_ASSIGN',
        '-=': 'DECR_ASSIGN',
        '++': 'INCREMENT',
        '--': 'DECREMENT',
        '!': 'NOT',

        //Grouping
        ';': 'SEMI',
        ',': 'COMMA',
        '.': 'DOT',
        '(': 'L_PAREN',
        ')': 'R_PAREN',
        '{': 'L_BRACE',
        '}': 'R_BRACE',
        '[': 'L_BRACKET',
        ']': 'R_BRACKET',
        '\n': 'NEWLINE',
        '\0': 'EOF',
        
        //Signifiers
        '~': 'GLOBAL',
    },

    keytable: {
        't': 'T',
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
        'draw': 'DRAW',
        //Style & Color
        'rgb': 'RGB',
        
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
        ATTRIBUTE: 'ATTRIBUTE',
        SHAPE: 'SHAPE',
        UNARY: 'UNARY',
    },
    
    attributes: {
        'fill': 'FILL',
        'color': 'COLOR',
        'stroke-width': 'STROKE_W',
        'stroke': 'STROKE',
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
    
    unary: {
        '++': 'INCREMENT',
        '--': 'DECREMENT',
        '!': 'NOT',
    },
    
    math: {
        'sin': 'SINE',
        'cos': 'COSINE',
        'tan': 'TANGENT',
        'log': 'LOG',
        'ln': 'NAT_LOG',
    }

};