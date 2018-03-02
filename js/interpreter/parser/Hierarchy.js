function Expr() {
    this.type = 'EXPRESSION';
}

Expr.prototype.constructor = Expr();
Expr.prototype.eval = function () {
    return "HELLO";
};



function Literal(a) {   
    this.val = a;

}

Literal.prototype = Object.create(Expr.prototype);
Literal.prototype.constructor = Literal;
Literal.prototype.eval = function (){
    return this.val;
};



function BinaryExpr(a, b){
    Expr.call(this);
    this.left = a;
    this.right = b;
}

BinaryExpr.prototype = new Expr();
BinaryExpr.prototype.constructor = BinaryExpr;



function Addition(a, b){
    BinaryExpr.call(this, a, b);
}

Addition.prototype = new BinaryExpr();
Addition.prototype.constructor = Addition;
Addition.prototype.eval = function () {
    return this.left.eval() + this.right.eval();

};



function Multiplication(a, b) {
    BinaryExpr.call(this, a, b);
}

Multiplication.prototype = new BinaryExpr();
Multiplication.prototype.constructor = Multiplication;
Multiplication.prototype.eval = function () {
    return this.left.eval() * this.right.eval();
};



function Division(a, b) {
    BinaryExpr.call(this, a, b);
}

Division.prototype = new BinaryExpr();
Division.prototype.constructor = Division;
Division.prototype.eval = function () {
    return this.left.eval() / this.right.eval();
};



function Subtraction(a, b) {
    BinaryExpr.call(this, a, b);
}

Subtraction.prototype = new BinaryExpr();
Subtraction.prototype.constructor = Subtraction;
Subtraction.prototype.eval = function () {
    return this.left.eval() - this.right.eval();
};


//var mult = new Multiplication(new Literal(10), new Literal(10));
var add1 = new Addition(new Literal(2), new Literal(2));
var multi = new Multiplication(add1, add1);
//var addFinal = new Addition(mult, add1);


console.log(multi.eval());





