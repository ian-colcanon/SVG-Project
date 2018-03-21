function Statement() {}
Statement.prototype.constructor = Statement;

function Declaration(name, expr) {
    Statement.call(this);
    this.name = name;
    this.expr = expr;
}
Declaration.prototype = Object.create(Statement.prototype);
Declaration.prototype.constructor = Declaration;

function PrintStatement(value) {
    Statement.call(this);
    this.type = 'PRINT';
    this.value = value;
}
PrintStatement.prototype = Object.create(Statement.prototype);
PrintStatement.prototype.constructor = PrintStatement;

function BoundStatement(width, height) {
    Statement.call(this);
    this.type = 'BOUNDS';
    this.width = width;
    this.height = height;
}
BoundStatement.prototype = Object.create(Statement.prototype);
BoundStatement.prototype.constructor = BoundStatement;

function Shape(styles) {
    Statement.call(this);
    this.type = 'SHAPE';
    this.styles = styles;
}
Shape.prototype = Object.create(Statement.prototype);
Shape.prototype.constructor = Shape;
Shape.prototype.getStyleValue = function (attribute){
    for(var i = 0; i<this.styles.length; ++i){
        if(this.styles[i].attribute == attribute){
            return this.styles[i].eval();
        }
    }
    return this.defaultStyleValue(attribute);
    
};
Shape.prototype.defaultStyleValue = function (attribute){
    switch(attribute){
        case 'fill':
            return new Style(attribute, new Literal('black'));
        case 'color':
            return new Style(attribute, new Literal('none'));
    }
    
};
Shape.prototype.evalStyles = function (){
    var attr = {
        fill: this.getStyleValue('fill'),
        color: this.getStyleValue('color'),
    }
    return attr;
}

function Rectangle(coords, width, height, styles) {
    Shape.call(this, styles);
    this.subtype = 'RECT';
    this.coords = coords;
    this.height = height;
    this.width = width;
}
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
Rectangle.prototype.eval = function () {
    var attr = {
        x: this.coords.x.eval(),
        y: this.coords.y.eval(),
        width: this.width.eval() + "px",
        height: this.height.eval() + "px",
    }
    return Object.assign(attr, this.evalStyles());
};

function Circle(coords, radius, styles) {
    Shape.call(this, styles);
    this.subtype = 'CIRCLE';
    this.coords = coords;
    this.radius = radius;
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
Circle.prototype.eval = function () {
    var attr = {
        cx: this.coords.x.eval(),
        cy: this.coords.y.eval(),
        r: this.radius.eval(),
    }
    return Object.assign(attr, this.evalStyles());


};

function Ellipse(coords, radiusX, radiusY, styles) {
    Shape.call(this, styles);
    this.subtype = 'ELLIPSE';
    this.coords = coords;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
}
Ellipse.prototype = Object.create(Shape.prototype);
Ellipse.prototype.constructor = Ellipse;
Ellipse.prototype.eval = function () {
    var attr = {
        cx: this.coords.x.eval(),
        cy: this.coords.y.eval(),
        rx: this.radiusX.eval(),
        ry: this.radiusY.eval(),
    }
    return Object.assign(attr, this.evalStyles());
}

function Text(coords, value, styles){
    Shape.call(this, styles);
    this.subtype = 'TEXT';
    this.coords = coords;
    this.value = value;
}
Text.prototype = Object.create(Shape.prototype);
Text.prototype.constructor = Text;
Text.prototype.eval = function() {
    var attr = {
        x: this.coords.x.eval(),
        y: this.coords.y.eval(),
    }
    return Object.assign(attr, this.evalStyles());
    
};
Text.prototype.getString = function (){
    return this.value.eval();
};

function Style(attribute, value){
    Statement.call(this);
    this.attribute = attribute;
    this.value = value;
}
Style.prototype = Object.create(Statement.prototype);
Style.prototype.constructor = Style;
Style.prototype.eval = function (){
    return this.value.eval();
}



function Expr() {
    this.type = 'EXPRESSION';
}
Expr.prototype.constructor = Expr();
Expr.prototype.eval = function () {};

function Literal(a) {
    this.val = a;

}
Literal.prototype = Object.create(Expr.prototype);
Literal.prototype.constructor = Literal;
Literal.prototype.eval = function () {
    return this.val;
};

function Unary(op, a) {
    Expr.call(this);
    this.operator = op;
    this.right = a;
}
Unary.prototype = Object.create(Expr.prototype);
Unary.prototype.constructor = Unary;
Unary.prototype.eval = function () {
    switch (this.operator) {
        case '--':
            return this.right.eval() - 1;
        case '++':
            return this.right.eval() + 1;
        case '!':
            return !this.right.eval();
    }

}

function BinaryExpr(a, op, b) {
    Expr.call(this);
    this.left = a;
    this.operator = op;
    this.right = b;

}
BinaryExpr.prototype = Object.create(Expr.prototype);
BinaryExpr.prototype.constructor = BinaryExpr;
BinaryExpr.prototype.eval = function () {
    switch (this.operator) {
        case '+':
            return this.left.eval() + this.right.eval();
        case '-':
            return this.left.eval() - this.right.eval();
        case '*':
            return this.left.eval() * this.right.eval();
        case '/':
            return this.left.eval() / this.right.eval();
        case '%':
            return this.left.eval() % this.right.eval();
        case '==':
            return this.left.eval() == this.right.eval();
        case '!=':
            return this.left.eval() != this.right.eval();
    }
};

function Point(x, y) {
    Expr.call(this);
    this.x = x;
    this.y = y;
}
Point.prototype = Object.create(Expr.prototype);
Point.prototype.constructor = Point;

function Color(r, g, b) {
    Expr.call(this);
    this.r = r;
    this.g = g;
    this.b = b;
}
Color.prototype = Object.create(Expr.prototype);
Color.prototype.constructor = Color;
Color.prototype.eval = function () {
    var val = "rgb(";
    val += this.r.eval() + ",";
    val += this.g.eval() + ",";
    val += this.b.eval() + ")";
    return val;
};
