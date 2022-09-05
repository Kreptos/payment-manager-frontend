$(document).ready(function() {
    $('#button_login').on('click', function() {
        perform_login();
    });
});

// ---------------------------------------------------------------------------------------------------------------------
//                                                Попытка логина
// ---------------------------------------------------------------------------------------------------------------------

function perform_login() {

    $('#login_form').removeClass('error');

    fetch(SETTINGS.host_url + '/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'username': $('#username').val(),
            'password': $('#password').val()
        })
    }).then(function(response) {
        if (response.status === 200) {
            response.json().then(function(answer){
                // Запоминаем token с целью потом его давать для доступа к API.
                document.cookie = 'token' + "=" + (answer.token || "")  + '' + "; path=/";
                window.location.href = 'index.html';
            });
        } else {
            $('#login_form').addClass('error');
        }
    });
}
