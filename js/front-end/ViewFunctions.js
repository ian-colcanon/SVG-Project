/*global document*/
$(document).ready(function () {
    Interpreter.init();
    
    $("#code").bind("input change", function () {
       Interpreter.run(); 
    });
    
    //add getBBox() to make SVG expand to fit all elements
    
    
});

var Engine = {
    xMax: 300,
    yMax: 300,
    
    
    paint: function (statement){

        switch(statement.subtype){
            case 'RECT':
                this.rectangle(statement);
                break;
            case 'CIRCLE':
                this.circle(statement);
                break;
            case 'ELLIPSE':
                this.ellipse(statement);
                break;
        }
    },
    
    resize: function (statement) {
        var display = document.getElementById("view");
        var doc = document.getElementById("draw");
        
        if(statement != undefined){
        
            this.xMax = statement.width.eval();
            this.yMax = statement.height.eval();
        
            doc.style.width = this.xMax;
            doc.style.height = this.yMax;
        
            display.style.width = this.xMax;
            display.style.height = this.yMax;
        
        }else{
            doc.style.width = "";
            doc.style.height = "";
        }
    },
    
    xBounded: function (element){
        return element.coords.x.eval() > this.xMax;
    },
    
    yBounded: function (element){
        return element.coords.y.eval() > this.yMax;
    },
    
    erase: function (){
        var element = document.getElementById("draw");
        element.innerHTML = "";
    },
    
    add: function (element){
        document.getElementById("draw").appendChild(element);
    },
    
    rectangle: function (rectangle){
        var rect = this.makeSVG("rect", rectangle.eval());
        this.add(rect);
    },
    
    circle: function (circle){
        var circ = this.makeSVG("circle", circle.eval());
        this.add(circ);
     
    },
    
    ellipse: function (ellipse){
        var ellip = this.makeSVG("ellipse", ellipse.eval());
        this.add(ellip);
    },
    
    makeSVG: function (tag, attributes){
        var element = document.createElementNS("http://www.w3.org/2000/svg", tag);
        
        for(var k in attributes){
            element.setAttribute(k, attributes[k]);
        }
        
        return element;
    }
    
}