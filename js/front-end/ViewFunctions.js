/*global document URL Image clearInterval Interpreter ImageSerializer Engine $*/
var hovering = false;
var navOpen = false;

$(document).ready(function () {
    

    $("#test").click(function () {
    
        $("#all").css("opacity", "0.3");
    
    });

    $("#playPause").click(function () {
        
        if (Engine.frames.length != 0) {
            if (!Engine.playing) {
                Engine.play(Engine.frameIndex);

            } else {
                Engine.pause();
            }
        }
    
    });

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
    
    $("#settings").click(function () {
        if(navOpen){
            $("#sidenav").css('width', '0px');
            
        }else{
            $('#sidenav').css('width', '250px');

        }
        navOpen = !navOpen;
    });
    
    $('#svgContainer').click(function () {
        if(navOpen){
            $("#sidenav").css('width', '0px');
        }
        navOpen = !navOpen;
    });
    
     $("#originX, #originY, #canvasX, #canvasY").change(function() {
        Engine.updateViewBox();
    });
    
    $("#magnify").click(function (){
        Engine.setZoom(1);
        
    });
    
    $("#reset").click(function () {
        Engine.setZoom(0);
    })
    
    $("#minify").click(function (){
        Engine.setZoom(-1);
        
    });
    
});