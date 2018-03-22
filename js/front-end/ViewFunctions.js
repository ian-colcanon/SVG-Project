/*global document*/
$(document).ready(function () {

    $("#code").bind("input change", function () {
        Interpreter.run();
    });

});

var Engine = {
    xMax: 300,
    yMax: 300,


    paint: function (statement) {

        switch (statement.subtype) {
            case 'RECT':
                this.rectangle(statement);
                break;
            case 'CIRCLE':
                this.circle(statement);
                break;
            case 'ELLIPSE':
                this.ellipse(statement);
                break;
            case 'TEXT':
                this.text(statement);
                break;
            case 'LINE':
                this.line(statement);
                break;
            case 'POLY':
                this.polyline(statement);
                break;
        }
    },

    resize: function (statement) {
        var display = document.getElementById("view");
        var doc = document.getElementById("draw");

        if (statement != undefined) {

            this.xMax = statement.width.eval();
            this.yMax = statement.height.eval();

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

    rectangle: function (rect) {
        var rectElement = this.makeSVG("rect", null, rect.eval());
        this.add(rectElement);
    },

    circle: function (circle) {
        var circleElement = this.makeSVG("circle", null, circle.eval());
        this.add(circleElement);

    },

    ellipse: function (ellipse) {
        var ellipseElement = this.makeSVG("ellipse", null, ellipse.eval());
        this.add(ellipseElement);
    },

    text: function (text) {
        var textElement = this.makeSVG("text", text.getString(), text.eval());
        this.add(textElement);
    },

    line: function (line) {
        var lineElement = this.makeSVG("line", null, line.eval());
        this.add(lineElement);
    },

    polyline: function (poly) {
        var polyElement = this.makeSVG("polyline", null, poly.eval());
        this.add(polyElement);
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
