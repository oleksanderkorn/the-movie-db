package controllers;

import com.avaje.ebean.Model;
import model.FavoriteList;
import model.FavoriteMovie;
import play.data.Form;
import play.libs.F;
import play.libs.ws.WSClient;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;

import javax.inject.Inject;
import java.util.List;

import static play.libs.Json.toJson;

public class Application extends Controller {

    @Inject
    private WSClient ws;

    public static final String SEARCH_MOVIES_URL_API_KEY = "http://api.themoviedb.org/3/search/movie?api_key=fb92ed0bac9cfafe54830e26abe791df&query=";
    public static final String QUERY_KEY = "query";
    public static final String PAGE_KEY = "page";

    public F.Promise<Result> getMovies() {
        String query = Form.form(String.class).bindFromRequest().data().get(QUERY_KEY) != null
                ? Form.form(String.class).bindFromRequest().data().get(QUERY_KEY).replace(" ", "+") : "";

        query += Form.form(String.class).bindFromRequest().data().get(PAGE_KEY) != null
                ? "&" + PAGE_KEY + "=" + Form.form(String.class).bindFromRequest().data().get(PAGE_KEY) : "";

        F.Promise<Result> promise = ws.url(SEARCH_MOVIES_URL_API_KEY + query).get().map((r) -> {
            if (r.getStatus() == 200) {
                return ok(r.asJson());
            } else {
                return badRequest("Bad request");
            }
        });

        return promise;
    }

    public Result getFavoriteListById() {
        FavoriteList list = Form.form(FavoriteList.class).bindFromRequest().get();
        list = (FavoriteList) new Model.Finder(FavoriteList.class).byId(list.listId);
        return ok(toJson(list));
    }

    public Result addFavoriteList() {
        FavoriteList favoriteList = Form.form(FavoriteList.class).bindFromRequest().get();
        favoriteList.save();
        return created();
    }

    public Result addMovieToFavoriteList() {
        int listId = Integer.parseInt(Form.form(FavoriteMovie.class).bindFromRequest().data().get("listId"));
        FavoriteList list = (FavoriteList) new Model.Finder(FavoriteList.class).byId(listId);
        FavoriteMovie movie = Form.form(FavoriteMovie.class).bindFromRequest().get();
        movie.favorites.add(list);
        movie.save();
        list.movies.add(movie);
        list.save();
        return created();
    }

    public Result getFavoriteLists() {
        List<FavoriteList> lists = new Model.Finder(FavoriteList.class).all();
        return ok(toJson(lists));
    }

    public Result index() {
        return ok(index.render());
    }
}



