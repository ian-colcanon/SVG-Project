/* global $ */

var Console = {
    console: $("#console"),
    
    error: function (message, line) {
       this.console.text(this.console.text + '[' + line + '] ' + message + '\n');
    },
    clear: function () {
        this.console.text('');
    },
    print: function (message) {
        this.console.text(this.console.text() + '> ' + message + '\n');
    }
};
