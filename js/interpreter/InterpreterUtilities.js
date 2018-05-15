/*global Global Console Lexer Parser Engine document*/

var Interpreter = {
    statements: undefined,

    parse: function () {
        Console.clear();
        Engine.erase();
        this.statements = undefined;
        
        Lexer.init(document.getElementById("code").value);

        try {
            Parser.init(Lexer.scanTokens());

        } catch (e) {
            if (e instanceof Error) {
                e.printMessage();
            }
        }
        Lexer.printTokens();
        try {
            this.statements = Parser.parse();

        } catch (e) {
            if (e instanceof Error) {
                e.printMessage();
            }
        }
    },

    execute: function (statement) {
        statement.eval();
    },

    run: function () {
        Global.init();
        Engine.init();
        this.parse();

        if (this.statements != undefined) {
            try {
                var resized = false;

                for(var i = 0; i < this.statements.length; i++) {
                    switch(this.statements[i].type){
                        case 'BOUNDS':
                            resized = true;
                            this.execute(this.statements[i]);
                            break;
                        case 'TIME':
                            Engine.addTimestep(this.statements[i]);
                            break;
                        default:
                            this.execute(this.statements[i]);
                            break;
                    }   
                }

                if (!resized) {
                    Engine.resize(undefined);
                }
                
                Engine.execute();
                
            } catch (e) {
                if (e instanceof Error) {
                    e.printMessage();
                }
            }
        }
    },

};