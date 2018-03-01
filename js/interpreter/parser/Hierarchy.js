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

Literal.prototype = new Expr();
Literal.prototype.constructor = Literal;
Literal.prototype.eval = function (){
    return this.val;
};



function BinaryExpr(a, b){
    this.left = a;
    this.right = b;
}

BinaryExpr.prototype = new Expr();
BinaryExpr.prototype.constructor = BinaryExpr;



function Addition(a, b){
    this.left = a;
    this.right = b;
}

Addition.prototype = new BinaryExpr();
Addition.prototype.constructor = Addition;
Addition.prototype.eval = function () {
    return this.left.eval() + this.right.eval();

};




var add1 = new Addition(new Literal(3), new Literal(2));
var add2 = new Addition(new Literal(2), new Literal(2));
var addFinal = new Addition(add1, add2);

console.log(addFinal.eval() + " Type = " + addFinal.type);





