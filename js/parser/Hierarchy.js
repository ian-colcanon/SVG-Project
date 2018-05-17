/* global Global Map*/

function Statement() {}
Statement.prototype.constructor = Statement;

function Assignment(id, op, expr) {
    Statement.call(this);
    this.id = id;
    this.operator = op;
    this.expr = expr;
}
Assignment.prototype = Object.create(Statement.prototype);
Assignment.prototype.constructor = Assignment;
Assignment.prototype.eval = function () {
    switch (this.operator.text) {
        case '=':
            this.id.update(this.expr, true);
            break;
        case '|=':
            this.id.update(this.expr, false);
            break;
        case '+=':
            this.id.update(new Literal(Global.getVar(this.id).eval() + this.expr.eval()));
            break;
        case '-=':
            this.id.update(new Literal(Global.getVar(this.name).eval() - this.expr.eval()));
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
PrintStatement.prototype.eval = function () {
    Console.print(this.value.eval());
    console.log(this.value.eval());
}

function DrawStatement(shape) {
    Statement.call(this);
    this.type = 'DRAW';
    this.shape = shape;
}
DrawStatement.prototype = Object.create(Statement.prototype);
DrawStatement.prototype.constructor = DrawStatement;
DrawStatement.prototype.eval = function () {
    this.shape.eval();
}

function BoundStatement(width, height) {
    Statement.call(this);
    this.type = 'BOUNDS';
    this.width = width;
    this.height = height;
}
BoundStatement.prototype = Object.create(Statement.prototype);
BoundStatement.prototype.constructor = BoundStatement;
BoundStatement.prototype.eval = function () {
    Engine.resize(this.width, this.height);
}

function If(expr, statements){
  Statement.call(this);
  this.type = 'IF';
  this.expr = expr;
  this.statements = statements;

}
If.prototype = Object.create(Statement.prototype);
If.prototype.constructor = If;
If.prototype.eval = function () {
  if(this.expr.eval() == true){
    for(var i = 0; i<this.statements.length; ++i){
      this.statements[i].eval();
    }
  }
}

function For(declare, compare, increment, statements) {
    Statement.call(this);
    this.type = 'FOR';
    this.declare = declare;
    this.compare = compare;
    this.increment = increment;
    this.statements = statements;
}
For.prototype = Object.create(Statement.prototype);
For.prototype.constructor = For;
For.prototype.eval = function () {
    this.declare.eval();

    while (this.compare.eval() == true) {
        for (var i = 0; i < this.statements.length; ++i) {
            this.statements[i].eval();
        }
        this.increment.eval();
    }
}

function TimeStep(start, end, statements) {
    Statement.call(this);
    this.type = 'TIME';

    if(start instanceof Literal){
        this.start = start.eval();
    }

    if(end instanceof Literal){
        this.end = end.eval();
    }else{
        this.end = 1000;
    }

    this.statements = statements;
    this.frames = [];
}
TimeStep.prototype = Object.create(Statement.prototype);
TimeStep.prototype.constructor = TimeStep;
TimeStep.prototype.eval = function () {
    if(this.check(Engine.frameIndex)){
        for (var i = 0; i < this.statements.length; ++i) {
            this.statements[i].eval();
        }    
    }
}
TimeStep.prototype.check = function (index) {
    if(this.start == undefined){
        return index <= this.end;
    }else if(this.end == undefined){
        return index >= this.start;
    }else{
        return index >= this.start && index <= this.end;
    }
}

function Shape() {
    Statement.call(this);
    this.styles = new Map();
}
Shape.prototype = Object.create(Statement.prototype);
Shape.prototype.constructor = Shape;

Shape.prototype.evalStyles = function () {
    var attr = Global.getGlobalStyles();

    this.styles.forEach(function (val, key, map) {
        attr[key] = val.eval();
    });

    return attr;
};

function Rectangle(coords, width, height) {
    Shape.call(this);
    this.x = coords.x;
    this.y = coords.y;
    this.height = height;
    this.width = width;

}
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
Rectangle.prototype.eval = function () {
    var attr = {
        x: this.x.eval(),
        y: this.y.eval(),
        width: this.width.eval() + "px",
        height: this.height.eval() + "px",
    }
    Engine.add('rect', null, Object.assign(attr, this.evalStyles()));
};

function Circle(coords, radius) {
    Shape.call(this);
    this.cx = coords.x;
    this.cy = coords.y;
    this.r = radius;
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
Circle.prototype.eval = function () {
    var attr = {
        cx: this.cx.eval(),
        cy: this.cy.eval(),
        r: this.r.eval(),
    }
    Engine.add('circle', null, Object.assign(attr, this.evalStyles()));

};

function Ellipse(coords, radiusX, radiusY) {
    Shape.call(this);
    this.x = coords.x;
    this.y = coords.y;
    this.rx = radiusX;
    this.ry = radiusY;
}
Ellipse.prototype = Object.create(Shape.prototype);
Ellipse.prototype.constructor = Ellipse;
Ellipse.prototype.eval = function () {
    var attr = {
        cx: this.x.eval(),
        cy: this.y.eval(),
        rx: this.rx.eval(),
        ry: this.ry.eval(),
    }
    Engine.add('ellipse', null, Object.assign(attr, this.evalStyles()));
}

function Text(coords, value) {
    Shape.call(this);
    this.x = coords.x;
    this.y = coords.y;
    this.value = value;
}
Text.prototype = Object.create(Shape.prototype);
Text.prototype.constructor = Text;
Text.prototype.eval = function () {
    var attr = {
        x: this.x.eval(),
        y: this.y.eval(),
    }
    Engine.add('text', this.getString(), Object.assign(attr, this.evalStyles()));

};
Text.prototype.getString = function () {
    return this.value.eval();
};

function Polyline(coords) {
    Shape.call(this);
    this.coordList = coords;
}
Polyline.prototype = Object.create(Shape.prototype);
Polyline.prototype.constructor = Polyline;
Polyline.prototype.eval = function () {
    var attr = {
        points: "",
    }
    for (var i = 0; i < this.coordList.length; i++) {
        var point = this.coordList[i];
        attr.points += point.x.eval() + "," + point.y.eval() + " ";
    }

    Engine.add('Polyline', null, Object.assign(attr, this.evalStyles()));

};

function Polygon(coords) {
    Shape.call(this);
    this.coordList = coords;
}
Polygon.prototype = Object.create(Shape.prototype);
Polygon.prototype.constructor = Polygon;
Polygon.prototype.eval = function () {
    var attr = {
        points: "",
    }

    for (var i = 0; i < this.coordList.length; i++) {
        var point = this.coordList[i];
        attr.points += point.x.eval() + "," + point.y.eval() + " ";
    }

    Engine.add('polygon', null, Object.assign(attr, this.evalStyles()));

}

function Line(coordOne, coordTwo) {
    Shape.call(this);
    this.x1 = coordOne.x;
    this.y1 = coordOne.y;
    this.x2 = coordTwo.x;
    this.y2 = coordTwo.y;

}
Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;
Line.prototype.eval = function () {
    var attr = {
        x1: this.x1.eval(),
        y1: this.y1.eval(),
        x2: this.x2.eval(),
        y2: this.y2.eval(),
    }
    Engine.add('line', null, Object.assign(attr, this.evalStyles()));
};

function GlobalStyle(attrToken, value) {
    Statement.call(this);
    this.attribute = attrToken;
    this.value = value;
}
GlobalStyle.prototype = Object.create(Statement.prototype);
GlobalStyle.prototype.constructor = GlobalStyle;
GlobalStyle.prototype.eval = function () {
    Global.addStyle(this.attribute, this.value);
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

function Variable(parent, child) {
    Expr.call(this);
    this.child = child;
    this.parent = parent;
}
Variable.prototype = Object.create(Expr.prototype);
Variable.prototype.constructor = Variable;
Variable.prototype.eval = function () {
    if (this.child != undefined) {
        var contents = Global.getVar(this.parent);
        if (contents[this.child.text] != undefined) {
            return contents[this.child.text].eval();

        } else {
            throw new RuntimeError(this.child.line, "Property \'" + this.child.text + "\' of variable \'" + this.parent.text + "\' is undefined.");
        }
    } else {
        return this.evalParent();
    }
}
Variable.prototype.evalParent = function (){
    return Global.getVar(this.parent).eval();
}
Variable.prototype.update = function (input, eager) {
    var value;
    if(!(input instanceof Shape) && eager){
        value = new Literal(input.eval());
    }else{
      value = input;
    }

    if (this.child != undefined) {
        var contents = Global.getVar(this.parent);

        if (contents[this.child.text] != undefined) {

            contents[this.child.text] = value;
            Global.addVar(this.parent, contents);

        }else if(TokenTypes.attributes[this.child.text] != null){

            contents.styles.set(this.child.text, value);
            Global.addVar(this.parent, contents);

        } else {
            throw new RuntimeError(this.child.line, "Property \'" + this.child.text + "\' of variable \'" + this.parent.text + "\' is undefined.");
        }

    } else {
        Global.addVar(this.parent, value);
    }

}

function Unary(op, a) {
    this.operator = op;
    this.right = a;
    this.getValue = function () {

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
        case '^':
            return Math.pow(this.left.eval(), this.right.eval());
    }
}

function Comparison(a, op, b) {
    BinaryExpr.call(this, a, op, b);
}
Comparison.prototype = Object.create(BinaryExpr.prototype);
Comparison.prototype.constructor = Comparison;
Comparison.prototype.eval = function () {
    switch (this.operator) {
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

function TrigExpr(op, a) {
  Expr.call(this);
  this.operator = op;
  this.expr = a;
}
TrigExpr.prototype = Object.create(Expr.prototype);
TrigExpr.prototype.constructor = TrigExpr;
TrigExpr.prototype.eval = function(){
  switch(this.operator.text){
    case 'sin':
      return Math.sin(this.expr.eval());
    case 'cos':
      return Math.cos(this.expr.eval());
    case 'tan':
      return Math.tan(this.expr.eval());
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