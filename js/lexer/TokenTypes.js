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
        '^': 'POW',
        'sin': 'SIN',
        'cos': 'COS',
        'tan': 'TAN',
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
        'sin': 'SIN',
        'cos': 'COS',
        'tan': 'TAN',
        'log': 'LOG',
        'ln': 'NAT_LOG',


    },

    types: {
        STRING: 'STRING',
        REAL: 'REAL',
        INTEGER: 'INTEGER',
        BOOLEAN: 'BOOLEAN',
        ID: 'ID',
        SHAPE: 'SHAPE',
        UNARY: 'UNARY',
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
