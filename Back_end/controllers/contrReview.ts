import { db } from "../database/data.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";


//Fonction pour commenter un film
export const commentFilm = async (ctx)=>{
    try {
        const body = await ctx.request.body.json();
        const {contenu,rating} = body;
        const intRating = parseInt(rating);
        const tokenData = ctx.state.tokenData;
        if(!tokenData){
            ctx.response.status = 401;
            ctx.response.body = {message: "Token non valide, utilisateur non connecté"};
            console.log("problème token");
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
        const dateNow = Date.now();

        db.prepare(`INSERT INTO reviewsFilm (userId, filmId, contenu, date, rating) VALUES (?,?,?,?,?)`).run(user.id, idfilm, contenu, dateNow, intRating);
        ctx.response.status = 201;
        ctx.response.body = {message: "Commentaire ajouté avec succès"};
        console.log("Commentaire ajouté avec succès");

    }catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur serveur", error: error.message };
        console.error("Erreur dans commentFilm :", error);
    }
    
    
}

//Fonction pour récupérer les commentaires d'un film
export const getFilmReview = (ctx)=>{
    try{
        console.log("strat get film review");
        //récupérer id du film
        const idfilm = parseInt(ctx.params.id);
        console.log("idfilm",idfilm);
        if(!idfilm){
            ctx.response.status = 400;
            ctx.response.body = { message: "ID manquant dans l'URL" };
            return;
        }
        // recupere l'username de l'utilisateur de chaque commentaire 
        const reviews = db.prepare(`SELECT reviewsfilm.contenu, reviewsfilm.date, reviewsfilm.rating, users.username 
            FROM reviewsfilm
            JOIN users ON reviewsfilm.userId = users.id 
            WHERE filmId = ?`).all(idfilm);
        // retourner l'username la date la note et le contenu du commentaire 
        ctx.response.status = 200;
        ctx.response.body = {message:"Récupération des commentaires réussi :", reviews};
        console.log("Récupération des commentaires réussi");
    }catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur serveur", error: error.message };
        console.error("Erreur dans commentFilm :", error);
    }

}