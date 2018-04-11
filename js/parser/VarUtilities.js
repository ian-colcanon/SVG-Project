/*global Literal Map*/

var Global = {
    vars: new Map(),
    styles: new Map(),
    

    addVar: function (name, value) {
        this.vars.set(name.text, value);

    },

    getVar: function (token) {
        var test = this.vars.get(token.text);
        if (test != undefined) {
            return test;
        } else {
            throw new RuntimeError(token.line, "\'" + token.text + "\' is undeclared.");
        }

    },
    

    checkVar: function (token) {
        return this.vars.get(token.text) != undefined;
    },

    addStyle: function (token, value){
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
    
    step: function (){
        var current = this.vars.get('t').eval();
        this.vars.set('t', new Literal(++current));
    },
    
    init: function () {
        this.vars.clear();
        this.vars.set('t', new Literal(0));
        this.styles.clear();

    },

}
