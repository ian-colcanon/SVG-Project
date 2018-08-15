/*global Literal Map RuntimeError*/

var Scope = function(superScope){
    this.vars = new Map();
    this.superScope = superScope;
}

Scope.prototype.constructor = Scope;

Scope.prototype.addVar = function(name, value){
    this.vars.set(name.text, value);
},
Scope.prototype.getVar = function(token){
    
    var test = this.vars.get(token.text);
        if (test != undefined) {
            return test;
        } else {
            
            var holder = this.superScope;
            
            while(holder != null){
                
                test = holder.vars.get(token.text);
                
                if(test != undefined){
                    return test;
                
                }else{
                    holder = holder.superScope;
                }    
            }
            
            throw new RuntimeError(token.line, "\'" + token.text + "\' is undefined or out of scope.");
        
        }
},
    
Scope.prototype.checkVar = function(token){
    
    try{
        this.getVar(token);
    
    }catch(e){
        return false;
    }
    
    return true;
}



/*var GlobalScope = {
    addStyle: function (token, value) {
        this.styles.set(token.text, value);
    },

    getStyle: function (attribute) {
        return this.styles.get(attribute);
    },

    getGlobalStyles: function () {
        var attr = {};
        this.styles.forEach(function (val, key, map) {
            attr[key] = val.eval();
        });
        return attr;
    },

    step: function (index, upper) {
        this.vars.set('t', new Literal(index/upper));
    },
    
    init: function () {
        this.vars.clear();
        this.vars.set('t', new Literal(0));
        this.styles.clear();

    },

}*/