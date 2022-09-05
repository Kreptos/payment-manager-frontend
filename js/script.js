$(function() {
    let header = $('.header');
    let headerHeight = 0; //вычисляем высоту шапки
    let scrollPos = $(window).scrollTop();

    checkScroll(scrollPos);
    $(window).on("scroll resize", function() {

        scrollPos = $(this).scrollTop();
        checkScroll(scrollPos);
        // console.log($(window).scrollTop());
    });

    function checkScroll(srollPos){
        if(scrollPos > 1){
            header.addClass("header_fixed");
            $('body').css({
                'paddingTop': headerHeight+'px'
            });
        }
        else{
            header.removeClass("header_fixed");
            $('body').css({
                'paddingTop': 0
            });
        }

        if($(this).scrollTop() > 90){
            $(".currency__body").addClass("left__block_fixed");
            $(".currency__body").css({
                "top": 0+'px'
            });
        }
        else{
            $(".currency__body").removeClass("left__block_fixed");
            $(".currency__body").css({
                "top": 0
            });
        }
    }
});

$(document).ready(function(){

    var $tabs = function (target) {
        var
        _elemTabs = (typeof target === 'string' ? document.querySelector(target) : target),
        _eventTabsShow,
        _showTab = function (tabsLinkTarget) {
            var tabsPaneTarget, tabsLinkActive, tabsPaneShow;
            tabsPaneTarget = document.querySelector(tabsLinkTarget.getAttribute('href'));
            tabsLinkActive = tabsLinkTarget.parentElement.querySelector('.tabs__link_active');
            tabsPaneShow = tabsPaneTarget.parentElement.querySelector('.tabs__pane_show');
            // если следующая вкладка равна активной, то завершаем работу
            if (tabsLinkTarget === tabsLinkActive) {
            return;
            }
            // удаляем классы у текущих активных элементов
            if (tabsLinkActive !== null) {
            tabsLinkActive.classList.remove('tabs__link_active');
            }
            if (tabsPaneShow !== null) {
            tabsPaneShow.classList.remove('tabs__pane_show');
            }
            // добавляем классы к элементам (в завимости от выбранной вкладки)
            tabsLinkTarget.classList.add('tabs__link_active');
            tabsPaneTarget.classList.add('tabs__pane_show');
            document.dispatchEvent(_eventTabsShow);
        },
        _switchTabTo = function (tabsLinkIndex) {
            var tabsLinks = _elemTabs.querySelectorAll('.tabs__link');
            if (tabsLinks.length > 0) {
            if (tabsLinkIndex > tabsLinks.length) {
                tabsLinkIndex = tabsLinks.length;
            } else if (tabsLinkIndex < 1) {
                tabsLinkIndex = 1;
            }
            _showTab(tabsLinks[tabsLinkIndex - 1]);
            }
        };

        _eventTabsShow = new CustomEvent('tab.show', { detail: _elemTabs });

        _elemTabs.addEventListener('click', function (e) {
        var tabsLinkTarget = e.target;
        // завершаем выполнение функции, если кликнули не по ссылке
        if (!tabsLinkTarget.classList.contains('tabs__link')) {
            return;
        }
        // отменяем стандартное действие
        e.preventDefault();
        _showTab(tabsLinkTarget);
        });

        return {
            showTab: function (target) {
                _showTab(target);
            },
            switchTabTo: function (index) {
                _switchTabTo(index);
            }
        }

    };

    $('.currency h3').click(function(){
        $('.currency h3').removeClass('active');
        $(this).addClass('active');
    });



    $tabs('.tabs');

    if($('#select_currency option:selected').text() == 'RUB'){
        $('.currency_usd').css({
            "display": "none"
        });

        $('.currency_rub').css({
            "display": "inline-block"
        });
    }
    else if($('#select_currency option:selected').text() == "USD"){
        $('.currency_rub').css({
            "display": "none"
        });

        $('.currency_usd').css({
            "display": "inline-block"
        });
    }

    $('#select_currency').change(function(){
        if($('#select_currency option:selected').text() == 'RUB'){
            $('.currency_usd').css({
                "display": "none"
            });
    
            $('.currency_rub').css({
                "display": "inline-block"
            });
        }
        else if($('#select_currency option:selected').text() == "USD"){
            $('.currency_rub').css({
                "display": "none"
            });
    
            $('.currency_usd').css({
                "display": "inline-block"
            });
        }
    });



    $('#comission__select').change(function(){
        if($('#comission__select option:selected').text() == 'Другая'){
            $('.network__comission input').prop('disabled', false);
        }
        else{
            $('.network__comission input').prop('disabled', true);
        }
    });


    //выпадающее меню экспорта
    $('.dropbtn').click(function(){
        $(this).parent().toggleClass('active');
    });

    

    $('.details').click(function(){
        var active = $('.main__info').attr("class").split(/\s+/);

        for(var i = 0; i < active.length; i++){
            if(active[i] == "active"){
                $('.details__text').text('Подробнее');
            }
            else{
                $('.details__text').text('Свернуть');
            }
        }
        $('.main__info').toggleClass("active");
    });

    //активные счета в левом списке
    $('.currency table tr').click(function(){
        $('.currency table tr').removeClass("active_acc");
        $(this).addClass("active_acc");
    });

    
    //добавить нового получателя
    let receiver = $('.receiver');
    $('.add_receiver').click(function(){
        let newReceiver = receiver.clone();
        newReceiver.find('input:text').val('');
        newReceiver.removeClass("disabled").appendTo('.receivers');
        $('.submit_btn').prop('disabled', true);
    });

    //удалить получателя
    $(document).on('click', ".delete_btn", function(){
        $(this).parent().parent().remove();
        hex();
    });

    //проверка на заполненность полей
    $(document).on("change input hover", ".send form", function(){
       hex();
    });

    function hex(){
        let el = $('.send_form');
        let button = $('.submit_btn');
        let sumInputs = $('.send_form').find('input').length;
        let select = $("#comission__select");
        
        let maxboxes = 0;
        $(".send_form input").each(function(i){
            if($(this).val() != ''){
                maxboxes++;
            }
        });
        if(select.val() != "other"){
            $('.input_comission').val("");
        }
        if((maxboxes == sumInputs) || ((maxboxes == sumInputs-1) && (select.val() != "other"))){
            el.addClass("success");
            el.removeClass("error");
            $('.submit_btn').prop('disabled', false);
        }
        else if(maxboxes < sumInputs){
            el.addClass("error");
            el.removeClass("success");
            $('.submit_btn').prop('disabled', true);
        }
    }

    //предыдущие адреса

    if($(".address_table tr").length > 10){
        // $(".show_more").css({"display": 'block'});
        $('.show_more').removeClass("disabled");
    }
    else{
        // $(".show_more").css({"display": 'none'});
        $('.show_more').addClass("disabled");
    }

    $('.show_more').click(function(){
        let heightTable = $(".address_table").height();
        let heightWrapper = $('.table_wrapper').height();

        $('.show_less').addClass("active");
        
        if(heightTable > heightWrapper){

            if(heightWrapper+290 > heightTable){
                $('.table_wrapper').css({
                    "height":  heightWrapper+(heightTable-heightWrapper) + "px"
                });
                $(this).addClass('disabled');
            }
            else{
                $('.table_wrapper').css({
                    "height": heightWrapper+290 + "px"
                });
            }
        }
    });

    $('.show_less').click(function(){
        $(this).removeClass("active");
        $('.show_more').removeClass('disabled');
        $('.table_wrapper').css({
            "height":  290 + "px"
        });
    });
    

    //автозаполнение таблицы предыдущих адресов
    // let table = document.querySelector('#address_table');

    // for(let i = 91; i > 0; i--){
    //     let tr = document.createElement('tr');

    //     for(let j = 0; j < 3; j++){
    //         let td = document.createElement('td');
    //         if(i % 2 == 0){
    //             if(j == 0){
    //                 td.innerHTML = i+":";
    //             }
    //             else if(j == 1){
    //                 td.innerHTML = "3CES4XhJvj3VLEwsJWoQoNtjSqV9MEHDQH";
    //             }
    //             else if(j == 2){
    //                 td.innerHTML = "Не использован";
    //             }
    //         }
    //         else{
    //             if(j == 0){
    //                 td.innerHTML = i+":";
    //             }
    //             else if(j == 1){
    //                 td.innerHTML = "3Qo6CK76o6cvsdMnaAg522wKedhXjmmFWF";
    //                 $(td).css({'color': 'black'});
    //             }
    //             else if(j == 2){
    //                 td.innerHTML = "Всего получено:";
    //                 $(td).css({'color': 'black'});
    //                 td.innerHTML += "<span style='color: #47a348;'> 0.00343475 BTC</span>"
    //             }
    //         }
            
    //         tr.appendChild(td);
    //     }
    //     table.appendChild(tr);
    // }

    $(".right_arrow").click(function(){
        $(this).toggleClass("active");
        $(".content").toggleClass("active");
    });

    $('.tabs__exit').on("click", function(){
        $('.exit_menu').addClass("active");
    });

    $('.cancel_exit').on('click', function(){
        $('.exit_menu').removeClass('active');
    });

});

function copy(){
    let copyText = $(".copy_input");
    copyText.select();
    document.execCommand("copy");
}