/*global Global Console Lexer Parser Engine document*/

var Interpreter = {
    lexer: new Lexer(),
    parser: new Parser(),
    statements: undefined,

    parse: function () {
        Console.clear();
        Engine.erase();
        this.statements = undefined;

        if (this.lexer == undefined || this.parser == "undefined") {
            Console.error("Critical failure.", 0);
        }

        this.lexer.init(document.getElementById("code").value);

        try {
            this.parser.init(this.lexer.scanTokens());

        } catch (e) {
            if (e instanceof Error) {
                e.printMessage();
            }
        }
        try {
            this.statements = this.parser.parse();

        } catch (e) {

            if (e instanceof Error) {
                e.printMessage();
            }else{
                console.log();
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
