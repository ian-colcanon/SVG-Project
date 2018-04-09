/*global document $*/
$(document).ready(function () {

    $("#code").bind("input change", function () {
        clearInterval(Engine.ref);
        Interpreter.run();
    });

});

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
    global: new Frame(),
    frames: [],
    timesteps: [],
    end: 0,
    current: undefined,
    ref: undefined,

    init: function () {
        this.erase();

        this.frames = [];
        this.timesteps = [];
        this.end = 0;
        this.global = new Frame();
        this.current = this.global;
    },

    add: function (type, value, attrs) {
        var element = this.makeSVG(type, value, attrs);
        this.current.addTag(element);
    },

    addTimestep: function (step) {
        if (step.end > this.end) this.end = step.end;
        this.timesteps.push(step);
    },

    paintTag: function (tag) {
        this.append(tag);
    },

    execute: function () {

        if (this.timesteps.length == 0) {
            this.global.eval();    
                
        } else {
            if(this.end == 0) this.end = 1000;
            
            for (var frameIndex = 0; frameIndex < this.end; ++frameIndex) {
                this.current = new Frame();
                for (var timeIndex = 0; timeIndex < this.timesteps.length; ++timeIndex) {

                    if (this.timesteps[timeIndex].check(frameIndex)) {

                        this.timesteps[timeIndex].eval();

                    }
                }
                this.current.join(this.global);
                this.frames.push(this.current);
            }

            var counter = 0;

            Engine.ref = setInterval(function () {
                Engine.erase();

                if (counter == Engine.frames.length) counter = 0;

                Engine.frames[counter].eval();

                ++counter

            }, 17);

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

    append: function (element) {
        document.getElementById("draw").appendChild(element);
    },

    makeSVG: function (tag, value, attributes) {
        var element = document.createElementNS("http://www.w3.org/2000/svg", tag);

        element.innerHTML = value;

        for (var k in attributes) {
            element.setAttribute(k, attributes[k]);
        }

        return element;
    },




}
