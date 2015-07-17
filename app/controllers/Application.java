package controllers;

import com.avaje.ebean.Model;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import model.FavoriteList;
import model.FavoriteMovie;
import play.data.Form;
import play.libs.F;
import play.libs.ws.WSClient;
import play.libs.ws.WSResponse;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;

import javax.inject.Inject;
import java.util.List;

import static play.libs.Json.toJson;

public class Application extends Controller {

    @Inject
    private WSClient ws;

    public static final String SEARCH_MOVIES_URL = "http://api.themoviedb.org/3/search/movie?api_key=7a4de0fe5da237bdb52d1168dae8cd14&query=";
    public static final String QUERY = "query";
    public static final String PAGE = "page";

    public Result searchMovies() {
        String query = Form.form(String.class).bindFromRequest().data().get(QUERY) != null
                ? Form.form(String.class).bindFromRequest().data().get(QUERY).replace(" ", "+") : "";

        query += Form.form(String.class).bindFromRequest().data().get(PAGE) != null
                ? "&page=" + Form.form(String.class).bindFromRequest().data().get(PAGE) : "";

        F.Promise<JsonNode> jsonPromise = ws.url(SEARCH_MOVIES_URL + query).get().map(WSResponse::asJson);
        JsonNode results = jsonPromise.get(500);

        return ok(results);
    }

    public Result openList() {
        FavoriteList list = Form.form(FavoriteList.class).bindFromRequest().get();
        list = (FavoriteList) new Model.Finder(FavoriteList.class).byId(list.listId);
        return ok(toJson(list));
    }

    public Result addList() {
        FavoriteList favoriteList = Form.form(FavoriteList.class).bindFromRequest().get();
        favoriteList.save();
        return redirect(routes.Application.index());
    }

    public Result addMovie() {
        int listId = Integer.parseInt(Form.form(FavoriteMovie.class).bindFromRequest().data().get("listId"));
        FavoriteList list = (FavoriteList) new Model.Finder(FavoriteList.class).byId(listId);
        FavoriteMovie movie = Form.form(FavoriteMovie.class).bindFromRequest().get();
        movie.favorites.add(list);
        movie.save();
        list.movies.add(movie);
        list.save();
        return redirect(routes.Application.index());
    }

    public Result lists() {
        List<FavoriteList> lists = new Model.Finder(FavoriteList.class).all();
        return ok(toJson(lists));
    }

    public Result index() {
        return ok(index.render());
    }
}



