package controllers;

import com.avaje.ebean.Model;
import model.FavoriteList;
import play.libs.ws.WSClient;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;

import javax.inject.Inject;

public class Application extends Controller {

    @Inject
    protected WSClient ws;

    public Model.Finder finder = new Model.Finder(FavoriteList.class);

    public static final String SEARCH_URL = "http://api.themoviedb.org/3/search/movie?api_key=fb92ed0bac9cfafe54830e26abe791df&query=";
    public static final String BAD_REQUEST = "Bad request";
    public static final String LIST_NOT_FOUND = "List not found";
    public static final String PAGE_KEY = "&page=";

    public Result index() {
        return ok(index.render());
    }
}



