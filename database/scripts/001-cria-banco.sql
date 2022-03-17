CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL
);

CREATE TABLE sessions (
   id SERIAL PRIMARY KEY,
   token TEXT NOT NULL UNIQUE,
   "userId" INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE urls(
	id serial NOT NULL PRIMARY KEY,
	"userId" integer NOT NULL REFERENCES users(id),
	"shortUrl" text NOT NULL UNIQUE,
	url text NOT NULL,
	"visitCount" integer NOT NULL
)
