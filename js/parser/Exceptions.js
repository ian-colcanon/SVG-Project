/* global Console */
function Error (line, message) {
    this.line = line;
    this.message = message;
}
Error.prototype.constructor = Error;
Error.prototype.printMessage = function (){
    Console.print(this.message + " (line " + this.line + ")");
}


function RuntimeError (token, line, message) {
    Error.call(this, line, message);
    this.token = token;
}

RuntimeError.prototype = Object.create(Error.prototype);


function LexingError (line, message) {
    Error.call(this, line, message);
}

LexingError.prototype = Object.create(Error.prototype);