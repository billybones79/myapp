CHECKOUT_CONTROLLER = {

    edit: function() {

        if( $('select').length) {

            if ( !$('select').hasClass('hasCustomSelect')) {
                $('select').customSelect();
            }
        }
    }
};
