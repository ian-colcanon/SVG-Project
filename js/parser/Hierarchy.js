function Statement () {
}
Statement.prototype.constructor = Statement;

function Declaration (name, expr) {
    Statement.call(this);
    this.name = name;
    this.expr = expr;
}
Declaration.prototype = Object.create(Statement.prototype);
Declaration.prototype.constructor = Declaration;

function PrintStatement (value) {
    Statement.call(this);
    this.type = 'PRINT';
    this.value = value;
}
PrintStatement.prototype = Object.create(Statement.prototype);
PrintStatement.prototype.constructor = PrintStatement;

function Shape () {
    Statement.call(this);
    this.type = 'SHAPE';
}
Shape.prototype = Object.create(Statement.prototype);
Shape.prototype.constructor = Shape;

function Rectangle (coords, width, height, color){
    Shape.call(this);
    this.subtype = 'RECT';
    this.coords = coords;
    this.height = height;
    this.width = width;
    this.color = color;
}
Rectangle.prototype = Object.create(Statement.prototype);
Rectangle.prototype.constructor = Rectangle;
Rectangle.prototype.eval = function () {
    var attr = {
        x: this.coords.x.eval(),
        y: this.coords.y.eval(),
        width: this.width.eval() + "px",
        height: this.height.eval() + "px",
        fill: this.color.eval(),
    }
    return attr;
};

function Circle (coords, radius, color){
    Shape.call(this);
    this.subtype = 'CIRCLE';
    this.coords = coords;
    this.radius = radius;
    this.color = color;
}
Circle.prototype = Object.create(Statement.prototype);
Circle.prototype.constructor = Circle;
Circle.prototype.eval = function () {
    var attr = {
        cx: this.coords.x.eval(),
        cy: this.coords.y.eval(),
        r: this.radius.eval(),
        fill: this.color.eval(),
    }
    return attr;
    
    
};
//function Circle (coords, radius, color);

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
Literal.prototype.eval = function (){
    return this.val;
};

function Unary(op, a){
    Expr.call(this);
    this.operator = op;
    this.right = a;
}
Unary.prototype = Object.create(Expr.prototype);
Unary.prototype.constructor = Unary;
Unary.prototype.eval = function () {
    switch(this.operator){
        case '--':
            return this.right.eval() - 1;
        case '++':
            return this.right.eval() + 1;
        case '!':
            return !this.right.eval();
    }
    
}

function BinaryExpr(a, op, b){
    Expr.call(this);
    this.left = a;
    this.operator = op;
    this.right = b;
    
}
BinaryExpr.prototype = Object.create(Expr.prototype);
BinaryExpr.prototype.constructor = BinaryExpr;
BinaryExpr.prototype.eval = function () {
    switch(this.operator){
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

function Point(x, y){
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
Color.prototype.eval = function (){
    var val = "rgb(";
    val += this.r.eval() + ",";
    val += this.g.eval() + ",";
    val += this.b.eval() + ")";
    return val;
};