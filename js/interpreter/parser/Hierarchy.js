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




function Addition(a, op, b){
    BinaryExpr.call(this, a, op, b);
}

Addition.prototype = Object.create(BinaryExpr.prototype);
Addition.prototype.constructor = Addition;
Addition.prototype.eval = function () {
   if(this.operator == "+"){
       return this.left.eval() + this.right.eval();
   }else{
       return this.left.eval() - this.right.eval();
   }
};



function Multiplication(a, op, b) {
    BinaryExpr.call(this, a, op, b);
}

Multiplication.prototype = Object.create(BinaryExpr.prototype);
Multiplication.prototype.constructor = Multiplication;
Multiplication.prototype.eval = function () {
    if(this.operator == "*"){
        return this.left.eval() * this.right.eval();
    }else{
        return this.left.eval() / this.right.eval();
    }
    
};

function Modulus(a, b) {
    BinaryExpr.call(this, a, b);
}

Modulus.prototype = Object.create(BinaryExpr.prototype);
Modulus.prototype.constructor = Modulus;
Modulus.prototype.eval = function () {
    return this.left.eval() % this.right.eval();
};

function Error(token){
    this.text = token.text;
    this.line = token.line;
    this.message = token.message;
}

Error.prototype = Object.create(Expr.prototype);
Error.prototype.constructor = Error;




