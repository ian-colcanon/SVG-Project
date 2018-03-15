/* global document*/
var Console = {
    error: function (message, line) {
        document.getElementById("console").value += "[" + line + "] " + message + "\n";
    },
    clear: function () {
        document.getElementById("console").value = "";
    },
    print: function (message) {
        document.getElementById("console").value += "> " + message + "\n";
    }
};
