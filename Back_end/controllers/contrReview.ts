import { db } from "../database/data.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";


//Fonction pour commenter un film
export const commentFilm = async (ctx)=>{
    const body = await ctx.request.body.json();
    const {contenu,date,rating} = body;
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

    const idfilm = ctx.params.id;
    if(!idfilm){
        ctx.response.status = 400;
        ctx.response.body = { message: "ID manquant dans l'URL" };
        return;
    }

    db.prepare(`INSERT INTO reviews (userId, filmId, contenu, date, rating) VALUES (?,?,?,?,?)`).run(user.id, idfilm, contenu, date, rating);
    ctx.response.status = 201;
    ctx.response.body = {message: "Commentaire ajouter avec succes"};
    console.log("Commentaire ajouter avec succes");
}

//Fonction pour commenter une liste