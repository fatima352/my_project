
import { DatabaseSync } from "node:sqlite";
export const db = new DatabaseSync("/Users/fatima/my_project/Back_end/database/data.db");

//table des utiliasateurs
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    );
`)

//table de film
db.exec(`
    CREATE TABLE IF NOT EXISTS film (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titel TEXT UNIQUE NOT NULL,
        date TEXT NOT NULL,
        posterURL TEXT,
        description TEXT
    );
`)

//table bibliothéque stocker les films
// bibliothèque des film de l'utilisateur
db.exec(`
    CREATE TABLE IF NOT EXISTS library(
        userId INTEGER NOT NULL,
        filmId INTEGER NOT NULL,
        PRIMARY KEY (userId, filmId),
        FOREIGN KEY (filmId) REFERENCES film(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
`)

//table des avis/commentaires des films
db.exec(`
   CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        filmId INTEGER NOT NULL,
        contenu TEXT NOT NULL,
        date TEXT NOT NULL, 
        rating INTEGER CHECK(rating BETWEEN 1 AND 5),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (filmId) REFERENCES films(id) ON DELETE CASCADE
    );
`)

// association film et liste 
db.exec(`
    CREATE TABLE IF NOT EXISTS listeFilm(
        listeId INTEGER NOT NULL,
        filmId INTEGER NOT NULL,
        PRIMARY KEY (listeId, filmId),
        FOREIGN KEY (listeId) REFERENCES liste(id) ON DELETE CASCADE,
        FOREIGN KEY (filmId) REFERENCES film(id) ON DELETE CASCADE
        );
`)

//table des listes
// liste cree par l'utilisateur pour organiser le stocage de  
db.exec(`
    CREATE TABLE IF NOT EXISTS liste (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        userId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
`)

//tables de likes d'une liste
db.exec(`
    CREATE TABLE IF NOT EXISTS likeListes(
        listeId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        PRIMARY KEY (listeId, userId),
        FOREIGN KEY (listeId) REFERENCES listes(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
`)

//table likes des films
db.exec(`
    CREATE TABLE IF NOT EXISTS likeFilm(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filmId INTERGER NOT NULL,
        userId INTEGER NOT NULL,
        FOREIGN KEY (filmId) REFERENCES films(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
`)

//table commentaire d'une liste 
db.exec(`
    CREATE TABLE IF NOT EXISTS commentList(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        listeId INTEGER NOT NULL,
        contenu TEXT NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (listeId) REFERENCES listes(id) ON DELETE CASCADE
    );
`)

//table notification
db.exec(`
    CREATE TABLE IF NOT EXISTS notification(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        userId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
`)
