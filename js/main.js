$(document).ready(function () {
    if (window.location.pathname === "/index.html" || window.location.pathname === "/") {
        createCoins();
    }

    window.addEventListener("click", function (event) {
        if (!event.target.classList.contains("modal")) {
            $(".modal").remove();
        }
    });


    $("#about").click(() => {
        $("#data").html(`
        <div class="about-container">
        <img class="about-image" src="./assets/images/about.jpg" alt="Developer's Photo">
        <h2 class="about-name">Your Name</h2>
        <h3 class="about-tel">Tel : 0123456789</h3>
        </div>
        `);
    });

    $("#onlineReports").click(() => {
        getAllCoins();
        $("#data").html(`
        <div id="chartContainer" style="height: 300px; width: 100%;">
        </div>
        `);
        canvasAjax();
    });

    $("#searchBtn").click((event) => {
        event.preventDefault();
        event.stopPropagation();
        var value = $("#search").val().toLowerCase();
        document.querySelector(".coin-card:nth-child(1)").scrollIntoView();
        $(".coin-card").filter(function () {
            $(this).toggle($(this).find(".coin-id").text().toLowerCase().indexOf(value) > -1 || $(this).find(".coin-symbol").text().toLowerCase().indexOf(value) > -1)
        });
        document.querySelector(".coin-card:nth-child(1)").scrollIntoView();
    });
});