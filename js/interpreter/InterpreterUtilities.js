/*global GlobalScope Console Lexer Parser Engine document*/

var Interpreter = {
    statements: undefined,

    parse: function () {
        Console.clear();
        Engine.erase();
        this.statements = undefined;
        
        Lexer.init(document.getElementById("code").value);

        try {
            Parser.init(Lexer.scanTokens());
            //console.log(Lexer.getTokenString());
        } catch (e) {
            if (e instanceof Error) {
                e.printMessage();
            }
        }
        
        
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
        GlobalScope.init();
        Engine.init();
        this.parse();

        if (this.statements != undefined) {
            try {
                //Once statements are produced, they are split into two categories
                var filtered = [];

                for (var line of this.statements) {
                    if (line.global) {   
                        //Category one contains TimeSteps and Global statements.
                        //These are evaluated for each frame.
                        filtered.push(line);

                        if (line instanceof TimeStep) {
                            if (line.end > Engine.end) {
                                Engine.end = line.end;
                            }
                        }

                    } else {
                        //Category two encompasses all statements that fall outside the two previous types.
                        //These are only executed once before any frames are rendered.
                        line.eval();
                    }
                }
                //Once all category two statements have been executed, the remaning statements are passed to the engine for execution
                Engine.execute(filtered);

            } catch (e) {

                if (e instanceof Error) {
                    e.printMessage();
                }

            }
        }
    },

};
