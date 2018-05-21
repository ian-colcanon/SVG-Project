/*global document Engine GIF $ Blob XMLSerializer URL setTimeout*/

$(document).ready(function () {
    $("#download").click(function () {
        if (Engine.hasMultiple()) {
            ImageSerializer.toGIF();
        } else {
            ImageSerializer.toSVG();
        }
    });

});

var ImageSerializer = {
    urls: [],
    counter: 0,
    svg: document.getElementById("draw"),

    toSVG: function () {
        var svg = document.getElementById("draw");
        var data = new XMLSerializer().serializeToString(svg);
        var svgBlob = new Blob([data], {
            type: 'image/svg+xml;charset=utf-8'
        });
        this.downloadBlob("graphic.svg", svgBlob);
    },

    toGIF: function () {
        clearInterval(Engine.ref);

        this.counter = 0;
        var gif = new GIF({
            workers: 8,
            quality: 1,
            width: 500,
            height: 500,
            repeat: 0,
        });

        gif.setOption('debug', true);

        gif.on('progress', function (i) {
            console.log(i);
        });

        gif.on('finished', function (blob) {
            ImageSerializer.downloadBlob("animation.gif", blob);
            setInterval(Engine.ref);
        });

        this.urls = [];
        for (var frame of Engine.frames) {
            var element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            for (var tag of frame.tags) {
                element.appendChild(tag);
            }

            var data = new XMLSerializer().serializeToString(element);
            var svgBlob = new Blob([data], {
                type: 'image/svg+xml;charset=utf-8'
            });
            this.urls.push(URL.createObjectURL(svgBlob));
        }

        this.loadFrames(gif, 0);
    },



    loadFrames: function (gif, index) {
        if (index == this.urls.length) {
            gif.render();
        } else {
            var img = new Image();
            img.src = this.urls[index];
            img.onload = function () {

                gif.addFrame(img, {
                    delay: 1000 / 60,
                    copy: false
                });

                URL.revokeObjectURL(img.src);
                ImageSerializer.loadFrames(gif, ++index);
            }
        }

    },

    downloadBlob: function (name, blob) {
        var link = document.createElement('a');
        link.download = name;
        link.href = URL.createObjectURL(blob);
        // Firefox needs the element to be live for some reason.
        document.body.appendChild(link);
        link.click();
        setTimeout(function () {
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        });
    },


}
