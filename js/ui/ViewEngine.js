var ViewEngine = {
    frames: [],
    frameIndex: 0,
    ref: undefined,
    playing: false,
    viewbox: undefined,
    width: 500,
    height: 500,
    magnif: 1.0,
    originX: undefined,
    originY: undefined,

    init: function(frames){
        this.frames = frames;
        frameIndex = 0;
        this.play(0);
    },

    pause: function () {
        clearInterval(this.ref);
        this.playing = false;
        $("#playPause").children().attr('src', 'img/play.svg');
    },

    play: function (start) {
        this.frameIndex = start;

        this.ref = setInterval(function () {
            ViewEngine.erase();
            //optimize this to eliminate constant redraw. Perhaps use a string?
            $("#draw").append.apply($("#draw"), ViewEngine.frames[ViewEngine.frameIndex].tags);

            ViewEngine.frameIndex = (++ViewEngine.frameIndex) % ViewEngine.frames.length;

            var position = (ViewEngine.frameIndex / (ViewEngine.frames.length - 1)) * 100;
            $('#scrub').val(position);

        }, 1000/30);

        this.playing = true;
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
        this.erase();
        this.frames[this.frameIndex].eval();
    },

    scrubTo: function(percent){
        this.frameIndex = Math.round(percent * (this.frames.length - 1));
        this.erase();
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

    setSize: function(x, y){
        this.width = x;
        this.height = y;

        $("#draw").attr("width", this.magnif * this.width);
        $("#draw").attr("height", this.magnif * this.height);

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

}
