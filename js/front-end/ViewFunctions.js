/*global document*/
$(document).ready(function () {
    Interpreter.init();
    
    $("#code").bind("input change", function () {
       Interpreter.run(); 
    });
    
    //add getBBox() to make SVG expand to fit all elements
    
    
});

var Engine = {
   
    
    paint: function (statement){

        switch(statement.subtype){
            case 'RECT':
                this.rectangle(statement);
                break;
            case 'CIRCLE':
                this.circle(statement);
                break;
        }
    },
    
    resize: function () {
        var element = document.getElementById("draw");
        element.style.width = element.getBBox().width;
        element.style.height = element.getBBox().height;
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
    
    makeSVG: function (tag, attributes){
        var element = document.createElementNS("http://www.w3.org/2000/svg", tag);
        
        for(var k in attributes){
            element.setAttribute(k, attributes[k]);
        }
        
        return element;
    }
    
}