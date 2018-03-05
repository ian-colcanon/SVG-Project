function loadSVG(){
    var lex = new Lexer(document.getElementById("code").value);
    var parser = new Parser(lex);
    parser.eval();
}