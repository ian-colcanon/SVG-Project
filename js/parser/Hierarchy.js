/* global Global */

function Statement() {}
Statement.prototype.constructor = Statement;

function Assignment(name, op, expr) {
    Statement.call(this);
    
    
    this.name = name;
    this.operator = op;
   
    switch(this.operator.text){
        case '=':
            this.type = 'ASSIGN';
            break;
        default:
            this.type = 'UNARY_ASSIGN';
    }
    
    this.expr = expr;
}
Assignment.prototype = Object.create(Statement.prototype);
Assignment.prototype.constructor = Assignment;
Assignment.prototype.eval = function (){
    switch(this.operator.text){
        case '=':
            Global.addVar(this.name, this.expr);
            break;
        case '+=':
            if(Global.checkVar(this.name)){
                Global.addVar(this.name, new Literal(Global.getVar(this.name).eval() + this.expr.eval()));   
            }else{
                Global.addVar(this.name, this.expr);
            }
            break;
        case '-=':
            if(Global.checkVar(this.name)){
                Global.addVar(this.name, new Literal(Global.getVar(this.name).eval() - this.expr.eval()));
            }else{
                Global.addVar(this.name, this.expr);
            }
            break;   
    }
    
}

function PrintStatement(value) {
    Statement.call(this);
    this.type = 'PRINT';
    this.value = value;
}
PrintStatement.prototype = Object.create(Statement.prototype);
PrintStatement.prototype.constructor = PrintStatement;
PrintStatement.prototype.eval = function (){
    Console.print(this.value.eval());
}

function BoundStatement(width, height) {
    Statement.call(this);
    this.type = 'BOUNDS';
    this.width = width;
    this.height = height;
}
BoundStatement.prototype = Object.create(Statement.prototype);
BoundStatement.prototype.constructor = BoundStatement;
BoundStatement.prototype.eval = function (){
    Engine.resize(this.width, this.height);
}

function For(declare, compare, increment, statements){
    Statement.call(this);
    this.type = 'FOR',
    this.declare = declare;
    this.compare = compare;
    this.increment = increment;
    this.statements = statements;
}
For.prototype = Object.create(Statement.prototype);
For.prototype.constructor = For;
For.prototype.eval = function (){
    this.declare.eval();
    
    while(this.compare.eval() == true){
        for(var i = 0; i< this.statements.length; ++i){
            this.statements[i].eval();
        }
        this.increment.eval();
    }
}



function Shape(styles) {
    Statement.call(this);
    this.type = 'SHAPE';
    this.styles = styles;
}
Shape.prototype = Object.create(Statement.prototype);
Shape.prototype.constructor = Shape;

Shape.prototype.evalStyles = function (){
    var attr = Global.getGlobalStyles();
    for(var i = 0; i<this.styles.length; i++){
        attr[this.styles[i].attribute] = this.styles[i].eval();
    }
    
    return attr;
};

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
    Engine.paint('rect', null, Object.assign(attr, this.evalStyles()));
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
    Engine.paint('circle', null, Object.assign(attr, this.evalStyles()));

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
    Engine.paint('ellipse', null, Object.assign(attr, this.evalStyles()));
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
    Engine.paint('text', this.getString(), Object.assign(attr, this.evalStyles()));
    
};
Text.prototype.getString = function (){
    return this.value.eval();
};

function PolyLine(coords, styles){
    Shape.call(this, styles);
    this.subtype = 'POLY';
    this.coordList = coords;
}
PolyLine.prototype = Object.create(Shape.prototype);
PolyLine.prototype.constructor = PolyLine;
PolyLine.prototype.eval = function (){
    var attr = {
        points: "",
    }
    for(var i = 0; i<this.coordList.length; i++){
        var point = this.coordList[i];
        attr.points += point.x.eval() + "," + point.y.eval() + " ";
    }
    
    Engine.paint('polyline', null, Object.assign(attr, this.evalStyles()));
    
};

function Line(coordOne, coordTwo, styles){
    Shape.call(this, styles);
    this.subtype = 'LINE';
    this.coordOne = coordOne;
    this.coordTwo = coordTwo;
    
}
Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;
Line.prototype.eval = function (){
    var attr = {
        x1: this.coordOne.x.eval(),
        y1: this.coordOne.y.eval(),
        x2: this.coordTwo.x.eval(),
        y2: this.coordTwo.y.eval(),
    }
    Engine.paint('line', null, Object.assign(attr, this.evalStyles()));
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
    Expr.call(this);
    this.val = a;

}
Literal.prototype = Object.create(Expr.prototype);
Literal.prototype.constructor = Literal;
Literal.prototype.eval = function () {
    return this.val;
};

function Variable(name) {
    Expr.call(this);
    this.name = name;
}
Variable.prototype = Object.create(Expr.prototype);
Variable.prototype.constructor = Variable;
Variable.prototype.eval = function (){
    return Global.getVar(this.name)assignment.eval();
}
Variable.prototype.update = function(expr){
    Global.addVar(this.name, expr.eval());
}

function Unary (op, a){
    this.operator = op;
    this.right = a;
    this.getValue = function (){
        
        var initial = new Variable(this.right);
        switch (this.operator.text) {
            case '--':
                return new Literal(initial.eval() - 1);
                
            case '++':
                return new Literal(initial.eval() + 1);
                
            case '!':
                return new Literal(!initial.eval());
        }
    }
}
Unary.prototype.constructor = Unary;

function UnaryExpr(op, a) {
    Expr.call(this);
    Unary.call(this, op, a);
}
UnaryExpr.prototype = Object.create(Expr.prototype);
UnaryExpr.prototype.constructor = UnaryExpr;
UnaryExpr.prototype.eval = function () {
    var value = this.getValue();
    Global.addVar(this.right, value);
    return value.eval();
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
    }
}

function Comparison(a, op, b){
    BinaryExpr.call(this, a, op, b);
}
Comparison.prototype = Object.create(BinaryExpr.prototype);
Comparison.prototype.constructor = Comparison;
Comparison.prototype.eval = function () {
    switch(this.operator){    
        case '==':
            return this.left.eval() == this.right.eval();
        case '!=':
            return this.left.eval() != this.right.eval();
        case '>':
            return this.left.eval() > this.right.eval();
        case '<':
            return this.left.eval() < this.right.eval();
        case '<=':
            return this.left.eval() <= this.right.eval();
        case '>=':
            return this.left.eval() >= this.right.eval();
    }
}

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

