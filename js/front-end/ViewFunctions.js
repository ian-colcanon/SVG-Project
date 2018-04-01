/*global document*/
$(document).ready(function () {

    $("#code").bind("input change", function () {
        Interpreter.run();
    });

});

var Engine = {
    xMax: 300,
    yMax: 300,

    paint: function (type, value, attrs) {
        var element = this.makeSVG(type, value, attrs);
        this.add(element);
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

    xBounded: function (element) {
        return element.coords.x.eval() > this.xMax;
    },

    yBounded: function (element) {
        return element.coords.y.eval() > this.yMax;
    },

    erase: function () {
        var element = document.getElementById("draw");
        element.innerHTML = "";
    },

    add: function (element) {
        document.getElementById("draw").appendChild(element);
    },
    
    makeSVG: function (tag, value, attributes) {
        var element = document.createElementNS("http://www.w3.org/2000/svg", tag);

        element.innerHTML = value;

        for (var k in attributes) {
            element.setAttribute(k, attributes[k]);
        }

        return element;
    }

}
