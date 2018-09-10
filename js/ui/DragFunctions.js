/*global $ document window*/

$(document).ready(function () {
    var dragging = false;
    var container = $("#textContainer");
    var view = $("#viewContainer");
    $("#dragbar").mousedown(function (e) {
        e.preventDefault();
        dragging = true;

        $(document).mousemove(function (e) {

            var percentage = (e.pageX / window.innerWidth) * 100;
            container.css("width", percentage + "%");
            view.css("width", (100 - percentage) + "%");
        });
    });

    $(document).mouseup(function () {
        if (dragging) {
            $(document).unbind('mousemove');
            dragging = false;
        }

    });

});
