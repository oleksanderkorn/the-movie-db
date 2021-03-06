angular.module('themoviedbApp', ['ui.bootstrap']).controller('MoviesCtrl', function ($scope, HttpPostRequestService) {
    $scope.currentSearchText;
    $scope.movieList = [];
    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.maxSize = 15;
    $scope.itemsPerPage = 20;
    $scope.maxSearchResult = 20000;
    $scope.favoriteLists;
    $scope.httpPostService = HttpPostRequestService;
    $scope.showNoSearchValue = false;
    $scope.existingName = false;
    $scope.noListName = false;
    $scope.noListExist = false;

    $scope.changePage = function () {
        $scope.movieList = [];
        $.get("/movies/" + $scope.currentSearchText + "/" + $scope.currentPage, function (data) {
            $scope.handleSearchResults(data);
            $scope.$apply();
        });
    };

    $scope.searchMovies = function () {
        $scope.showNoSearchValue = false;
        $scope.existingName = false;
        $scope.currentPage = 1;
        $scope.currentSearchText = $scope.query;
        if ($scope.currentSearchText) {
            $scope.movieList = [];
            $.get('/movies/' + $scope.currentSearchText + "/1", function (data) {
                $scope.handleSearchResults(data);
                $scope.totalItems = data.total_pages * $scope.movieList.length <= $scope.maxSearchResult
                    ? data.total_pages * $scope.movieList.length : $scope.maxSearchResult;
                $scope.$apply();
            });
        } else {
            $scope.showNoSearchValue = true;
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
            $scope.movieList.push({"publicId": item.id, "title": item.title, "poster_path": imgSrc});
        });
    };

    $scope.readFavoriteList = function () {
        $.get("/lists", function (lists) {
            $scope.favoriteLists = lists;
            $scope.$apply();
        });
    };

    $scope.addMovieToFavorites = function (mov) {
        if ($('#favoriteList').val()) {
            var selectedListId = $('#favoriteList').find(":selected").attr("listId");
            var uniqueMovie = true;
            $.each($scope.favoriteLists, function (i, item) {
                if (item.id == selectedListId) {
                    $.each(item.movies, function (j, movie) {
                        if (movie.publicId == mov.publicId) {
                            uniqueMovie = false;
                        }
                    });
                }
            });
            if (uniqueMovie) {
                var data = {
                    publicId: mov.publicId,
                    title: mov.title,
                    posterPath: mov.poster_path
                };
                $scope.httpPostService("/movie/" + selectedListId, data);
            }
        } else {
            alert("Create a list first.");
        }
    };

    $scope.createList = function () {
        $scope.noListName = false;
        $scope.existingName = false;
        var listName = $scope.listName ? $scope.listName.trim() : null;
        if (listName) {
            var uniqueName = true;
            $.each($scope.favoriteLists, function (i, item) {
                if (listName == item.name) {
                    uniqueName = false;
                    $scope.existingName = true;
                }
            });
            if (uniqueName) {
                $scope.httpPostService("/list/" + listName).success(function () {
                    $scope.readFavoriteList();
                    $scope.noListExist = false;
                    $scope.listName = '';
                });
            }
        } else {
            $scope.noListName = true;
        }
    };

    $scope.openFavoriteList = function () {
        var listId = $('#favoriteList').find(":selected").attr("listId");
        if (listId) {
            location.pathname = "/list/" + listId;
        } else {
            $scope.noListExist = true;
        }
    };
}).factory('HttpPostRequestService',
    function ($http) {
        return function (url, data) {
            return $http({
                method: 'POST',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: data
            });
        }
    });