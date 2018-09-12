/*global GlobalScope Console Lexer Parser Engine document*/

var Interpreter = {
    statements: undefined,
    global: undefined,
    current: undefined,
    frames: [],
    end: -1,

    init: function() {
        this.statements = undefined;
        this.global = new Frame(0);
        this.current = this.global;
        this.frames = [];
        this.end = -1;
    },

    run: function (string) {
        this.init();

        Lexer.init(string);

        Parser.init(Lexer.scanTokens());
        this.statements = Parser.parse();

        if (this.statements != undefined && this.statements.length > 0) {
                //Once statements are produced, they are split into two categories
                var filtered = [];

                for (var line of this.statements) {
                    if (line.global) {
                        //Category one contains TimeSteps and Global statements.
                        //These are evaluated for each frame.
                        filtered.push(line);

                        if (line instanceof TimeStep) {
                            if (line.end > this.end) {
                                this.end = line.end;
                            }
                        }

                    } else {
                        //Category two encompasses all statements that fall outside the two previous types.
                        //These are only executed once before any frames are rendered.
                        line.eval();
                    }
                }
                //Once category 2 statements are executed, the TimeSteps and global statements are executed.
                //The resulting array of frames is passed to the ViewEngine for execution.
                this.executeTimed(filtered);
                return this.frames;
        }
    },

    executeTimed: function(statements){
        var index = 0;
        do {
            this.current = new Frame(index);
            this.current.join(this.global);

            for (var line of statements) {
                line.eval();
            }

            this.frames.push(this.current);
            ++index;

        } while (index <= this.end);
    },

    add: function (type, value, attrs) {
        var element = this.makeSVG(type, value, attrs);
        this.current.addTag(element);
    },

    makeSVG: function (tag, value, attributes) {
        var element = document.createElementNS("http://www.w3.org/2000/svg", tag);

        element.innerHTML = value;

        for (var k in attributes) {
            element.setAttribute(k, attributes[k]);
        }

        return element;
    },

    hasMultiple: function () {
        return this.frames.length > 1;
    },
};

var Frame = function (index) {
    this.tags = [];
    this.index = index;
}
Frame.prototype.addTag = function (tag) {
    this.tags.push(tag);
}

Frame.prototype.join = function (frame) {
    this.tags = this.tags.concat(frame.tags);
}

Frame.prototype.constructor = Frame;
/*Frame.prototype.eval = function () {
    for (var i = 0; i < this.tags.length; ++i) {
        Engine.paintTag(this.tags[i]);
    }
}*/
