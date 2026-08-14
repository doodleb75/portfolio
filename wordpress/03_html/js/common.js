/* Copy Clipboard :: Button relative */

function copyClipboard() {
    var elm = document.getElementById("textAreaClipboard");
    // for Internet Explorer

    if (document.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(elm);
        range.select();
        document.execCommand("Copy");
        // alert("Copied div content\nto clipboard");
        action_popup.alert('URL이 복사되었습니다. 단톡방 등에 붙여넣어 공유할 수 있습니다.');
    }
    else if (window.getSelection) {
        // other browsers
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(elm);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("Copy");
        // alert("Copied div content \nto clipboard");
        action_popup.alert('URL이 복사되었습니다. 단톡방 등에 붙여넣어 공유할 수 있습니다.');
    }
}


/* 핸드폰번호 자동 하이픈 */

var patt = new RegExp("[0-9]{2,3}-[0-9]{3,4}-[0-9]{3,4}");
var res = patt.test($("#tlno").val());

function autoHypenPhone(str) {
    str = str.replace(/[^0-9]/g, '');
    var tmp = '';
    if (str.length < 4) {
        return str;
    } else if (str.length < 7) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        return tmp;
    } else if (str.length < 11) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 3);
        tmp += '-';
        tmp += str.substr(6);
        return tmp;
    } else {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);
        return tmp;
    }
    return str;
}

var cellPhone = document.getElementById('cellPhone-crew');
cellPhone.onkeyup = function (event) {
    event = event || window.event;
    var _val = this.value.trim();
    this.value = autoHypenPhone(_val);
}

/* mobile modal open - prevent body scroll */

$('.modal').magnificPopup({
    type: 'ajax',
    callbacks: {
        beforeOpen: function () {
            $('body').addClass('mfp-active');
        },
        beforeClose: function () {
            $('body').removeClass('mfp-active');
        }
    }
});


/* Modal Open - Body Scroll Prevent */
$(function () {
    var $window = $(window),
        $body = $("body"),
        $modal = $(".modal"),
        scrollDistance = 0;

    $modal.on("show.bs.modal", function () {
        scrollDistance = $window.scrollTop();

        $body.css("top", scrollDistance * -1);
    });

    $modal.on("hidden.bs.modal", function () {
        $body.css("top", "");
        $window.scrollTop(scrollDistance);
    });
});

$(window).load(function () {
    $('#load').hide();
});

