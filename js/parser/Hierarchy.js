/* global GlobalScope Map Engine Console*/
function Item() {
    this.global = false;
}
Item.prototype.constructor = Item;
Item.prototype.setGlobal = function (val) {
    this.global = val;
}

function Statement() {}
Statement.prototype = Object.create(Item.prototype);
Statement.prototype.constructor = Statement;
Statement.prototype.constructor = Statement;

function Grouping(statements) {
    this.statements = statements;
    Statement.call(this);
}
Grouping.prototype = Object.create(Statement.prototype);
Grouping.prototype.constructor = Grouping;

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
            this.id.update(new Literal(this.id.eval() + this.expr.eval()));
            break;
        case '-=':
            this.id.update(new Literal(this.id.eval() - this.expr.eval()));
            break;
    }

}

function PrintStatement(value) {
    Statement.call(this);
    this.value = value;
}
PrintStatement.prototype = Object.create(Statement.prototype);
PrintStatement.prototype.constructor = PrintStatement;
PrintStatement.prototype.eval = function () {
    if (Array.isArray(this.value)) {
        var s = this.value[0].eval() + "";
        for (var i = 1; i < this.value.length; ++i) {
            s += ", " + this.value[i].eval();
        }
        Console.print(s);

    } else {
        Console.print(this.value.eval());
    }
}

function DrawStatement(shape) {
    Statement.call(this);
    this.shape = shape;
}
DrawStatement.prototype = Object.create(Statement.prototype);
DrawStatement.prototype.constructor = DrawStatement;
DrawStatement.prototype.eval = function () {
    this.shape.eval();
}

function If(expr, statements) {
    Grouping.call(this, statements);
    this.expr = expr;

}
If.prototype = Object.create(Grouping.prototype);
If.prototype.constructor = If;
If.prototype.eval = function () {
    if (this.expr.eval() == true) {
        for (var i = 0; i < this.statements.length; ++i) {
            this.statements[i].eval();
        }
    }
}

function For(args, statements) {
    Grouping.call(this, statements);
    this.declare = args[0];
    this.compare = args[1];
    this.increment = args[2];
}
For.prototype = Object.create(Grouping.prototype);
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

function TimeStep(start, end, statements, scope) {
    Grouping.call(this, statements);
    this.global = true;
    this.scope = scope;

    if (start instanceof Literal) {
        this.start = start.eval();
    }

    if (end instanceof Literal) {
        this.end = end.eval();
    } else {
        this.end = 1000;
    }

    this.statements = statements;
    this.frames = [];
}
TimeStep.prototype = Object.create(Grouping.prototype);
TimeStep.prototype.constructor = TimeStep;
TimeStep.prototype.eval = function () {
    if (this.check(Engine.current.index)) {

        this.step();
        //GlobalScope.step(Engine.current.index - this.start, this.end - this.start);

        for (var i = 0; i < this.statements.length; ++i) {
            this.statements[i].eval();
        }
    }
}
TimeStep.prototype.step = function () {
    this.scope.vars.set('t', new Literal((Engine.current.index - this.start) / (this.end - this.start)));
}

TimeStep.prototype.check = function (index) {
    if (this.start == undefined) {
        return index <= this.end;
    } else if (this.end == undefined) {
        return index >= this.start;
    } else {
        return index >= this.start && index <= this.end;
    }
}

function Shape() {
    Statement.call(this);
    this.attrs = {};
}
Shape.prototype = Object.create(Statement.prototype);
Shape.prototype.constructor = Shape;
Shape.prototype.getAttributes = function() {
    var finals = {};
    for(var prop in this.attrs){
        finals[prop] = this.attrs[prop].eval();
    }
    return finals;
}

function Rectangle(args) {
    Shape.call(this);
    this.attrs.x = args[0];
    this.attrs.y = args[1];
    this.attrs.height = args[2];
    this.attrs.width = args[3];
}
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
Rectangle.prototype.eval = function () {
    Engine.add('rect', null, this.getAttributes());
};

function Circle(args) {
    Shape.call(this);
    this.attrs.cx = args[0];
    this.attrs.cy = args[1];
    this.attrs.r = args[2];
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
Circle.prototype.eval = function () {
    Engine.add('circle', null, this.getAttributes());
};

function Ellipse(args) {
    Shape.call(this);
    this.attrs.cx = args[0];
    this.attrs.cy = args[1];
    this.attrs.rx = args[2];
    this.attrs.ry = args[3];
}
Ellipse.prototype = Object.create(Shape.prototype);
Ellipse.prototype.constructor = Ellipse;
Ellipse.prototype.eval = function () {
    Engine.add('ellipse', null, this.getAttributes());
}

function Text(args) {
    Shape.call(this);
    this.attrs.x = args[0];
    this.attrs.y = args[1];
    this.value = args[2];
}
Text.prototype = Object.create(Shape.prototype);
Text.prototype.constructor = Text;
Text.prototype.eval = function () {
    Engine.add('text', this.getString(), this.getAttributes());
};
Text.prototype.getString = function () {
    return (this.value != undefined ? this.value.eval() : null);
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
    Engine.add('polyline', null, attr);

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
    Engine.add('polygon', null, attr);
}

function Line(coordOne, coordTwo) {
    Shape.call(this);
    this.attrs.x1 = coordOne.x;
    this.attrs.y1 = coordOne.y;
    this.attrs.x2 = coordTwo.x;
    this.attrs.y2 = coordTwo.y;

}
Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;
Line.prototype.eval = function () {
    Engine.add('line', null, this.getAttributes());
};

function Expr() {}
Expr.prototype = Object.create(Item.prototype);
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

function Variable(parent, child, scope) {
    Expr.call(this);
    this.child = child;
    this.parent = parent;
    this.scope = scope;
}
Variable.prototype = Object.create(Expr.prototype);
Variable.prototype.constructor = Variable;
Variable.prototype.eval = function () {
    if (this.child != undefined) {
        var contents = this.scope.getVar(this.parent);
        if(contents instanceof Shape) contents = contents.attrs;

        if (contents[this.child.text] != undefined) {
            return contents[this.child.text].eval();

        } else {
            throw new RuntimeError(this.child.line, "Property \'" + this.child.text + "\' of variable \'" + this.parent.text + "\' is invalid.");
        }
    } else {
        return this.evalParent();
    }
}
Variable.prototype.evalParent = function () {
    return this.scope.getVar(this.parent).eval();
}
Variable.prototype.update = function (input, eager) {
    //'value' contains the new value to be assigned to the variable
    var value;
    var parentContents;

    if (!(input instanceof Shape)) {
        value = (eager ? new Literal(input.eval()) : input);
    }else{
        //eager and lazy assignment differentiation does not apply to shapes
        //this is due to the presence and utility of the draw function.
        value = input;
    }

    if(this.child != undefined){
        parentContents = this.scope.getVar(this.parent);

        if(parentContents instanceof Shape){
            parentContents.attrs[this.child.text] = value;
        }else{
            parentContents[this.child.text] = value;
        }

        this.scope.addVar(this.parent, parentContents);

    }else{
        this.scope.addVar(this.parent, value);
    }
}

function Unary(op, a, scope) {
    this.operator = op;
    this.right = a;
    this.scope = scope;
    this.getValue = function () {

        var initial = new Variable(this.right, null, this.scope);
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

function UnaryExpr(op, a, scope) {
    Expr.call(this);
    Unary.call(this, op, a, scope);
}
UnaryExpr.prototype = Object.create(Expr.prototype);
UnaryExpr.prototype.constructor = UnaryExpr;
UnaryExpr.prototype.eval = function () {
    var value = this.getValue();
    this.scope.addVar(this.right, value);
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
TrigExpr.prototype.eval = function () {
    switch (this.operator.text) {
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
}
