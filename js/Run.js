function loadSVG(){
    var lex = new Lexer(document.getElementById("code").value);
    lex.scanTokens();
    console.log(lex.printTokens());
}