# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table favorite_list (
  list_id                   integer not null,
  list_name                 varchar(255),
  constraint pk_favorite_list primary key (list_id))
;

create table favorite_movie (
  movie_id                  integer not null,
  title                     varchar(255),
  poster_path               varchar(255),
  constraint pk_favorite_movie primary key (movie_id))
;


create table favorite_list_favorite_movie (
  favorite_list_list_id          integer not null,
  favorite_movie_movie_id        integer not null,
  constraint pk_favorite_list_favorite_movie primary key (favorite_list_list_id, favorite_movie_movie_id))
;
create sequence favorite_list_seq;

create sequence favorite_movie_seq;




alter table favorite_list_favorite_movie add constraint fk_favorite_list_favorite_mov_01 foreign key (favorite_list_list_id) references favorite_list (list_id) on delete restrict on update restrict;

alter table favorite_list_favorite_movie add constraint fk_favorite_list_favorite_mov_02 foreign key (favorite_movie_movie_id) references favorite_movie (movie_id) on delete restrict on update restrict;

# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists favorite_list;

drop table if exists favorite_list_favorite_movie;

drop table if exists favorite_movie;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists favorite_list_seq;

drop sequence if exists favorite_movie_seq;

