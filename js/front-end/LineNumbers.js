/*global $ document window */
$(document).ready(function () {

    $("#code").keydown(function (){
        var key = window.event.code;
        var numLines = $("#code").val().split(/\n/).length;
        switch(key){
            case "Enter":
                $("#numbers").val("1" + "\n");
                for(var i = 2; i<= numLines + 1; i++){
                    var hold = $("#numbers").val();
                    $("#numbers").val(hold + i + "\n");
                }
                
                break;
            case "Backspace":
                $("#numbers").val("1" + "\n");
                for(i = 2; i<numLines; i++){
                    hold = $("#numbers").val();
                    $("#numbers").val(hold + i + "\n");
                }
                break;
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