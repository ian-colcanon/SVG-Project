/*global Console Lexer Parser document performance*/
var Interpreter = {
    lexer: undefined,
    parser: undefined,
    init: function () {
        this.lexer = new Lexer();
        this.parser = new Parser();
    },
    
    loadSVG: function () {
        Console.clear();
        var t0 = performance.now();
        
        if(this.lexer == undefined || this.parser == "undefined"){
            Console.error("Critical failure.", 0);
        }
        
        
        this.lexer.init(document.getElementById("code").value);
        
        this.parser.init(this.lexer.scanTokens());
        Console.print(this.parser.expression().eval());
        
        var tFinal = (performance.now() - t0).toFixed(1);
        Console.print("Process completed in " + tFinal + " milliseconds");
        
    }
    
};