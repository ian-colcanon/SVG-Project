function loadSVG(){
    var lex = new Lexer(document.getElementById("entry").value);
    lex.scanTokens();
    
    document.getElementById("display").value = lex.printTokens();
}