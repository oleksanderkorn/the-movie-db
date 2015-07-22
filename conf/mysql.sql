CREATE SCHEMA `themoviedb` ;

create table favorite_list (
  id                        integer not null,
  name                      varchar(255),
  constraint pk_favorite_list primary key (id))
;

create table favorite_movie (
  id                        integer not null,
  public_id                 integer,
  title                     varchar(255),
  poster_path               varchar(255),
  constraint pk_favorite_movie primary key (id))
;

create table favorite_list_favorite_movie (
  favorite_list_id               integer not null,
  favorite_movie_id              integer not null,
  constraint pk_favorite_list_favorite_movie primary key (favorite_list_id, favorite_movie_id))
;

alter table favorite_list_favorite_movie add constraint fk_favorite_list_favorite_mov_01 foreign key (favorite_list_id) references favorite_list (id) on delete restrict on update restrict;

alter table favorite_list_favorite_movie add constraint fk_favorite_list_favorite_mov_02 foreign key (favorite_movie_id) references favorite_movie (id) on delete restrict on update restrict;