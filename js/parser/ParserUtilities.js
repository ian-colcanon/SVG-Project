/* global Literal BinaryExpr Unary ParsingError Point BoundStatement Rectangle Circle Ellipse TokenTypes Global Console*/

//================== DECLARATION ==================//
var Parser = function () {
    this.tokens = [];
    this.current = 0;
};

//=============== PRIMARY FUNCTIONS ===============//
Parser.prototype.init = function (tokens) {
    this.current = 0;
    this.tokens = tokens;
};

Parser.prototype.isAtEnd = function () {
    return this.peek().type == 'EOF';
};

Parser.prototype.previous = function () {
    return this.tokens[this.current - 1];

};

Parser.prototype.has = function (item) {
    return item == this.tokens[this.current].text;
};

Parser.prototype.peek = function () {
    return this.tokens[this.current];
};

Parser.prototype.advance = function () {
    if (!this.isAtEnd()) this.current++;

    return this.previous();

};

Parser.prototype.consume = function (id) {
    if (this.check(id)) return this.advance();
    
    var message = "";
    if(TokenTypes.types[id] != undefined){
        switch(id){
            case 'ID':
                message = 'Expected an identifier.';
                break;
        }
    }else{
        message = "Expected \'" + id + '\'';
    }
    throw new ParsingError(this.peek().text, this.peek().line, message);
};

Parser.prototype.check = function (id) {
    if (this.isAtEnd()) return false;
    
    return (this.peek().type == id) || (this.peek().text == id);
};

Parser.prototype.match = function () {
    if (arguments.length == 0) return false;

    for (var i = 0; i < arguments.length; i++) {
        var tokenID = arguments[i];
        if (this.check(tokenID)) {
            this.advance();
            return true;
        }

    }

    return false;
};
Parser.prototype.synchronize = function () {
    this.advance();

    while (!this.isAtEnd()) {
        if (this.previous().type == 'NEWLINE' && this.peek().type != 'NEWLINE') {
            return;
        }
        switch (this.previous().type) {
            case 'FOR':
            case 'IF':
            case 'ELSE':
            case 'WHILE':
            case 'PRINT':
            case 'FRAME':
                return;
        }

        this.advance();
    }
};

Parser.prototype.eval = function () {
    try {
        var result = this.expression();
    } catch (RuntimeError) {
        RuntimeError.printMessage();
    }
    Console.log(result.eval());

};



//=============== EXPRESSION RULES ===============//
Parser.prototype.expression = function () {
    return this.comparison();
};

Parser.prototype.comparison = function () {
    var left = this.additive();
    while (this.match('NOT_EQUAL', 'EQUAL')) {
        var operator = this.previous().text;
        var right = this.additive();
        left = new BinaryExpr(left, operator, right);
    }
    return left;
};

Parser.prototype.additive = function () {
    var left = this.multiplicative();
    while (this.match('PLUS', 'MINUS')) {
        var operator = this.previous().text;
        var right = this.multiplicative();
        left = new BinaryExpr(left, operator, right);
    }

    return left;

};

Parser.prototype.multiplicative = function () {
    var left = this.unary();
    while (this.match('MULTIPLY', 'DIVIDE', 'MOD')) {
        var operator = this.previous().text;
        var right = this.unary();
        left = new BinaryExpr(left, operator, right);
    }

    return left;

};

Parser.prototype.unary = function () {
    if (this.match('NOT', 'DECREMENT', 'INCREMENT')) {
        var operator = this.previous();
        var right = this.unary();
        return new Unary(operator, right);
    }
    return this.atom();
};

Parser.prototype.grouping = function (){
    this.consume('(');
    var expr = this.expression();
    this.consume(')');
    return expr;
    
}
;
Parser.prototype.atom = function () {
    var token = this.peek();
    var type = token.type;
    switch (type) {
        case 'ID':
            this.advance();
            return new Variable(token);
        case 'INTEGER':
            this.advance();
            return new Literal(parseInt(this.previous().text));
        case 'REAL':
            this.advance();
            return new Literal(parseFloat(this.previous().text));
        case 'STRING':
            this.advance();
            return new Literal(this.previous().text);
        case 'BOOLEAN':
            this.advance();
            return new Literal((this.previous().text == 'true' ? true : false));
        case 'L_PAREN':
            this.advance();
            var inner = this.expression();
            this.consume(')');
            return inner;
        case 'RGB':
            this.advance();
            return this.color();
        default:
            throw new ParsingError(token.text, token.line, "Missing or unrecognizeable expression.");
    }
};

//=============== MISCELLANEOUS EXPRESSIONS ===============//

Parser.prototype.point = function () {
    try {
        var x = this.additive();
        this.consume(',');
        var y = this.additive();
        return new Point(x, y);

    } catch (e) {
        throw new ParsingError(e.token, e.line, "Missing or improperly formatted point.");
    }
};

Parser.prototype.color = function () {
    this.consume('(');

    var r = this.expression();
    this.consume(',');

    var g = this.expression();
    this.consume(',');

    var b = this.expression();
    this.consume(')');

    return new Color(r, g, b);
};
/*
Parser.prototype.color = function () {
    var color = undefined;
    try {
        color = this.parseColor();
    } catch (e) {
        color = new Color(new Literal(0), new Literal(0), new Literal(0));
    }
    return color;
};

*/

//=============== STATEMENT RULES ===============//
/* global PrintStatement*/
Parser.prototype.parse = function () {
    var program = [];
    var read = undefined;
    while (!this.isAtEnd()) {

        read = this.statement();
        read != undefined ? program.push(read) : null;
    }
    return program;
};

Parser.prototype.statement = function () {
    var token = this.peek();
    var type = token.type;

    switch (type) {
        case 'PRINT':
            this.advance();
            return this.printStatement();
        case 'VAR':
            this.advance();
            return this.assignStatement();
        case 'BOUNDS':
            this.advance();
            return this.boundStatement();
        case 'RECT':
            this.advance();
            return this.rectStatement();
        case 'CIRCLE':
            this.advance();
            return this.circleStatement();
        case 'ELLIPSE':
            this.advance();
            return this.ellipseStatement();
        case 'TEXT':
            this.advance();
            return this.textStatement();
        case 'LINE':
            this.advance();
            return this.lineStatement();
        case 'POLY':
            this.advance();
            return this.polyStatement();
        case 'STYLE':
            //advance statement not needed due to the dual usage of the styleStatement function as global and scope-based
            Global.addStyle(this.styleStatement());
            break;
        default:
            this.synchronize();

            if (type != 'NEWLINE') {
                throw new ParsingError(token.text, token.line, "Invalid statement.");
            }
            break;
    }

};

Parser.prototype.printStatement = function () {
    var value = this.expression();
    this.consume('\\n');
    return new PrintStatement(value);
};

Parser.prototype.assignStatement = function () {
    var id = this.consume('ID');
    this.consume('=');
    var value = this.expression();

    this.consume('\\n');
    return new Assignment(id.text, value);
};

Parser.prototype.forStatement = function () {
    var value = this.grouping();
    this.consume('for');
    
};

Parser.prototype.boundStatement = function () {
    var width = this.expression();
    var height = this.expression();

    return new BoundStatement(width, height);
};



Parser.prototype.rectStatement = function () {
    var coords = this.point();
    var width = this.additive();
    var height = this.additive();

    this.consume('\\n');

    var styles = this.getStyles();

    return new Rectangle(coords, width, height, styles);
};

Parser.prototype.circleStatement = function () {

    var coords = this.point();
    var radius = this.additive();

    this.consume('\\n');

    var styles = this.getStyles();

    return new Circle(coords, radius, styles);
};

Parser.prototype.ellipseStatement = function () {
    var coords = this.point();
    var radX = this.additive();
    var radY = this.additive();

    this.consume('\\n');

    var styles = this.getStyles();

    return new Ellipse(coords, radX, radY, styles);
};

Parser.prototype.textStatement = function () {
    var coords = this.point();
    var value = this.additive();

    this.consume('\\n');

    var styles = this.getStyles();

    return new Text(coords, value, styles);
};

Parser.prototype.polyStatement = function () {
    var points = [];

    for (var i = 0; i <= 2; ++i) {
        points.push(this.point());
    }

    while (this.peek().type != "NEWLINE") {
        points.push(this.point());
    }

    this.consume('\\n');

    var styles = this.getStyles();

    return new PolyLine(points, styles);

};

Parser.prototype.lineStatement = function () {
    var point1 = this.point();
    var point2 = this.point();

    this.consume('\\n');

    var styles = this.getStyles();

    return new Line(point1, point2, styles);
};


Parser.prototype.styleStatement = function () {
    this.consume('~');
    
    var attribute = this.peek().text;
    var line = this.peek().line;
    if (this.match('ATTRIBUTE')) {
        var attribute = this.previous();
        var val = this.expression();

        this.consume('\\n');
        return new Style(attribute.text, val);

    } else {
        throw new ParsingError(attribute, line, "Invalid style keyword.");
    }

};

Parser.prototype.getStyles = function () {
    var styles = [];

    while (this.peek().type == 'STYLE' || this.peek().type == 'NEWLINE') {

        if (this.peek().type == 'NEWLINE') {
            this.advance();
        } else {
            styles.push(this.styleStatement());
        }

    }

    return styles;
}
