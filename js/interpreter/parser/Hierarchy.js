function Expr() {
    this.type = 'EXPRESSION';
}

Expr.prototype.constructor = Expr();
Expr.prototype.eval = function () {
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

function Modulus(a, b) {
    BinaryExpr.call(this, a, b);
}

Modulus.prototype = new BinaryExpr();
Modulus.prototype.constructor = Modulus;
Modulus.prototype.eval = function () {
    return this.left.eval() % this.right.eval();
};





