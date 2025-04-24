
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

//table bibliothéque stocker les films
// bibliothèque des film de l'utilisateur
db.exec(`
    CREATE TABLE IF NOT EXISTS library(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`)

//table de films
db.exec(`
    CREATE TABLE IF NOT EXISTS films (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titel TEXT UNIQUE NOT NULL,
        poster_url TEXT,
        description TEXT

    );
`)

//table des avis/commentaires
db.exec(`
   CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        film_id INTEGER NOT NULL,
        rating INTEGER CHECK(rating BETWEEN 1 AND 5),
        comment TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE
    );
`)

//table des listes
// liste cree par l'utilisateur pour organiser le stocage de  
db.exec(`
    CREATE TABLE IF NOT EXISTS listes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`)

//tables de genre
db.exec(`
    CREATE TABLE IF NOT EXISTS genre(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );
`)

//table notification
db.exec(`
    CREATE TABLE IF NOT EXISTS notification(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`)
