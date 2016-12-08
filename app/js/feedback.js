$(function () {
    $('#bso_form input').change( function (event) {
        $(this).removeClass("error");
    });

    $('#bso_form').on('submit', 'form', function (event) {
        event.preventDefault();

        var formAction = $(this).attr('action');
        var formData = $(this).serialize();
        var controls = { 'userName': 'userNameId',
                         'userEmail': 'userEmailId',
                         'userPhone': 'userPhoneId' };

        $.post(formAction, formData, function (content) {
            for (var si in controls) {
    			$('#' + controls[si]).removeClass('error');
            }

            if (false == content.response.success) {
                for (var ei in content.response.errors) {
                    $('#' + controls[content.response.errors[ei][0]]).addClass('error');
                }
            } else {
                $('#bso_form').hide();
                $('#bso_form-submit-success').show();

                setTimeout(function() {
                	$('#bso_form').closest('.popup').fadeOut(200);
            		$('.overlay').fadeOut(200);
            	}, 3000);
            }
        });
    });
});