/*global document GIF URL Image clearInterval Interpreter ImageSerializer Engine $*/

$(document).ready(function () {
    var hovering = false;
    $("#test").click(function () {
        $("#all").css("opacity", "0.3");
    });

    $("#playPause").click(function () {

        if (!Engine.playing) {
            $(this).attr("src", "img/pause.svg");
            if (Engine.ref != undefined) {
                setInterval(Engine.ref);
            }

        } else {
            $(this).attr("src", "img/play.svg");
            clearInterval(Engine.ref);
        }
        Engine.playing = !Engine.playing;
    })

    $("#draw").mouseenter(function () {
        hovering = true;
        $("#coords").text(0 + "," + 0);
    });

    $("#draw").mouseleave(function () {
        hovering = false;
        $("#coords").text(0 + "," + 0);
    });

    $("#draw").mousemove(function (e) {
        if (hovering) {
            var offset = $(this).parent().offset();
            var toolbarOffset = parseInt($("#buttonBar").offset().top);
            var x = e.pageX - offset.left;
            var y = e.pageY - offset.top - toolbarOffset;
            $("#coords").text(parseInt(x) + "," + parseInt(y));
        }

    });

    $("#execute").click(function () {

        clearInterval(Engine.ref);
        Interpreter.run();

    });
});
/*global global document setInterval*/
var Frame = function () {
    this.tags = [];
}
Frame.prototype.addTag = function (tag) {
    this.tags.push(tag);
}
Frame.prototype.constructor = Frame;
Frame.prototype.eval = function () {
    for (var i = 0; i < this.tags.length; ++i) {
        Engine.paintTag(this.tags[i]);
    }
}
Frame.prototype.join = function (frame) {
    this.tags = this.tags.concat(frame.tags);
}

var Engine = {
    frames: [],
    frameIndex: 0,
    counter: 0,
    end: -1,
    current: undefined,
    ref: undefined,
    gif: undefined,
    playing: false,

    init: function () {
        this.erase();
        this.frames = [];
        this.timesteps = [];
        this.frameIndex = 0;
        this.end = -1;
        this.counter = 0;
        this.global = new Frame();
        this.current = this.global;
    },

    add: function (type, value, attrs) {
        var element = this.makeSVG(type, value, attrs);
        this.current.addTag(element);
    },

    paintTag: function (element) {
        document.getElementById("draw").appendChild(element);
        element.parentNode.appendChild(element);
    },

    execute: function (statements) {

        do {
            
            this.current = new Frame();

            for (var line of statements) {
                line.eval();
            }
            
            this.frames.push(this.current);
            Global.step();
            ++this.frameIndex;
            
        } while (this.frameIndex < this.end);
        
        Engine.frames[0] != null ? Engine.frames[0].eval() : null;
        
        if (this.frames.length > 1) {
            this.counter = 0;

            this.ref = setInterval(function () {
                Engine.erase();

                if (Engine.counter == Engine.frames.length) {

                    Engine.counter = 0;
                }

                Engine.frames[Engine.counter].eval();
                //$("#slider").slider('option', 'value', Engine.frames.length);
                ++Engine.counter;

            }, 1000 / 60);

            Engine.playing = true;
            $("#playPause").attr("src", "img/pause.svg");

        }

    },

    resize: function (width, height) {
        var display = document.getElementById("view");
        var doc = document.getElementById("draw");

        if (arguments.length == 2) {

            this.xMax = width.eval();
            this.yMax = height.eval();

            doc.style.width = this.xMax;
            doc.style.height = this.yMax;

            display.style.width = this.xMax;
            display.style.height = this.yMax;

        } else {
            doc.style.width = "";
            doc.style.height = "";
        }
    },

    erase: function () {
        var element = document.getElementById("draw");
        element.innerHTML = "";
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
}
