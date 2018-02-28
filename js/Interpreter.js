function loadSVG(){
    var lex = new Lexer(document.getElementById("code").value);
    lex.scanTokens();
    document.getElementById("view").value = lex.printTokens();
    
}