//заполнение формы авторизации
$(document).on("input", ".form_log input", function(){
    let el = $('.form_log');
    let button = $('.btn_log');
    let sumInputs = $('.form_log').find('input').length;
    let exit_btn = $('.exit_menu');

    let maxboxes = 0;
    
    $(".form_log input").each(function(i){
        if($(this).val() != ''){
            maxboxes++;
        }
    });

    if(maxboxes == sumInputs){
        el.addClass("success");
        el.removeClass("error");
        $('.btn_log').prop('disabled', false);
    }
    else if(maxboxes < sumInputs){
        el.removeClass("error");
        el.removeClass("success");
        $('.btn_log').prop('disabled', true);
    }

    button.on("click", function(e){
        e.preventDefault();
    });
});