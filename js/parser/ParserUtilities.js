/* global Literal BinaryExpr Unary ParsingError Point BoundStatement Rectangle Circle Ellipse Console*/

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
    throw new ParsingError(this.peek().text, this.peek().line, "Expected \'" + id + "\'.");
};

Parser.prototype.check = function (id) {
    if (this.isAtEnd()) return false;

    return this.peek().type == id;

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

Parser.prototype.point = function () {
    try{
        var x = this.additive();
        this.consume('COMMA');
        var y = this.additive();
        return new Point(x, y);
    
    }catch(e){
        throw new ParsingError(e.token, e.line, "Missing or improperly formatted point.");
    }
};

Parser.prototype.parseColor = function () {
    this.consume('RGB');
    this.consume('L_PAREN');
    var r = this.expression();
    this.consume('COMMA');
    var g = this.expression();
    this.consume('COMMA');
    var b = this.expression();
    this.consume('R_PAREN');

    return new Color(r, g, b);
};

Parser.prototype.color = function () {
    var color = undefined;
    try {
        color = this.parseColor();
    } catch (e) {
        color = new Color(new Literal(0), new Literal(0), new Literal(0));
    }
    return color;
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

Parser.prototype.atom = function () {
    var token = this.peek();
    var type = token.type;
    switch(type){
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
            this.consume('R_PAREN');
            return inner;
        default:
            throw new ParsingError(token.text, token.line, "Missing or unrecognizeable expression.");       
    }
};



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
        case 'NEWLINE':
        default:
            this.synchronize();
           
            if(type != 'NEWLINE'){
                throw new ParsingError(token.text, token.line, "Invalid statement.");
            }
            break;
    }

};

Parser.prototype.printStatement = function () {
    var value = this.expression();
    this.consume('NEWLINE');
    return new PrintStatement(value);
};

Parser.prototype.boundStatement = function () {
    var width = this.expression();
    var height = this.expression();

    return new BoundStatement(width, height);
};

Parser.prototype.rectStatement = function () {
    var coords = this.point();
    
    console.log("next token: " + this.peek().type);
    var width = this.additive();
    
    var height = this.additive();
    
    var color = this.color();
    
    this.consume('NEWLINE');
    return new Rectangle(coords, width, height, color);
};

Parser.prototype.circleStatement = function () {
    
    var coords = this.point();
    var radius = this.additive();
    var color = this.color();

    this.consume('NEWLINE');
    return new Circle(coords, radius, color);
};

Parser.prototype.ellipseStatement = function () {
    var coords = this.point();
    var radX = this.additive();
    var radY = this.additive();
    var color = this.color();

    this.consume('NEWLINE');
    return new Ellipse(coords, radX, radY, color);
};

Parser.prototype.varDeclaration = function () {
    //  var name = this.consume('IDENTIFIER');

};