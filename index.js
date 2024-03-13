$(document).ready(function () {

    const url= "https://en.wikipedia.org/w/api.php";

    $("#searchInput").autocomplete({
        minLength: 3,
        autoFocus: true, 
        delay:100,
        source: function (request, response) {
            $.ajax({
                url: url,
                dataType: "jsonp",
                data: {
                    action: "opensearch",
                    format: "json",
                    search: request.term
                },
                success: function (data) {
                    response(data[1]);
                }
            });
        }
    });

    $("#searchButton").on("click", function () {
        var searchTerm = $("#searchInput").val();

        if (searchTerm.trim() !== "") {
            $("#result-title").text(searchTerm);
            searchWikipedia(searchTerm);
            $("#searchInput").autocomplete("close");

            animationFun();
        }
    });

    $("#searchInput").on("keypress", function (e) {
        if (e.which == 13) {
            var searchTerm = $("#searchInput").val();
            if (searchTerm.trim() !== "") {
                $("#result-title").text(searchTerm);
                searchWikipedia(searchTerm);
                $("#searchInput").autocomplete("close");
                animationFun();
               
            }
        }
    });
    

    function animationFun() {
        $("html, body").animate({
            scrollTop: $("#result-title").offset().top-35
        }, 500);
    }

    function searchWikipedia(searchTerm) {
        $("#searchResults").empty();

        $.ajax({
            url: url,
            dataType: "jsonp",
            data: {
                action: "query",
                format: "json",
                prop: "extracts",
                generator: "search",
                exsentences: 6, //number of lines to display 
                exintro: 1, //return just introduction
                gsrlimit: 10, //number of list return
                gsrsearch: searchTerm
            },
            success: function (data) {
                var results = data.query.pages;
                console.log(results);
                Object.values(results).forEach(function (value) {           
                    var listItem = $('<li>').addClass('list-group-item');
                    var link = $('<a>').attr('href', 'https://en.wikipedia.org/?curid=' + value.pageid)
                                       .attr('target', '_blank')
                                       .text(value.title);
                    listItem.append(link, value.extract);
                    $("#searchResults").append(listItem);
                });
            }
            



        });
    }
});
