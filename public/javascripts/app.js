$(document).ready(function () {
    $.get("/lists", function (lists) {
        return $.each(lists, function (i, list) {
                $('#favoriteList').append("<option value='" + i + "' listId='" + list.listId + "'>" + list.listName + "</option>");
            }
        );
    });

    $(document).on('click', '#search', function () {
        $('#movies').empty();
        var pages = 1;
        $.get("/movies?query=" + $('#query').val(), function (data) {
            pages = data.total_pages;
            var addButton, form, movieDiv, movieTitleDiv;
            var movies = $('#movies');
            var movieResults = data.results;
            $.each(movieResults, function (index, movie) {
                var posterPath = movie.poster_path == null
                    ? "/assets/images/noposter.png"
                    : "http://image.tmdb.org/t/p/w92" + movie.poster_path;
                var img = $("<img name='posterPath' src='" + posterPath + "'>");
                form = $("<form action='/movie' method='post'>");
                movieDiv = $("<div class='movie'>");
                addButton = $("<div class='favorite-button-add'>");
                movieTitleDiv = $("<div class='movie-title'>").text(movie.title);
                movieDiv.append(addButton);
                movieDiv.append(movieTitleDiv);
                movieDiv.append(img);
                form.append(movieDiv);
                movies.append(form);
            });
            //append search results for next pages of api request, but limit max pages to 10
            for (var i = 2; i <= pages && i <= 10; i++) {
                $.get("/movies?query=" + $('#query').val() + "&page=" + i, function (nextData) {
                    movieResults = nextData.results;
                    $.each(movieResults, function (nextIndex, nextMovie) {
                        var posterPath = nextMovie.poster_path == null
                            ? "/assets/images/noposter.png"
                            : "http://image.tmdb.org/t/p/w92" + nextMovie.poster_path;
                        var img = $("<img name='posterPath' src='" + posterPath + "'>");
                        form = $("<form action='/movie' method='post'>");
                        movieDiv = $("<div class='movie'>");
                        addButton = $("<div class='favorite-button-add'>");
                        movieTitleDiv = $("<div class='movie-title'>").text(nextMovie.title);
                        movieDiv.append(addButton);
                        movieDiv.append(movieTitleDiv);
                        movieDiv.append(img);
                        form.append(movieDiv);
                        movies.append(form);
                    });
                });
            }
        });
    });

    $(document).on('click', '#openList', function () {
        var that = $(this);
        var data = {listId: $('#favoriteList').find(":selected").attr("listId")};
        $.get("/favorite", data, function (list) {
            sessionStorage.setItem("list", list);
            location.href = "/favorite?listId=" + list.listId;
        });
    });

    $(document).on('change', '#favoriteList', function () {
        $('.favorite-button-add').removeClass('favorite-button-remove');
    });

    $(document).on('click', '.favorite-button-add', function () {
        var that = $(this);
        var data = {
            title: that.next().html(),
            posterPath: that.next().next().attr("src"),
            listId: $('#favoriteList').find(":selected").attr("listId")
        };
        $.post("/movie", data);
        $(this).addClass('favorite-button-remove');
    });
});



