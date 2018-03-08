/* global Console */
var RuntimeError = function (token, line, message) {
    this.token = token;
    this.line = line;
    this.message = message;
    
    this.printMessage = function () {
        Console.print("> " + message + " (line " + line + ")");
    }
    
}