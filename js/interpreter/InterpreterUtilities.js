/*global Console Lexer Parser document*/

var Interpreter = {
    lexer: undefined,
    parser: undefined,
    statements: undefined,
    
    init: function () {
        this.lexer = new Lexer();
        this.parser = new Parser();
    },
    
    parse: function () {
        Console.clear();
        
        if(this.lexer == undefined || this.parser == "undefined"){
            Console.error("Critical failure.", 0);
        }
        
        this.lexer.init(document.getElementById("code").value);
        
        try{
            this.parser.init(this.lexer.scanTokens());

        }catch(e){
            if(e instanceof Error){
                e.printMessage();
            }
        }
        
        //console.log(this.lexer.printTokens());
        try{
            this.statements = this.parser.parse();
        }catch(e){
            if(e instanceof Error){
                e.printMessage();
            }
        }
    },
    
    execute: function (statement) {
        switch(statement.type){
            case 'PRINT':
                Console.print(statement.value.eval());
                break;
        } 
    },
    
    run: function () {
        this.parse();
        
        if(this.statements == undefined){
            Console.error("Critical failure.", 1);
        }else{
            for(var i = 0; i<this.statements.length; i++){
                this.execute(this.statements[i]);
            }
        }
    },
    
};