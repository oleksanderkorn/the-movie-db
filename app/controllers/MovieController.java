package controllers;

import model.FavoriteList;
import model.FavoriteMovie;
import play.data.Form;
import play.libs.F;
import play.mvc.Result;

public class MovieController extends Application {
    public F.Promise<Result> getMovies(String query, Integer page) {
        F.Promise<Result> promise = ws.url(SEARCH_URL + query.replace(" ", "+") + PAGE_KEY + page).get().map((r) -> {
            if (r.getStatus() == 200) {
                return ok(r.asJson());
            } else {
                return badRequest(BAD_REQUEST);
            }
        });
        return promise;
    }

    public Result addMovieToFavoriteList(Integer listId) {
        Form<FavoriteMovie> movieForm = Form.form(FavoriteMovie.class).bindFromRequest();
        FavoriteMovie movie = movieForm.get();
        FavoriteList list = (FavoriteList) finder.byId(listId);
        movie.favorites.add(list);
        movie.save();
        list.movies.add(movie);
        list.save();
        return created();
    }
}
