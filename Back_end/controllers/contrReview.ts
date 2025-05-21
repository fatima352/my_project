import { db } from "../database/data.ts";
import { notifyNewReviewFilm } from "../websocket.ts";
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
        const dateNow = new Date();
        const date = dateNow.toLocaleDateString('fr-FR');


        db.prepare(`INSERT INTO reviewsFilm (userId, filmId, contenu, date, rating) VALUES (?,?,?,?,?)`).run(user.id, idfilm, contenu, date, intRating);
        const reviewData = { userId: user.id, filmId: idfilm, contenu, date, rating: intRating };
        notifyNewReviewFilm(reviewData);
        
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

export const commentList = async (ctx) => {
    try {
        const body = await ctx.request.body.json();
        const {contenu, rating} = body
        const tokenData = ctx.state.tokenData;
        
        if(!tokenData) {
            ctx.response.status = 401;
            ctx.response.body = {message: "Token non valide, utilisateur non connecté"};
            return;
        }

        const user = db.prepare(`SELECT id FROM users WHERE username = ?`).get(tokenData.username) as {id: number} | undefined;
        if(!user) {
            ctx.response.status = 404;
            ctx.response.body = {message: "Utilisateur introuvable"};
            return;
        }

        const idList = parseInt(ctx.params.id);
        console.log(idList);
        console.log(user.id);
        const listeExists = db.prepare(`SELECT id FROM liste WHERE id = ?`).get(idList);
        if(!listeExists) {
            ctx.response.status = 404;
            ctx.response.body = {message: "Liste introuvable"};
            return;
        }

        const dateNow = new Date();
        const date = dateNow.toLocaleDateString('fr-FR');

        db.prepare(`
            INSERT INTO commentList (userId, listeId, contenu, date) VALUES (?, ?, ?, ?)`).run(user.id, idList, contenu, date);

        ctx.response.status = 201;
        ctx.response.body = {message: "Commentaire ajouté avec succès"};

    } catch (error) {
        console.error("Erreur détaillée:", error);
        ctx.response.status = 500;
        ctx.response.body = { 
            message: "Erreur serveur",
            details: error.message 
        };
    }
}

//Fonction pour récupérer les commentaires d'une liste
export const getListReview = (ctx)=>{
    try{
        console.log("strat get list review");
        //récupérer id de la liste
        const idList = parseInt(ctx.params.id);
        console.log("idList",idList);
        if(!idList){
            ctx.response.status = 400;
            ctx.response.body = { message: "ID manquant dans l'URL" };
            return;
        }
        // recupere l'username de l'utilisateur de chaque commentaire 
        const reviews = db.prepare(`SELECT commentList.contenu, commentList.date, users.username 
            FROM commentList
            JOIN users ON commentList.userId = users.id 
            WHERE listeId = ?`).all(idList);
        // retourner l'username la date et le contenu du commentaire 
        ctx.response.status = 200;
        ctx.response.body = {message:"Récupération des commentaires réussi :", reviews};
        console.log("Récupération des commentaires réussi");
    }catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur serveur", error: error.message };
        console.error("Erreur dans getListReview :", error);
    }

}