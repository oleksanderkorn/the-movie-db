angular.module('themoviedbApp', ['ui.bootstrap']).controller('MoviesCtrl', function ($scope, $log) {
    $scope.currentSearchText;
    $scope.movieList = [];
    $scope.currentPage = 1;
    $scope.totalItems = 0;
    $scope.maxSize = 15;
    $scope.itemsPerPage = 20;
    $scope.maxSearchResult = 20000;

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
                imgSrc = "/assets/images/noimg.png";
            }
            $scope.movieList.push({"title": item.title, "poster_path": imgSrc});
        });
    };

    $scope.addToFavorite = function () {

    };


});