
import { DatabaseSync } from "node:sqlite";
export const db = new DatabaseSync("/Users/fatima/my_project/Back_end/database/data.db");

/* TABLE UTILISATEUR */
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    );
`)

/* TABLE FILM */
db.exec(`
    CREATE TABLE IF NOT EXISTS film (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT UNIQUE NOT NULL,
        date TEXT NOT NULL,
        posterURL TEXT,
        description TEXT
    );
`)
/* TABLE COLLECTION DE FILM DE L'UTILISATEUR */
db.exec(`
    CREATE TABLE IF NOT EXISTS library(
        userId INTEGER NOT NULL,
        filmId INTEGER NOT NULL,
        PRIMARY KEY (userId, filmId),
        FOREIGN KEY (filmId) REFERENCES film(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
`)

/* TABLE COMMENTAIRE DES FILMS */
db.exec(`
   CREATE TABLE IF NOT EXISTS reviewsfilm (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        filmId INTEGER NOT NULL,
        contenu TEXT NOT NULL,
        date TEXT NOT NULL, 
        rating INTEGER CHECK(rating BETWEEN 1 AND 5),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (filmId) REFERENCES film(id) ON DELETE CASCADE
    );
`)

/* TABLE ASSOCIATION LIST FILM 
     --> Les films que contient la liste
 */
db.exec(`
    CREATE TABLE IF NOT EXISTS listeFilm(
        listeId INTEGER NOT NULL,
        filmId INTEGER NOT NULL,
        PRIMARY KEY (listeId, filmId),
        FOREIGN KEY (listeId) REFERENCES liste(id) ON DELETE CASCADE,
        FOREIGN KEY (filmId) REFERENCES film(id) ON DELETE CASCADE
        );
`)

/* TABLE LISTE 
     --> Liste que posséde un utilisateur
*/
db.exec(`
    CREATE TABLE IF NOT EXISTS liste (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        userId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
`)

/* TABLE COMMENTAIRE DES LISTES */
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

/* TABLE NOTIFICATIONS */
db.exec(`
    CREATE TABLE IF NOT EXISTS notification(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        userId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
`)
