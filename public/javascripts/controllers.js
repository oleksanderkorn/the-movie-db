angular.module('themoviedbApp', []).controller('MoviesCtrl', function ($scope) {
    $scope.movieList = [];
    $scope.searchMovies = function() {
        $.get('/movies?query=' + $('#query').val(), function (data) {
            $.each(data.results, function(i, item){
                $scope.movieList.push({"title" :item.title , "poster_path" : item.poster_path});
            });
        });
    };
});