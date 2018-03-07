/*global Lexer Parser document*/
var Interpreter = {
    lexer: undefined,
    parser: undefined,
    init: function () {
        this.lexer = new Lexer();
        this.parser = new Parser();
    },
    
    loadSVG: function () {
        var t0 = performance.now();
        
        if(this.lexer == undefined || this.parser == "undefined"){
            throw "Critical error: failed to initialize interpreter.";
        }
        this.lexer.init(document.getElementById("code").value);
        this.parser.init(this.lexer.scanTokens());
        console.log(this.parser.expression().eval());
        
        var tFinal = (performance.now() - t0).toFixed(1);
        console.log("Process completed in " + tFinal + " milliseconds");
    }
    
}

/*
function loadSVG() {
        var lex = new Lexer(document.getElementById("code").value);
        var parser = new Parser(lex);
}*/