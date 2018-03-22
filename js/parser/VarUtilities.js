/*global Literal Map*/

var Global = {
    vars: new Map(),
    styles: new Map(),
    
    
    addVar: function(key, value){
        this.vars.set(key, value);
    },
    
    getVar: function(token){
        var test = this.vars.get(token.text);
        if(test != undefined){
            return test;
        }else{
            throw new RuntimeError(token.line, "\'" + token.text + "\' is undeclared.");
        }
        
    },
    
    
    addStyle: function(style){
        this.styles.set(style.attribute, style.value);
    },
    
    getStyle: function(attribute){
        return this.styles.get(attribute);
    },
    
    init: function(){
        this.vars.clear();
        this.styles.clear();
        
        this.styles.set('fill', new Literal('black'));
        this.styles.set('color', new Literal('none'));
        this.styles.set('stroke', new Literal('none'));
        
    },
    
}