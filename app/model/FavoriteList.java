package model;

import com.avaje.ebean.Model;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.Set;

@Entity
public class FavoriteList extends Model {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public int id;

    public String name;

    @ManyToMany(targetEntity = FavoriteMovie.class)
    @JsonManagedReference
    public Set<FavoriteMovie> movies;
}
