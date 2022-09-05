let PM = null;

$(document).ready(function() {
    if ( ! PM ) PM = new PaymentManager();
    PM.hide_unused_currency_buttons();
    PM.deactivate_all_currency_buttons();
    PM.select_first_currency_button();
});

// ---------------------------------------------------------------------------------------------------------------------
//                                               Payment Manager
// ---------------------------------------------------------------------------------------------------------------------

class PaymentManager {

    constructor() {
        // -------------------------------------------------------------------------------------------------------------
        //                                    Кнопки в левой части, выбор валюты.
        // -------------------------------------------------------------------------------------------------------------

        this.currency_bitcoin = $('#currency_bitcoin');
        this.currency_bitcoin.on('click', this.on_currency_bitcoin_clicked);

        this.currency_litecoin = $('#currency_litecoin');
        this.currency_litecoin.on('click', this.on_currency_litecoin_clicked);

        this.currency_ethereum = $('#currency_ethereum');
        this.currency_ethereum.on('click', this.on_currency_ethereum_clicked);

        this.currency_usdt_tron = $('#currency_usdt_tron');
        this.currency_usdt_tron.on('click', this.on_currency_usdt_tron_clicked);

        this.currency_usdt_ether = $('#currrency_usdt_ether');
        this.currency_usdt_ether.on('click', this.on_currency_usdt_ether_clicked);

        this.all_currency_buttons = [
            this.currency_bitcoin, this.currency_litecoin, this.currency_ethereum,
            this.currency_usdt_tron, this.currency_usdt_ether
        ];

        // "Текущий блокчейн" (состояние, определяемое активной кнопкой слева).
        this.current_blockchain_name = '';

        this.api_root_url = document.location.protocol + "//" + document.location.hostname + '/api';

        // -------------------------------------------------------------------------------------------------------------
        //                           Табуляторы - транзакции, получить, отправить.
        // -------------------------------------------------------------------------------------------------------------

        this.transaction_tab = $('#transaction_tab');
        this.transaction_tab.on('click', this.on_transaction_tab_clicked);

        this.receive_tab = $('#receive_tab');
        this.receive_tab.on('click', this.on_receive_tab_clicked);

        this.send_tab = $('#send_tab');
        this.send_tab.on('click', this.on_send_tab_clicked);

        // -------------------------------------------------------------------------------------------------------------
        //                                            Элементы управления
        // -------------------------------------------------------------------------------------------------------------
        this.logout = $('#logout');
        this.logout.on('click', this.on_logout_clicked);

    }

    hide_unused_currency_buttons() {
        this.currency_litecoin.hide();
    }

    deactivate_all_currency_buttons() {
        this.all_currency_buttons.forEach(function(item) {
            item.removeClass('active');
        });
    }

    select_first_currency_button() {
        let activated = false;
        this.all_currency_buttons.forEach(function(item) {
            if ((item.is(':visible')) && ( !activated )) {
                // item.addClass('active');
                // Чтобы сразу установился current_blockchain_name, почистились таблицы и др.
                item.click();
                activated=true;
            }
        })
    }

    set_cookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    get_cookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    remove_cookie(sKey, sPath, sDomain) {
        document.cookie = encodeURIComponent(sKey) +
            "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
            (sDomain ? "; domain=" + sDomain : "") +
            (sPath ? "; path=" + sPath : "");
    }

    get_full_api_url(uri) {
        return SETTINGS.host_url + uri;
    }

    api_get_next_wallet_index() {
        let url = PM.get_full_api_url('/api/get-next-wallet-index/');
    }

    // -----------------------------------------------------------------------------------------------------------------
    //                                 Выход (завершение сессии) - на клиентской части
    // -----------------------------------------------------------------------------------------------------------------

    perform_logout() {
        fetch(PM.get_full_api_url('/logout/'), {
            method: 'POST',
        }).then(function(response) {
            if (response.status === 200) {
                PM.remove_cookie('token');
                PM.remove_cookie('csrftoken');
                PM.remove_cookie('sessionid');
                window.location.href = 'login.html';
            } else console.error(response);
        })
    }

    // -----------------------------------------------------------------------------------------------------------------
    //                                                  Создание кошелька
    // -----------------------------------------------------------------------------------------------------------------

    perform_create_wallet() {
        $('#new-wallet-form').removeClass('error');
        $('#new-wallet-address').val('');
        fetch(PM.get_full_api_url('/api/whitebit-wallet/'), {
            method: 'PUT',
            body: JSON.stringify({
                'blockchain': PM.current_blockchain_name
            }),
            headers: {
                'Authorization': 'Token ' + PM.get_cookie('token'),
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            let got_status = response.status;
            response.json().then(function(answer) {
                if (got_status === 200 || got_status === 201) {
                    $('#new-wallet-address').val(answer.address);
                    PM.api_get_next_wallet_index();
                } else {
                    let message = response.statusText;
                    if (answer) message += ': ' + (answer.message || answer.detail);
                    $('#current-wallet-index').attr('aria-label', message);
                    $('#new-wallet-form').addClass('error');
                }
            });
        })
    }

    clear_transactions_table() {

    }

    clear_wallet_table() {

    }

    /**
     * Очистка - вообще всех таблиц на экране.
     */
    clear_all_tabs_for(currency) {
        $('#transaction_currency_name').text(currency);
        $('#what-to-receive').text('Получить ' + currency);
        $('#what-to-send').text('Отправить ' + currency);
        $('#new-wallet-form').removeClass('error');
        this.clear_transactions_table();
        this.clear_wallet_table();
        PM.api_get_next_wallet_index();
    }

    // -----------------------------------------------------------------------------------------------------------------
    //                                      Нажатие на кнопку валюты биткоина
    // -----------------------------------------------------------------------------------------------------------------

    on_currency_bitcoin_clicked(event) {
        PM.current_blockchain_name = 'btc';
        PM.clear_all_tabs_for('Bitcoin (BTC)');
    }

    on_currency_litecoin_clicked(event) {
        PM.clear_all_tabs_for('Litecoin (LTC)');
    }

    on_currency_ethereum_clicked(event) {
        PM.current_blockchain_name = 'eth_whitebit';
        PM.clear_all_tabs_for('Ethereum (ETH)');
    }

    on_currency_usdt_tron_clicked(event) {
        PM.current_blockchain_name = 'usdt_whitebit_trx';
        PM.clear_all_tabs_for('USDT (Tether TRC-20)');
    }

    on_currency_usdt_ether_clicked(event) {
        PM.clear_all_tabs_for('USDT (Tether ERC-20)');
        PM.current_blockchain_name = 'usdt_whitebit_eth';
        PM.api_get_next_wallet_index();
    }

    on_transaction_tab_clicked(event) {

    }

    on_receive_tab_clicked(event) {
        PM.api_get_next_wallet_index();
    }

    on_send_tab_clicked(event) {

    }

    // -----------------------------------------------------------------------------------------------------------------
    //                                           Нажатие на кнопку logout
    // -----------------------------------------------------------------------------------------------------------------
    on_logout_clicked(event) {
        PM.perform_logout();
    }

}
