function getAjax(url, response) {
    $.ajax({
        method: "GET",
        url: url,
        success: response,
        error: xhr => alert("An error occured: " + xhr.status + " " + xhr.statusText)
    });
}

function createMoreInfos(infos) {
    let item = `<div class="details-container modal">
    <div class="cross" onclick="removeMoreInfo(this)"><i class="fas fa-times"></i></div>
    <img class="details-img" src="${infos.image}" alt="${infos.id}">
    <h5 class="coin-symbol">${infos.symbol}</h5>
    <p class="coin-id">${infos.id}</p>
    <h6 class="details-price-header">Current Price:</h6>
    <div class="price"><i class="fas fa-dollar-sign"></i>${infos.price_usd} USD</div>
    <div class="price"><i class="fas fa-euro-sign"></i>${infos.price_eur} Euro</div>
    <div class="price"><i class="fas fa-shekel-sign"></i>${infos.price_ils} Shekel</div>
    </div>`;
    return item;
}

function removeMoreInfo(item) {
    document.body.removeChild(item.parentElement);
}

function showMoreInfo(id, symbol) {
    try {
        getAjax(`https://api.coingecko.com/api/v3/coins/${id}`, success => {
            let infos = {
                id: id,
                symbol: symbol,
                image: success.image.small,
                price_usd: success.market_data.current_price.usd,
                price_eur: success.market_data.current_price.eur,
                price_ils: success.market_data.current_price.ils
            }
            let item = createMoreInfos(infos);
            $("body").append(item);
            localStorage.setItem(symbol, JSON.stringify(infos));
        });
    } catch (error) {
        alert(error.message);
    }
}

function createCoinCard(id, symbol, divId) {
    const card = `<div class="coin-card" id="${id}">
    <div class="card-body">
        <div class="select-btn-container">
            <input type="checkbox" class="select-btn" name="${symbol}" id="${'switch' + divId}" onclick="switchFun(this.id)">
            <label for="${'switch' + divId}" class="select-btn-label"><div><span></span></div></label>
        </div>
        <h5 class="coin-symbol">${symbol}</h5>
        <p class="coin-id">${id}</p>
        <button class="coin-btn" onClick='showMoreInfo("${id}","${symbol}")'>More Info</button>
    </div>
    </div>`
    $(".coins-container").append(card);
}

function createCoins() {
    $("#data").empty();
    getAjax("https://api.coingecko.com/api/v3/coins", success => {
        $("#data").append(`<section class='coins-container'></section>`);
        for (let i = 0; i < 100; i++) {
            createCoinCard(success[i].id, success[i].symbol, i);
        }
    });
}

/* ***************************** */

function changeSelectedCoins(item) {
    item.parentElement.querySelectorAll("input:not(:checked)").forEach(element => {
        let name = element.getAttribute("name");
        removeSelectedCoin(name.split("-")[0]);
    });
    removeMoreInfo(item);
}

function switchFun(switchId) {
    try {
        let checkedBoxes = $("input:checked");

        if (checkedBoxes.length >= 6) {
            $("#" + switchId).prop("checked", false);
            checkedBoxes = $("input:checked");

            let appendCoins = "<div>";
            for (let item of checkedBoxes) {
                let coin = `<div class="checked-coin-container">
                <p class="checked-coin-symbol">${item.name}</p>
                <div>
                    <input type="checkbox" class="select-btn" name="${item.name}-checked" id="${item.name}-checked" checked>
                    <label for="${item.name}-checked" class="select-btn-label"><div><span></span></div></label>
                </div>
                </div>`
                appendCoins += coin;
            }
            appendCoins += "</div>";

            let modal = `<div class="checked-container modalx">
            <div class="cross" onclick="removeMoreInfo(this)"><i class="fas fa-times"></i></div>
            <h3>You can chooes only 5 coins, Please remove one of the coin to select other coins.</h3>` +
                appendCoins + `<div class="cross ok" onclick="changeSelectedCoins(this)">OK</div></div>`;

            $("body").append(modal);
        }
    } catch (error) {
        alert(error.massage);
    }
}

function removeSelectedCoin(coin) {
    $(`input[name="${coin}"]`).prop("checked", false);
}

function getAllCoins() {
    const checkedCoinsToChart = $("input:checked");
    let tmp = [];
    for (let i = 0; i < checkedCoinsToChart.length; i++) {
        tmp.push(checkedCoinsToChart[i].name.toUpperCase());
    }
    return localStorage.setItem("ajaxCoins", JSON.stringify(tmp));
}