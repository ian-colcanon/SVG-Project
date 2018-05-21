/* global Literal BinaryExpr UnaryExpr ParsingError Point BoundStatement Rectangle Circle Ellipse Global Console For Comparison Assignment Variable TimeStep Color, Text, Polyline, Line, Style*/

//================== DECLARATION ==================//

var Parser = {
    tokens: [],
    current: 0,

    init: function (tokens) {
        this.current = 0;
        this.tokens = tokens;
    },

    isAtEnd: function () {
        return this.peek().type == 'EOF';
    },

    previous: function () {
        return this.tokens[this.current - 1];
    },

    has: function (item) {
        return item == this.tokens[this.current].text;
    },

    peek: function () {
        return this.tokens[this.current];
    },

    advance: function () {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    },

    consume: function () {
        if (arguments.length == 0) return false;

        for (var i = 0; i < arguments.length; ++i) {
            if (this.check(arguments[i])) return this.advance();
        }

        var message;

        switch (arguments[arguments.length - 1]) {
            case 'ID':
                message = 'Expected an identifier.';
                break;
            case 'UNARY':
                message = 'Expected a unary operation.';
                break;
            default:
                message = "Expected \'" + arguments[arguments.length - 1] + '\'';
                break;
        }

        throw new ParsingError(this.peek().line, message);
    },

    check: function (id) {
        if (this.isAtEnd()) return false;
        return (this.peek().type == id) || (this.peek().text == id);
    },

    match: function () {
        if (arguments.length == 0) return false;

        for (var i = 0; i < arguments.length; i++) {
            var tokenID = arguments[i];
            if (this.check(tokenID)) {
                this.advance();
                return true;
            }

        }

        return false;
    },

    synchronize: function () {
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
    },

    eval: function () {
        try {
            var result = this.expression();
        } catch (RuntimeError) {
            RuntimeError.printMessage();
        }
        Console.log(result.eval());
    },

    expression: function () {
        return this.assignment();
    },

    grouping: function () {
        if (this.match('(')) {
            var expr = this.expression();
            this.consume(')');
            return expr;
        } else {
            throw new ParsingError(this.previous.line, "Expected \')\'");
        }
    },

    assignment: function () {
        var left = this.comparison();

        while (this.match('=', '|=', '-=', '+=')) {
            var operator = this.previous();

            if (!(left instanceof Variable)) {
                throw new ParsingError(this.previous().line, "An identifier cannot be assigned to an expression.");
            } else {
                var expr;
                if (this.match('SHAPE')) {
                    expr = this.shape(this.previous());
                } else {
                    expr = this.expression();
                }
                return new Assignment(left, operator, expr);
            }

        }
        return left;
    },


    comparison: function () {
        var left = this.additive();
        while (this.match('NOT_EQUAL', 'EQUAL', 'LESS_EQUAL', 'GREATER_EQUAL', 'GREATER', 'LESS')) {
            var operator = this.previous().text;
            var right = this.additive();
            left = new Comparison(left, operator, right);
        }
        return left;
    },

    additive: function () {
        var left = this.multiplicative();
        while (this.match('PLUS', 'MINUS')) {
            var operator = this.previous().text;
            var right = this.multiplicative();
            left = new BinaryExpr(left, operator, right);
        }

        return left;
    },

    multiplicative: function () {
        var left = this.exponential();
        while (this.match('MULTIPLY', 'DIVIDE', 'MOD', 'POW')) {
            var operator = this.previous().text;
            var right = this.exponential();
            left = new BinaryExpr(left, operator, right);
        }

        return left;

    },

    exponential: function () {
        var left = this.unary();

        while (this.match('POW')) {
            var operator = this.previous().text;
            var right = this.atom();
            left = new BinaryExpr(left, operator, right);
        }

        return left
    },

    unary: function () {
        if (this.match('UNARY')) {
            var operator = this.previous();
            var right;

            right = this.consume('ID');
            return new UnaryExpr(operator, right);
        } else if (this.match('SIN', 'COS', 'TAN')) {
            var operator = this.previous();
            right = this.grouping();
            return new TrigExpr(operator, right);
        }
        return this.atom();
    },

    atom: function () {
        var token = this.peek();
        var type = token.type;
        switch (type) {
            case 'ID':
                this.advance();

                if (this.peek().type == 'UNARY' && this.peek().text != '!') {
                    return new UnaryExpr(this.advance(), token);
                } else if (this.peek().type == 'DOT') {
                    this.advance();
                    var reference = this.consume('ID');
                    return new Variable(token, reference);
                } else {
                    return new Variable(token);
                }
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
            case 'T':
                return new Variable(this.advance());
            default:
                throw new ParsingError(token.line, "Missing or unrecognizeable expression.");
        }
    },

    point: function () {
        try {
            var x = this.additive();

            this.consume(',');

            var y = this.additive();

            return new Point(x, y);
        } catch (e) {
            throw new ParsingError(e.line, "Missing or improperly formatted point.");
        }

    },

    shape: function (token) {
        switch (token.text) {
            case 'rect':
                return this.rectStatement();
            case 'circle':
                return this.circleStatement();
            case 'ellipse':
                return this.ellipseStatement();
            case 'text':
                return this.textStatement();
            case 'line':
                return this.lineStatement();
            case 'polygon':
                return this.polyStatement(token.text);
            case 'polyline':
                return this.polyStatement(token.text);
        }

    },

    color: function () {
        this.consume('(');

        var r = this.expression();
        this.consume(',');

        var g = this.expression();
        this.consume(',');

        var b = this.expression();
        this.consume(')');

        return new Color(r, g, b);

    },

    parse: function () {
        var program = [];
        var read = undefined;

        while (!this.isAtEnd()) {
            read = this.statement();
            read != undefined ? program.push(read) : null;
        }

        return program;

    },

    statement: function () {
        var token = this.peek();
        var type = token.type;

        switch (type) {
            case 'PRINT':
                this.advance();
                return this.printStatement();
            case 'BOUNDS':
                this.advance();
                return this.boundStatement();
            case 'UNARY':
                return this.unaryStatement(this.advance());
            case 'GLOBAL':
                this.advance();
                return this.globalStatement();
            case 'IF':
                this.advance();
                return this.ifStatement();
            case 'FOR':
                this.advance();
                return this.forStatement();
            case 'DRAW':
                this.advance();
                return this.drawStatement();
            case 'ID':
                var expr = this.expression();
                if (expr instanceof Assignment || expr instanceof UnaryExpr) {
                    return expr;
                } else {
                    throw new ParsingError(token.line, "Invalid statement.");
                }
            case 'INTEGER':
                var expr = this.expression();
                return this.timestep(expr);
            case 'T':
                return this.timestep(this.advance());
            default:
                this.synchronize();

                if (type != 'NEWLINE') {
                    throw new ParsingError(token.line, "Invalid statement.");
                }
                break;


        }

    },

    globalStatement: function () {
        var val;
        switch (this.peek().type) {
            case 'SHAPE':
                return new GlobalStatement(this.shape());
            case 'ID':
                if (TokenTypes.attributes[this.peek().text] != undefined) {
                    var attr = this.advance();
                    this.consume('=');
                    val = this.expression();
                    return new GlobalStyle(attr, val);
                } else {
                    val = this.expression();
                    if (!(assign instanceof Assignment) || assign.type != 'ASSIGN') throw new ParsingError(this.peek().line, 'Expected an non-unary assignment.');
                    return val;
                }

            default:
                throw new ParsingError(this.peek().line, 'Invalid global statement.');

        }
    },

    printStatement: function () {
        var value = this.expression();
        
        this.consume('\\n');
        
        return new PrintStatement(value);
    },

    drawStatement: function () {
        var element;

        if (this.peek().type == 'SHAPE') {
            element = this.shape(this.advance());

        } else if (this.peek().type == 'ID') {
            element = new Variable(this.advance());

        } else {
            throw new ParsingError(this.peek().line, "Expected a valid shape reference or declaration.");
        }

        return new DrawStatement(element);
    },

    unaryStatement: function (token) {
        var prev = this.previous();
        switch (token.type) {
            case 'UNARY':
                var id = this.consume('ID');

                this.consume('\\N');

                return new UnaryExpr(prev, id);
            case 'ID':
                var operator = this.consume('UNARY');
                if (operator.text == '!') {
                    throw new ParsingError(operator.line, "Invalid use of the NOT operator.");
                } else {
                    return new UnaryExpr(operator, prev);
                }
        }

    },

    ifStatement: function () {
        this.consume('(');

        var expr = this.expression();
        if (!(expr instanceof Comparison)) {
            throw new ParsingError(this.peek().line, "Expected a boolean operation.");
        }

        this.consume(')')

        var line = this.consume('{').line;
        
        
        if (this.peek().type == 'NEWLINE') {
            this.consume('\\n');
        }
        
        
        var statements = [];
        while (!this.isAtEnd() && this.peek().text != '}') {
            var temp = this.statement();
            temp != undefined ? statements.push(temp) : null;

        }

        if (this.isAtEnd()) {
            throw new ParsingError(line, "Unclosed if statement.");

        } else {
            this.consume('}');
            return new If(expr, statements);
        }

    },

    forStatement: function () {
        this.consume('(');

        var declare = this.expression();
        if (!(declare instanceof Assignment || declare instanceof Variable)) {
            throw new ParsingError(this.peek().line, "Expected a declaration or assignment.");
        }
        this.consume(';');

        var compare = this.expression();
        if (!(compare instanceof Comparison)) {
            throw new ParsingError(this.peek().line, "Expected a comparison.");
        }

        this.consume(';');

        var increment = this.expression();
        if (!(increment instanceof UnaryExpr || increment instanceof Assignment)) {
            throw new ParsingError(this.peek().line, "Expected an update.");
        }

        this.consume(')');

        var line = this.consume('{').line;
        
        if (this.peek().type == 'NEWLINE') {
            this.consume('\\n');
        }
        
        var statements = [];
        while (!this.isAtEnd() && this.peek().text != '}') {
            var temp = this.statement();
            temp != undefined ? statements.push(temp) : null;

        }

        if (this.isAtEnd()) {
            throw new ParsingError(line, "Unclosed for loop.");
        } else {
            this.consume('}');
            return new For(declare, compare, increment, statements);
        }

    },

    timestep: function (left) {
        var operator = this.consume('R_LIMIT', 'L_LIMIT');

        var upper;
        var lower;

        if (left instanceof Literal) {
            this.consume('T');
            switch (operator.type) {
                case 'R_LIMIT':
                    upper = left;
                    if (this.peek().type == operator.type) {
                        this.advance();
                        lower = this.expression();
                    } else {
                        lower = undefined;
                    }
                    break;
                case 'L_LIMIT':
                    lower = left;
                    if (this.peek().type == operator.type) {
                        this.advance();
                        upper = this.expression();
                    } else {
                        upper = undefined;
                    }
                    break;
            }
        } else if (left.type == 'T') {
            var expr = this.expression();
            switch (operator.type) {
                case 'R_LIMIT':
                    lower = expr;
                    upper = undefined;
                    break;
                case 'L_LIMIT':
                    upper = expr;
                    lower = undefined;
                    break;
            }

        }
        
        this.consume('{');

        var statements = [];
        while (!this.isAtEnd() && this.peek().type != 'R_BRACE') {

            var temp = this.statement();
            if (temp instanceof GlobalStyle) throw new ParsingError(this.peek().line, "Global statements cannot occur within timesteps.");
            temp != undefined ? statements.push(temp) : null;
        }
        
        this.consume('}');
        
        return new TimeStep(lower, upper, statements);


    },

    boundStatement: function () {
        var width = this.expression();
        var height = this.expression();

        this.consume('\\n');
        
        return new BoundStatement(width, height);

    },

    rectStatement: function () {
        var coords = this.point();
        var width = this.additive();
        var height = this.additive();

        this.consume('\\n');

        return new Rectangle(coords, width, height);

    },

    circleStatement: function () {
        var coords = this.point();
        var radius = this.additive();

        this.consume('\\n');

        return new Circle(coords, radius);

    },

    ellipseStatement: function () {
        var coords = this.point();
        var radX = this.additive();
        var radY = this.additive();

        this.consume('\\n');

        return new Ellipse(coords, radX, radY);

    },

    textStatement: function () {
        var coords = this.point();
        var value = this.additive();

        this.consume('\\n');

        return new Text(coords, value);
    },

    polyStatement: function (type) {
        var points = [];

        for (var i = 0; i <= 2; ++i) {
            points.push(this.point());
        }

        while (this.peek().type != "NEWLINE") {
            points.push(this.point());
        }

        this.consume('\\n');

        switch (type) {
            case 'polyline':
                return new Polyline(points);
            case 'polygon':
                return new Polygon(points);
        }
    },

    lineStatement: function () {
        var point1 = this.point();
        var point2 = this.point();

        this.consume('\\n');

        return new Line(point1, point2);
    }

}