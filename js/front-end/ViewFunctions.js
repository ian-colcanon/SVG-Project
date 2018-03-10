$(document).ready(function () {
    
    function calibrate () {
        var total = $(document).width();
        var text = $("#textContainer").width()
        console.log(total);
        console.log(total-text);
        $("#viewContainer").css("width", total - text + "px");
        
    }
    calibrate();
    
    $(window).resize(function (){
        calibrate();
        
    });
    
    
    
    
});