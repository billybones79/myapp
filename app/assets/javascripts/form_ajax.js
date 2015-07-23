var ready;
ready = function() {
    setCheckout();

    var $cart = $(".cart-header");

    var $form = $('#add_to_cart_form');
    var $msg_box = $("#order_errors");
    var TIMEOUT = 20000;

    var default_msg = [];
    default_msg['en'] = "An error prevented the request from fulfilling";
    default_msg['fr'] = "Une erreur a empêché la requête d'aboutir";


    function toggleClass(state)
    {
        $($msg_box).removeClass();
        $($msg_box).addClass("status");
        $($msg_box).addClass(state);
    }

    $form.on('ajax:error', function(event, xhr, status, error) {

        toggleClass('error');

        $msg_box.fadeIn();
        $msg_box.toggleClass("alert alert-danger");

        var response = xhr.responseText.toString();
        var lang = $('html').attr("lang");

        if (!response.trim() && response.length > 10)
        {
            default_msg[lang] = response;
        }

        $msg_box.html(response);

        setTimeout(function(){
            $msg_box.fadeOut();
        }, TIMEOUT);

    });

    $form.on('ajax:success', function(event, xhr, status, error) {

        $cart.slideToggle(650);
        $('body').toggleClass('block-scroll');

        setTimeout(function(){
            $cart.slideToggle(650);
            $('body').toggleClass('block-scroll');
        }, 2000);

    });

    $form.find("#add-to-cart-button").click(function(){
        lockoutSubmit(this);

    })



    var $cartForm = $("#update-cart");
    var $cartErrorMsg = $("order_errors");

    $cartForm.find("#update-button").click(function(){
        lockoutSubmit(this);
    });



    $cartForm.on('ajax:error', function(event, xhr, status, error) {

        toggleClass('error');

        $cartErrorMsg.fadeIn();

        var response = xhr.responseText.toString();
        var lang = $('html').attr("lang");

        if (!response.trim() && response.length > 10)
        {
            default_msg[lang] = response;
        }

        $cartErrorMsg.html(response);

        setTimeout(function(){
            $msg_box.fadeOut();
        }, TIMEOUT);

    });


};

var processingMessage = [];
processingMessage['en'] = "....processing....";
processingMessage['fr'] = "....en traitement....";

$(document).ready(ready);
$(document).on('page:load', ready);

function lockoutSubmit(button) {
    var oldhtml = button.innerhtml;

    button.setAttribute('disabled', true);
    var lang = $('html').attr("lang");
    button.innerhtml = processingMessage[lang];

    setTimeout(function(){
        button.value = oldhtml;
        button.removeAttribute('disabled');
    }, 3000)
}

function setCheckout(){
    $("#checkout-top").click(function(){
        location.href = "/checkout";
    });
}