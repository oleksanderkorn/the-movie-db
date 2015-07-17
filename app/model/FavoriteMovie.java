package model;

import com.avaje.ebean.Model;
import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity
public class FavoriteMovie extends Model {

    @Id
    public int movieId;

    public String title;

    public String posterPath;

    @ManyToMany(targetEntity = FavoriteList.class, mappedBy = "movies")
    @JsonBackReference
    public Set<FavoriteList> favorites;
}
