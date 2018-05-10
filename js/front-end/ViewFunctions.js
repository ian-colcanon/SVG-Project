/*global document GIF URL Image clearInterval Interpreter ImageSerializer $*/
$(document).ready(function () {
    screen.orientation.lock('landscape');
    var hovering = false;
    var playing = false;
    $("#test").click( function () {
        $("#all").css("opacity", "0.3");
    });
    
    $("#playPause").click(function (){
        
        if(!playing){
            $(this).attr("src", "img/pause.svg");

        }else{
            $(this).attr("src", "img/play.svg");
        }
        playing = !playing;
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
    counter: 0,
    encoder: 0,
    end: 0,
    current: undefined,
    ref: undefined,
    gif: undefined,

    init: function () {
        this.erase();
        this.frames = [];
        this.timesteps = [];
        this.end = 0;
        this.counter = 0;
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

    paintTag: function (element) {
        document.getElementById("draw").appendChild(element);
        element.parentNode.appendChild(element);
    },

    execute: function () {

        if (this.timesteps.length == 0) {
            this.global.eval();

        } else {

            /*Engine.gif = new GIF({
                workers: 5,
                quality: 1,
                width: 500,
                height: 500,
                // transparent: '#000000',
                // background: '#FFFFFF'
                repeat: 0
            });

            Engine.gif.setOption('debug', true);

            Engine.gif.on('progress', function (i) {
                console.log(i);
            });

            Engine.gif.on('finished', function (blob) {
                ImageSerializer.downloadBlob("animation.gif", blob);
            });*/


            if (this.end == 0) this.end = 1000;

            for (var frameIndex = 0; frameIndex < this.end; ++frameIndex) {
                this.current = new Frame();
                this.current.join(this.global);
                for (var timeIndex = 0; timeIndex < this.timesteps.length; ++timeIndex) {

                    if (this.timesteps[timeIndex].check(frameIndex)) {


                        this.timesteps[timeIndex].eval();

                    }
                }

                
                this.frames.push(this.current);
                Global.step();
            }        
            
            Engine.counter = 0;

            Engine.ref = setInterval(function () {
                Engine.erase();

                if (Engine.counter == Engine.frames.length) {

                    Engine.counter = 0;
                }

                Engine.frames[Engine.counter].eval();
                ++Engine.counter;

            }, 1000/60);
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
        console.log(this.frames.length);
        return this.frames.length > 1;
    },



}
