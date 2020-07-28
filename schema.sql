drop table if exists joke;
create table joke(
    id serial PRIMARY key,
    lineone VARCHAR(255),
    linetwo VARCHAR(255),
    linethree VARCHAR(255)
);