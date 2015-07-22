angular.module('themoviedbApp', ['ui.bootstrap', 'ui.router']).controller('MoviesCtrl', function ($scope, $http, $location, $state) {

    $scope.currentSearchText;
    $scope.movieList = [];
    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.maxSize = 15;
    $scope.itemsPerPage = 20;
    $scope.maxSearchResult = 20000;
    $scope.favoriteList;
    $scope.currentList;

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
        $('.no-search-value').hide();
        $location.path("/");
        $scope.currentList = null;
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
            $('.no-search-value').show();
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

    $scope.addMovieToFavorites = function ($index, mov, $event) {
        if ($('#favoriteList').val() != null) {
            var clicked = event.target;
            var data = {
                title: mov.title,
                posterPath: mov.poster_path,
                id: $('#favoriteList').find(":selected").attr("listId")
            };
            $http({
                method: 'POST',
                url: "/movie",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
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
        if ($("input[name='listName']").val()) {
            $('.no-list-name').hide();
            $http({
                method: 'POST',
                url: "/list",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {name: $("input[name='listName']").val()}
            }).success(function () {
                $scope.readFavoriteList();
                $('.no-list-exist').hide();
                $("input[name='listName']").val('');
            });
        } else {
            $('.no-list-name').show();
        }
    };

    $scope.openFavoriteList = function (listIdFromUrl) {
        if ($('#favoriteList').val() || listIdFromUrl) {
            $scope.totalItems = 0;
            $scope.movieList = [];
            var listId = listIdFromUrl ? listIdFromUrl : $('#favoriteList').find(":selected").attr("listId");
            $("option[listid]").removeAttr('selected');
            $("option[listid]").each(function () {
                if ($(this).attr('listId') == listId) {
                    $(this).attr('selected', "selected");
                }
            });
            var data = {id: listId};
            $.get("/favorite", data, function (list) {
                $state.go("favorite");
                $scope.currentList = list;
                $location.path("/favorite/" + listId);
                $scope.$apply()
            });
        } else {
            $('.no-list-exist').show();
        }
    };
}).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('favorite', {
            url: "/favorite/:id",
            templateUrl: "/assets/html/favorite.html",
            controller: 'MoviesCtrl'
        });
    $urlRouterProvider.otherwise("/");
});