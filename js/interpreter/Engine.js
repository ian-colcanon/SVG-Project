
/*global global document setInterval*/
var Frame = function (index) {
    this.tags = [];
    this.index = index;
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
    end: -1,
    current: undefined,
    ref: undefined,
    playing: false,
    viewbox: undefined,

    init: function () {
        this.erase();
        this.frames = [];
        this.timesteps = [];
        this.frameIndex = 0;
        this.end = -1;
        this.global = new Frame(0);
        this.current = this.global;
        this.viewBox = undefined;
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
        
        $('#draw').attr('viewBox', this.viewBox != undefined ? this.viewBox : "");        
        Engine.frames[0] != null ? Engine.frames[0].eval() : null;
        
        if (this.frames.length > 1) {
            this.play(0);
        }

    },

    pause: function () {
        clearInterval(this.ref);
        $('#playPause').attr('src', 'img/play.svg');
        Engine.playing = false;
    },

    play: function (start) {
        this.frameIndex = start;

        this.ref = setInterval(function () {
            Engine.erase();

            Engine.frames[Engine.frameIndex].eval();

            Engine.frameIndex = (++Engine.frameIndex) % Engine.frames.length;
        }, 1000/30);

        Engine.playing = true;
        $("#playPause").attr("src", "img/pause.svg");

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
    
    setViewBox: function (xMin, yMin, width, height) {
        this.viewBox = xMin + " " + yMin + " " + width + " " + height;
        
    }
}