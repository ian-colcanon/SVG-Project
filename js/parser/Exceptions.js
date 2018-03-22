/* global Console */
function Error(line, message) {
    this.line = line;
    this.message = message;
}
Error.prototype.constructor = Error;
Error.prototype.printMessage = function () {
    Console.print(this.message + " (line " + this.line + ")");
}

function ParsingError (token, line, message) {
    Error.call(this, line, message);
    this.token = token;
}

ParsingError.prototype = Object.create(Error.prototype);

function LexingError(line, message) {
    Error.call(this, line, message);
}

LexingError.prototype = Object.create(Error.prototype);

function RuntimeError(line, message) {
    Error.call(this, line, message);
}

RuntimeError.prototype = Object.create(Error.prototype);