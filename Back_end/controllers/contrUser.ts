import { db } from "../database/data.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";

//fonction pour récupérer les information d'un utilisateur
export const getUser = async(ctx:Context)=>{    
    const tokenData = ctx.state.tokenData; //recupere le token du middleware
    if(!tokenData){
        ctx.response.status =401;
        ctx.response.body = {message: "Token non valide, utilisateur non connecter"};
        console.log("probleme token");
        return;
    }
    ctx.response.body = {message : "token recuperer", username: tokenData.username, role:tokenData.role};
}

//Fonction pour ajouter un film à la collection
export const addFilmCollection = async (ctx)=>{

    const tokenData = ctx.state.tokenData;
    const username = tokenData.username;
    const userId = db.prepare(`SELECT id FROM users WHERE username = ?`).get(username) as {id:number}|undefined;

    if(!userId){
        ctx.response.status = 401;
        ctx.response.body = {message:"Utilisateur introuvable"};
        console.log("Utilisateur introuvable");
        return;
    }

    //recupére le titre envoyer par l'utilisateur
    const body = await ctx.request.body.json();
    const {filmTitle} = body;

    const film = db.prepare(`SELECT id FROM film WHERE title LIKE ?`).get(filmTitle) as {id: number};
    if(!film){
        ctx.response.status = 401;
        ctx.response.body = {message: "Film indiponible dans la base de donées"};
        console.log("Film indiponible dans la base de donées");
        return;
    }
    
    const dejaAjouter = db.prepare(`SELECT * FROM library WHERE filmId = ? AND userId = ?`).get(film.id,userId.id);
    if(dejaAjouter){
        ctx.response.status = 404;
        ctx.response.body = {message:"Film déjà ajouté"};
        console.log("Film déjà ajouté");
        return;
    }
    

    db.prepare(`INSERT INTO library (userId, filmId) VALUES (?,?)`).run(userId.id, film.id);
    ctx.response.status = 200;
    ctx.response.body = {message : "Ajout du film dans la collection réussi"};
    console.log("Ajout du film dans la collection réussi");
}

// fonction pour récupérer les listes de l'utilisateur
export const getUserLists = (ctx)=>{
    const tokenData = ctx.state.tokenData;
    if(!tokenData){
        ctx.response.status =401;
        ctx.response.body = {message: "Token non valide, utilisateur non connecter"};
        console.log("probleme token");
        return;
    }
    const username = tokenData.username;

    const userId = db.prepare(`SELECT id FROM users WHERE username = ?`).get(username) as {id:number}|undefined;
    if(!userId){
        ctx.response.status = 401;
        ctx.response.body = {message : "Utilisateur introuvable"};
        console.log("Utilisateur introuvable");
        return;
    }

    const userList = db.prepare(`SELECT * FROM liste WHERE userId = ?`).all(userId.id);
    if(userList.length > 0){
        ctx.response.status = 200;
        ctx.response.body = {message : "Récupération des liste réussite", userList};
        console.log("recuperation des liste reussite"); 
        return;
    }
    ctx.response.status = 404;
    ctx.response.body = {message : "Aucune liste créer"};
    console.log("Aucune liste");
}

// Fonction pour récupérer la collection de film d'un utilisateur
export const getUserCollection = (ctx)=>{
    const tokenData = ctx.state.tokenData;
    if(!tokenData){
        ctx.response.status =401;
        ctx.response.body = {message: "Token non valide, utilisateur non connecter"};
        console.log("probleme token");
        return;
    }
    const username = tokenData.username;

    const userId = db.prepare(`SELECT id FROM users WHERE username = ?`).get(username) as {id:number}|undefined;
    if(!userId){
        ctx.response.status = 401;
        ctx.response.body = {message : "Utilisateur introuvable"};
        console.log("Utilisateur introuvable");
        return;
    }
    const userCollection = db.prepare(`SELECT * FROM library, film WHERE userId = ? AND library.filmId = film.id`).all(userId.id);
    // if(userCollection.length <= 0){
    //     ctx.response.status = 404;
    //     ctx.response.body = {message : "Aucun film dans la collection"};
    //     console.log("Aucun film dans la collection");
    //     return;
    // }
    ctx.response.status = 200;
    ctx.response.body = {message : "Récupération de la collection réussite", userCollection};
    console.log("recuperation de la collection reussite");
}

//Fonction pour supprimer un film de la collection
export const deleteFilmCollection = async (ctx)=>{
    console.log("entrer dans controllers");
    //recupere id utilisateur
    const tokenData = ctx.state.tokenData;

    const body = await ctx.request.body.json();
    const {filmId} = body;

    const userId = db.prepare(`SELECT id FROM users WHERE username = ?`).get(tokenData.username) as {id: number}|undefined;
    if(!userId){
        ctx.response.status = 401;
        ctx.response.body = {message:"Utilisateur introuvable"};
        console.log("Utilisateur introuvable");
        return;
    }

    console.log("user bien récupéré");
    db.prepare(`DELETE FROM library WHERE userId = ? AND filmId = ?`).run(userId.id,filmId);
    ctx.response.status = 200;
    ctx.response.body = {message: "Film supprimé avec succès"};
    console.log("Film supprimé avec succès");
}

//permettre a l'utilisateur de commenter

//recuperere les commentaires d'un film


//ajouter un film a la collection
//ajouter directement a partir de la page description film ou apartir de la page profil qui renvoie vers page recherche film avoir  


