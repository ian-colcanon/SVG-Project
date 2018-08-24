/*global $ document window */

$(document).ready(function () {
    var nums = 1;

    $("#code").on('input', function () {
        numLinesCode = $('#code').val().split(/\n/).length;

        while(parseInt($('#lineNums :last-child').text()) > numLinesCode){
            $('#lineNums :last-child').remove();
            --nums;
        }
    });

    $("#code").keydown(function (e) {
        var key = e.keyCode || e.which;

        switch(key){
            case 13:
                ++nums
                $('#lineNums').append('<span class="num">' + (nums) + '</span')
                console.log($('#lineNums :last-child').text());
                console.log();
                break;

            case 9:
                e.preventDefault();

                var pos1 = $("#code").prop('selectionStart');
                var pos2 = $("#code").prop('selectionEnd');
                var val = $("#code").val();

                $("#code").val(val.substring(0, pos1) + "\t" + val.substring(pos2));
                $("#code").prop('selectionStart', ++pos1);
                $("#code").prop('selectionEnd', ++pos2);
                break;
        }
    });

});
