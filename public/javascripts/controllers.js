angular.module('themoviedbApp', ['ui.bootstrap']).controller('MoviesCtrl', function ($scope, $http) {
    $scope.currentSearchText;
    $scope.movieList = [];
    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.maxSize = 15;
    $scope.itemsPerPage = 20;
    $scope.maxSearchResult = 20000;
    $scope.favoriteList;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.changePage = function () {
        $scope.movieList = [];
        $.get("/movies?query=" + $scope.currentSearchText + "&page=" + $scope.currentPage, function (data) {
            $scope.handleSearchResults(data);
            $scope.$apply();
        });
    };

    $scope.searchMovies = function () {
        $('.noSearchValue').hide();
        $scope.currentPage = 1;
        $scope.currentSearchText = $('#query').val();
        if ($scope.currentSearchText) {
            $scope.movieList = [];
            $.get('/movies?query=' + $scope.currentSearchText, function (data) {
                $scope.handleSearchResults(data);
                $scope.totalItems = data.total_pages * $scope.movieList.length <= $scope.maxSearchResult
                    ? data.total_pages * $scope.movieList.length : $scope.maxSearchResult;
                $scope.$apply();
            });
        } else {
            $('.noSearchValue').show();
        }
    };

    $scope.handleSearchResults = function (data) {
        $.each(data.results, function (i, item) {
            var imgSrc;
            if (item.poster_path != null) {
                imgSrc = "http://image.tmdb.org/t/p/w92" + item.poster_path;
            } else {
                imgSrc = "/assets/images/noposter.png";
            }
            $scope.movieList.push({"title": item.title, "poster_path": imgSrc});
        });
    };

    $scope.readFavoriteList = function () {
        $.get("/lists", function (lists) {
            $scope.favoriteList = lists;
            $scope.$apply();
        });
    };

    $scope.addMovieToFavorites = function ($index, mov) {
        if($('#favoriteList').val() != null) {
            var data = {
                title: mov.title,
                posterPath: mov.poster_path,
                listId: $('#favoriteList').find(":selected").attr("listId")
            };
            console.log(data);
            $http({
                method: 'POST',
                url: "/movie",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: data
            });
        } else {
            alert("Create a list first.");
        }
    };

    $scope.createList = function () {
        $http({
            method: 'POST',
            url: "/list",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {listName : $("input[name='listName']").val()}
        }).success(function() {
            $scope.readFavoriteList();
        });
    };

    $scope.openFavoriteList = function () {

    };
});