import { db } from "../database/data.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";


//fonction pour recuperer tout les films
export const getAllFilms = async (ctx: Context) => {
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
export const addFilm = async (ctx) =>{
    const tokenData = ctx.state.tokenData;
    if(!tokenData){
        ctx.response.status = 401;
        ctx.response.body = {message:"Token non valide, utilisateur non connecter"};
        console.log("probleme token");
        return;
    }
    const userRole = tokenData.role;
    if(userRole !== "admin"){
        ctx.response.status = 403;
        ctx.response.body = {message : "Acces interdit, vous n'etes pas admin"};
        console.log("Acces interdit");
        return;
    }
    const body = await ctx.request.body.json();
    const {titel, date, posterURL, description} = body;
    if(!titel || !date || !posterURL || !description){
        ctx.response.status = 400;
        ctx.response.body = {message : "Tout les champs sont obligatoires"};
        console.log("Tout les champs sont obligatoires");
        return;
    }
    const film = db.prepare(`SELECT * FROM film WHERE titel = ?`).get(titel) as {titel: string} | undefined;

    if(film){
        ctx.response.status = 409;
        ctx.response.body = {message: "Film deja existant"};
        console.log("Film deja existant");
        return;
    }

    db.prepare(`INSERT INTO film (titel, date, posterURL, description) VALUES (?, ?, ?, ?)`).run(titel, date, posterURL, description);
    ctx.response.status = 201;
    ctx.response.body = {message: "Film ajouter avec succes"};
    console.log("Film ajouter avec succes");

    //PARTIE WEBSOCKET MIS A JOUR AUTOMATIQUE DE LA BIBLOTHEQUE 
    // // Emit the new film to all connected WebSocket clients
    // for (const connection of connections) {
    //     if (connection.readyState === WebSocket.OPEN) {
    //         connection.send(JSON.stringify({ action: "addFilm", film: { titel, date, posterURL, description } }));
    //     }
    // }
    // console.log("Film emitted to WebSocket clients");

}