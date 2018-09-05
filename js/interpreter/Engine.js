
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
    width: 500,
    height: 500,
    magnif: 1.0,
    originX: undefined,
    originY: undefined,

    init: function () {
        this.erase();
        this.frames = [];
        this.timesteps = [];
        this.frameIndex = 0;
        this.end = -1;
        this.global = new Frame(0);
        this.current = this.global;
        //this.updateViewBox();
    },

    add: function (type, value, attrs) {
        var element = this.makeSVG(type, value, attrs);
        this.current.addTag(element);
    },

    paintTag: function (element) {
        document.getElementById("draw").appendChild(element);
        element.parentNode.appendChild(element);
    },

    updateViewBox: function() {
        this.originX = parseInt($("#originX").val());
        this.originY = parseInt($("#originY").val());
        this.width = parseInt($("#canvasX").val());
        this.height = parseInt($("#canvasY").val());

        this.viewbox = this.originX + " " + this.originY + " " + this.width + " " + this.height;

        $("#draw").attr("viewBox", this.viewbox);
        $("#draw").attr("width", this.magnif * this.width);
        $("#draw").attr("height", this.magnif * this.height);

    },

    setSize: function(x, y){
        this.width = x;
        this.height = y;

        $("#draw").attr("width", this.magnif * this.width);
        $("#draw").attr("height", this.magnif * this.height);

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

        if(Engine.frames[0] != null){
            Engine.frames[0].eval();
            $('#download').attr('disabled', false);

            if (this.frames.length > 1) {
                $('#playWrapper').css('visibility', 'visible');
                this.play(0);
            }else{
                $('#playWrapper').css('visibility', 'hidden');
            }
        }else{
            $('#download').attr('disabled', true);
        }
    },

    pause: function () {
        clearInterval(this.ref);
        Engine.playing = false;
        $("#playPause").children().attr('src', 'img/play.svg');

    },

    play: function (start) {
        this.frameIndex = start;

        this.ref = setInterval(function () {
            Engine.erase();

            Engine.frames[Engine.frameIndex].eval();

            Engine.frameIndex = (++Engine.frameIndex) % Engine.frames.length;

            var position = (Engine.frameIndex / (Engine.frames.length - 1)) * 100;
            $('#scrub').val(position);

        }, 1000/30);

        Engine.playing = true;
        $("#playPause").children().attr('src', 'img/pause.svg');
    },

    skip: function (increment){
        if(this.playing) this.pause();
        var newIndex = this.frameIndex + increment;
        if(newIndex >= 0){
            this.frameIndex = newIndex % this.frames.length;
        }else{
            this.frameIndex = this.frames.length - Math.abs(newIndex % this.frames.length);
        }
        Engine.erase();
        this.frames[this.frameIndex].eval();
    },

    scrubTo: function(percent){
        this.frameIndex = Math.round(percent * (this.frames.length - 1));
        Engine.erase();
        this.frames[this.frameIndex].eval();
    },

    erase: function () {
        var element = document.getElementById("draw");
        element.innerHTML = "";
    },

    setZoom: function(mode) {
            if(mode > 0 && this.magnif < 3){
                this.magnif += .25;
            }else if(mode < 0 && this.magnif > .25){
                this.magnif -= .25;
            }else if(mode == 0){
                this.magnif = 1;
            }

            $("#percent").text(this.magnif * 100 + "%");

            var zoomX = this.magnif * this.width;
            var zoomY = this.magnif * this.height;

            $("#draw").attr("width", zoomX);
            $("#draw").attr("height", zoomY);

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
