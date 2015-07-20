CREATE SCHEMA `themoviedb` ;

create table favorite_list (
  list_id                   integer auto_increment not null,
  list_name                 varchar(255),
  constraint pk_favorite_list primary key (list_id))
;

create table favorite_movie (
  movie_id                  integer auto_increment not null,
  title                     varchar(255),
  poster_path               varchar(255),
  constraint pk_favorite_movie primary key (movie_id))
;


create table favorite_list_favorite_movie (
  favorite_list_list_id          integer not null,
  favorite_movie_movie_id        integer not null,
  constraint pk_favorite_list_favorite_movie primary key (favorite_list_list_id, favorite_movie_movie_id))
;

alter table favorite_list_favorite_movie add constraint fk_favorite_list_favorite_movie_favorite_list_01 foreign key (favorite_list_list_id) references favorite_list (list_id) on delete restrict on update restrict;

alter table favorite_list_favorite_movie add constraint fk_favorite_list_favorite_movie_favorite_movie_02 foreign key (favorite_movie_movie_id) references favorite_movie (movie_id) on delete restrict on update restrict;