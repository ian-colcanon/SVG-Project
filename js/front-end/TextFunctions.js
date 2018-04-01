/*global $ document window */


$(document).ready(function () {
    $("#numbers").val(1 + "\n");

    $('.child').scroll(function () {
        $('.child').scrollTop($(this).scrollTop());
    });
    
    
    $("#code").keydown(function (e) {
        var key = window.event.code;
        
        switch (key) {
            case "Tab":
                e.preventDefault();
                
                var pos1 = $("#code").prop('selectionStart');
                var pos2 = $("#code").prop('selectionEnd');
                var val = $("#code").val();
                
                $("#code").val(val.substring(0, pos1) + "\t" + val.substring(pos2));
                $("#code").prop('selectionStart', ++pos1);
                $("#code").prop('selectionEnd', ++pos2);
        }

    });

});
/*
function addLineNumber() {
        
        var numLinesCode = document.getElementById("code").value.split(/\n/).length;
        
        if(key == "Enter"){     
            document.getElementById("numbers").value = "";
            for(var i = 1; i<= numLinesCode + 1; i++){
                document.getElementById("numbers").value += i + "\n";
            }
            
            
            
            
            
        
            
        }else if(key == "Backspace"){

            document.getElementById("numbers").value = "1" + "\n";
            for(i = 2; i< numLinesCode; i++){
                document.getElementById("numbers").value += i + "\n";
            }
        }
                   
    }
*/
