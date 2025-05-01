import { db } from "../database/data.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";


//Fonction pour récupérer tous les films de la base de données
export const getAllFilms = async (ctx:Context) => {
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
};

// Fonction pour ajouter un film à la base de données (Accés admin uniquement)
// --> ameliorations : ajouter websocket
export const addFilm = async (ctx:Context) =>{
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

    db.prepare(`INSERT INTO film (title, date, posterURL, description) VALUES (?, ?, ?, ?)`).run(title, date, posterURL, description);
    ctx.response.status = 201;
    ctx.response.body = {message: "Film ajouter avec succés"};
    console.log("Film ajouter avec succés");
}

// Fonction pour récupérer les informations d'un film
export const getFilm = (ctx:Context)=>{
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
}

//Fonction pour mettre à jour les information d'un film (Accés Admin)
export const updateFilm = async (ctx:Context)=>{
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
    ctx.response.status = 200;
    ctx.response.body = { message: "Titre mis à jour avec succès" };

}

// Fonction pour supprimer un film de la base de données (Accés Admin)
export const deleteFilm = async(ctx:Context)=>{
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
    ctx.response.status = 200;
    ctx.response.body = {message: "Suprimer avec succe"};
    console.log("film supprimer");
}

