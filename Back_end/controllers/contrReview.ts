import { db } from "../database/data.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";


//Fonction pour commenter un film
export const commentFilm = async (ctx)=>{
    try {
        const body = await ctx.request.body.json();
        const {contenu,date,rating} = body;
        const intRating = parseInt(rating);
        const tokenData = ctx.state.tokenData;
        if(!tokenData){
            ctx.response.status = 401;
            ctx.response.body = {message: "Token non valide, utilisateur non connecter"};
            console.log("probleme token");
            return;
        }

        const user = db.prepare(`SELECT id FROM users WHERE username = ?`).get(tokenData.username) as {id: number} | undefined;
        if(!user){
            ctx.response.status = 401;
            ctx.response.body = {message: "Utilisateur introuvable"};
            console.log("utilisateur introuvable");
            return;
        }

        const idfilm = parseInt(ctx.params.id);
        if(!idfilm){
            ctx.response.status = 400;
            ctx.response.body = { message: "ID manquant dans l'URL" };
            return;
        }

        db.prepare(`INSERT INTO reviewsFilm (userId, filmId, contenu, date, rating) VALUES (?,?,?,?,?)`).run(user.id, idfilm, contenu, date, intRating);
        ctx.response.status = 201;
        ctx.response.body = {message: "Commentaire ajouter avec succes"};
        console.log("Commentaire ajouter avec succes");

    }catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur serveur", error: error.message };
        console.error("Erreur dans commentFilm :", error);
    }
    
    
}

//Fonction pour commenter une liste

export const getFilmReview = (ctx)=>{
    try{
        const idfilm = parseInt(ctx.params.id);
        if(!idfilm){
            ctx.response.status = 400;
            ctx.response.body = { message: "ID manquant dans l'URL" };
            return;
        }
        const reviews = db.prepare(`SELECT * FROM reviewsfilm WHERE filmId = ?`).all(idfilm);

    }

}