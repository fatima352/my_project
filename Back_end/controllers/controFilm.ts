import { db } from "../database/data.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";


//fonction pour recuperer tout les films
export const getAllFilms = async (ctx:Context) => {
    try {
        const films = db.prepare(`SELECT * FROM film`).all(); // Fetch all films from the "film" table
        ctx.response.status = 200;
        ctx.response.body = { films }; // Return the films as JSON
        console.log("Films fetched successfully:");
    } catch (error) {
        console.error("Error fetching films:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur lors de la récupération des films" };
    }
};

//fonction pour ajouter un film
export const addFilm = async (ctx:Context) =>{
    const body = await ctx.request.body.json();
    const {title, date, posterURL, description} = body;
    if(!title || !date || !posterURL || !description){
        ctx.response.status = 400;
        ctx.response.body = {message : "Tout les champs sont obligatoires"};
        console.log("Tout les champs sont obligatoires");
        return;
    }
    const film = db.prepare(`SELECT * FROM film WHERE title = ?`).get(title) as {title: string} | undefined;

    if(film){
        ctx.response.status = 409;
        ctx.response.body = {message: "Film deja existant"};
        console.log("Film deja existant");
        return;
    }

    db.prepare(`INSERT INTO film (title, date, posterURL, description) VALUES (?, ?, ?, ?)`).run(title, date, posterURL, description);
    ctx.response.status = 201;
    ctx.response.body = {message: "Film ajouter avec succes"};
    console.log("Film ajouter avec succes");

    //PARTIE WEBSOCKET MIS A JOUR AUTOMATIQUE DE LA BIBLOTHEQUE 
    // // Emit the new film to all connected WebSocket clients
    // for (const connection of connections) {
    //     if (connection.readyState === WebSocket.OPEN) {
    //         connection.send(JSON.stringify({ action: "addFilm", film: { title, date, posterURL, description } }));
    //     }
    // }
    // console.log("Film emitted to WebSocket clients");

}

//recuperer un film (j'ai enlever async sans test)
export const getFilm = (ctx:Context)=>{
    // const body = await ctx.request.body.json(); car la fonction c'est un get et pas un post
    // const {id} = body;
    const id = ctx.params.id;//recupere le parametre du url
    if(!id){
        ctx.response.status = 400;
        ctx.response.body = { message: "ID manquant dans l'URL" };
        return;
    }

    const film = db.prepare(`SELECT * FROM film WHERE id = ?`).get(id) as {id: number} | undefined;
    if(!film){
        ctx.response.status = 404;
        ctx.response.body = {message: "Le film n'existe pas dans la base de donnée"};
        console.log("Le film n'existe pas dans la base de donnée");
        return;
    }
   ctx.response.status = 200;
   ctx.response.body = {message:"Film trouvé", film};
}

export const updateFilm = async (ctx:Context)=>{
    const body = await ctx.request.body.json();
    const {title, date, posterURL, description} = body;
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

    db.prepare(`DELETE FROM films WHERE id = ?`).run(id);
    ctx.response.status = 200;
    ctx.response.body = {message: "Suprimer avec succe"};
    console.log("film supprimer");
}