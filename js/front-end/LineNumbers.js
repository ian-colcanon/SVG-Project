    function addLineNumber() {
        var key = window.event.code;
        var numLinesCode = document.getElementById("code").value.split(/\n/).length;
        
        if(key == "Enter"){     
            document.getElementById("numbers").value = "";
            for(var i = 1; i<= numLinesCode + 1; i++){
                document.getElementById("numbers").value += i + "\n";
            }
            
            
            
            
            
        
            
        }else if(key == "Backspace"){

            document.getElementById("numbers").value = "1" + "\n";
            for(var i = 2; i< numLinesCode; i++){
                document.getElementById("numbers").value += i + "\n";
            }
        }
                   
    }
