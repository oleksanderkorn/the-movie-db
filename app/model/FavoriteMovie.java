package model;

import com.avaje.ebean.Model;
import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.util.Set;

@Entity
public class FavoriteMovie extends Model {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public int id;

    public Integer publicId;

    public String title;

    public String posterPath;

    @ManyToMany(targetEntity = FavoriteList.class, mappedBy = "movies")
    @JsonBackReference
    public Set<FavoriteList> favorites;

    @Override
    public String toString() {
        return "FavoriteMovie{" +
                "id=" + id +
                ", publicId=" + publicId +
                ", title='" + title + '\'' +
                ", posterPath='" + posterPath + '\'' +
                ", favorites=" + favorites +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        FavoriteMovie movie = (FavoriteMovie) o;

        if (id != movie.id) return false;
        if (title != null ? !title.equals(movie.title) : movie.title != null) return false;
        if (posterPath != null ? !posterPath.equals(movie.posterPath) : movie.posterPath != null) return false;
        return !(favorites != null ? !favorites.equals(movie.favorites) : movie.favorites != null);

    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (posterPath != null ? posterPath.hashCode() : 0);
        return result;
    }
}
