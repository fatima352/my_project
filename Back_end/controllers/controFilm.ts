import { db } from "../database/data.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import * as ws from "../websocket.ts";


//Fonction pour récupérer tous les films de la base de données
export const getAllFilms = (ctx:Context) => {
    try {
        const films = db.prepare(`SELECT * FROM film`).all(); // Fetch all films from the "film" table
        ctx.response.status = 200;
        ctx.response.body = { films }; // Return the films as JSON
        console.log("Films récupérer avec succé");
    } catch (error) {
        console.error("Erreur lors de la récupérartion:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur lors de la récupération des films" };
    }
}

// Fonction pour ajouter un film à la base de données (Accés admin uniquement)
// --> ameliorations : ajouter websocket
export const addFilm = async (ctx:Context) =>{
    try{
        const body = await ctx.request.body.json();
        const {title, date, posterURL, description} = body;
        
        if(!title || !date || !posterURL || !description){
            ctx.response.status = 400;
            ctx.response.body = {message : "Tous les champs sont obligatoires"};
            console.log("Tous les champs sont obligatoires");
            return;
        }
        const film = db.prepare(`SELECT * FROM film WHERE title = ?`).get(title) as {title: string} | undefined;
    
        if(film){
            ctx.response.status = 409;
            ctx.response.body = {message: "Film déjà existant"};
            console.log("Film déjà existant");
            return;
        }
    
        const newFilm = { title, date, posterURL, description };
        db.prepare(`INSERT INTO film (title, date, posterURL, description) VALUES (?, ?, ?, ?)`).run(title, date, posterURL, description);
        ws.notifyNewFilm(newFilm);

        ctx.response.status = 201;
        ctx.response.body = {message: "Film ajouté avec succès"};
        console.log("Film ajouté avec succès");

    }
    catch(error){
        ctx.response.status = 500;
        ctx.response.body = {message: "Erreur serveur", error: error.message};
        console.error("Erreur dans addFilm :", error);
    }

}

// Fonction pour récupérer les informations d'un film
export const getFilm = (ctx:Context)=>{
    try{
        const id = ctx.params.id;
        if(!id){
            ctx.response.status = 400;
            ctx.response.body = { message: "ID manquant dans l'URL" };
            return;
        }
    
        const film = db.prepare(`SELECT * FROM film WHERE id = ?`).get(id) as {id: number} | undefined;
        if(!film){
            ctx.response.status = 404;
            ctx.response.body = {message: "Le film n'existe pas dans la base de données"};
            console.log("Le film n'existe pas dans la base de données");
            return;
        }

        ctx.response.status = 200;
        ctx.response.body = {message:"Film trouvé", film};

    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur serveur", error: error.message };
        console.error("Erreur dans getFilm :", error);
    }

}

//Fonction pour mettre à jour les information d'un film (Accés Admin)
export const updateFilm = async (ctx:Context)=>{
    try{
        const body = await ctx.request.body.json();
        const {title, date, posterURL, description} = body;
        const id = ctx.params.id;
    
        if(!id){
            ctx.response.status = 400;
            ctx.response.body = { message: "ID manquant dans l'URL" };
            console.log("problème id");
            return;
        }
        const film = db.prepare(`SELECT * FROM film WHERE id = ?`).get(id);
        if(!film){
            ctx.response.status = 404;
            ctx.response.body = {message: "Le film n'existe pas dans la base de donnée"};
            console.log("Le film n'existe pas dans la base de donnée");
            return;
        }
        // On crée un nouvel objet avec les nouvelles valeurs ou les anciennes si rien n’est envoyé
        if(title){
            db.prepare(`UPDATE film SET title = ? WHERE id = ?`).run(title, id);
        };
        if(date){
            db.prepare(`UPDATE film SET date = ? WHERE id = ?`).run(date, id);
        };
        if (posterURL) {
            db.prepare(`UPDATE film SET posterURL = ? WHERE id = ?`).run(posterURL, id);
        }
        if (description) {
            db.prepare(`UPDATE film SET description = ? WHERE id = ?`).run(description, id);
        }

        const filmData = db.prepare(`SELECT title FROM film WHERE id = ?`).get(id) as {title: string} | undefined;
        if (!filmData) {
            ctx.response.status = 404;
            ctx.response.body = { message: "Film non trouvé" };
            console.log("Film non trouvé");
            return;
        }
        ws.notifyUpdateFilm(filmData);
        ctx.response.status = 200;
        ctx.response.body = { message: "Titre mis à jour avec succès" };

    }
    catch(error){
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur serveur", error: error.message };
        console.error("Erreur dans updateFilm :", error);
    }


}

// Fonction pour supprimer un film de la base de données (Accés Admin)
export const deleteFilm = (ctx:Context)=>{
    try{
        const id = ctx.params.id;
        if(!id){
            ctx.response.status = 400;
            ctx.response.body = { message: "ID manquant dans l'URL" };
            return;
        }
        const film = db.prepare(`SELECT * FROM film WHERE id = ?`).get(id);
        if(!film){
            ctx.response.status = 404;
            ctx.response.body = {message: "Le film n'existe pas dans la base de donnée"};
            console.log("Le film n'existe pas dans la base de donnée");
        }
    
        db.prepare(`DELETE FROM film WHERE id = ?`).run(id);

        ws.notifyDeleteFilm(film);
        ctx.response.status = 200;
        ctx.response.body = {message: "Supprimé avec succès"};
        console.log("film supprimé");
    }
    catch(error){
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur serveur", error: error.message };
        console.error("Erreur dans deleteFilm :", error);
    }

}

export function getlastfilm(arg0: string, getlastfilm: any) {
  throw new Error("Function not implemented.");
}
