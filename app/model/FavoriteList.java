package model;

import com.avaje.ebean.Model;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity
public class FavoriteList extends Model {

    @Id
    public int listId;

    public String listName;

    @ManyToMany(targetEntity = FavoriteMovie.class)
    @JsonManagedReference
    public Set<FavoriteMovie> movies;
}
