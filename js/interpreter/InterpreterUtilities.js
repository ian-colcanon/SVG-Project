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

                var filtered = [];

                for (var line of this.statements) {
                    if (!(line instanceof GlobalStyle)) {

                        filtered.push(line);

                        if (line instanceof TimeStep) {
                            if (line.end > Engine.end) {
                                Engine.end = line.end;
                            }
                        }

                    } else {
                        line.eval();
                    }
                }

                Engine.execute(filtered);

            } catch (e) {

                if (e instanceof Error) {
                    e.printMessage();
                }

            }
        }
    },

};
