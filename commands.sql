create table blogs (
  id serial primary key,
  author text,
  url text not null,
  title text not null,
  likes integer default 0
);

insert into blogs (author, url, title)
values
  ('Dan Abramov', 'https://overreacted.io/on-let-vs-const/', 'On let vs const'),
  ('E.W. Dijkstra', 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', 'Canonical string reduction');