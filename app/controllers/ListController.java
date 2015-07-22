package controllers;

import model.FavoriteList;
import play.mvc.Result;
import views.html.list;

import static play.libs.Json.toJson;

public class ListController extends Application {

    public Result getFavoriteLists() {
        return ok(toJson(finder.all()));
    }

    public Result getFavoriteListById(Integer id) {
        FavoriteList favoriteList = (FavoriteList) finder.byId(id);

        if (favoriteList != null) {
            return ok(list.render(favoriteList));
        } else {
            return badRequest(LIST_NOT_FOUND);
        }
    }

    public Result addFavoriteList(String name) {
        new FavoriteList(name).save();
        return created();
    }
}
