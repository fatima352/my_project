import { db } from "../database/data.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";

//WebSocket
export const WebSocket = async (ctx, connections: WebSocket[]) =>{
    if (!ctx.isUpgradable) {
        ctx.throw(501);
    }
    const ws = ctx.upgrade();

    connections.push(ws);
    console.log(`+ websocket connected (${connections.length})`);

    ws.onerror = (_error) => {
    const index = connections.indexOf(ws);
    if (index !== -1) {
        connections.splice(index, 1);
    }
    console.log(`- websocket error`);
    };

    ws.onmessage = (event) => {
    console.log(event.data);
    }
}
//fonction pour recupere les information de l'utilisateur
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
//commenter un film
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

//ajouter un film a la collection
//ajouter directement a partir de la page description film ou apartir de la page profil qui renvoie vers page recherche film avoir  
export const addFilmCollection = async (ctx)=>{
    const tokenData = ctx.state.tokenData;
    if(!tokenData){
        ctx.response.status = 401;
        ctx.response.body = {message: "Token non valide, utilisateur non connecter"};
        console.log("probleme token");
        return;
    }
    const body = await ctx.request.body.json();
    const {title} = body;
    const film = db.prepare(`SELECT id FROM film WHERE title = ?`).get(title) as {id:number} | undefined;
    if(!film){
        ctx.response.status = 404;
        ctx.response.body = {message: "Le film n'existe pas dans la base de donnée"};
        console.log("Le film n'existe pas dans la base de donnée");
        return;
    }

    const user = db.prepare(`SELECT id FROM users WHERE username = ?`).get(tokenData.username) as {id:number} | undefined;
    if(!user){
        ctx.response.status = 404;
        ctx.response.body = {message: "Le film n'existe pas dans la base de donnée"};
        console.log("Le user n'existe pas dans la base de donnée");
        return;
    }
    db.prepare(`INSERT INTO library (userId, filmId) VALUES (?,?)`).run(user.id, film.id);
    ctx.response.status = 200;
    ctx.response.body = {message: "Film ajouté à la collection avec succée"};
    console.log("Film ajouté à la collection avec succée");
}

//creer une liste de film
export const createList = async (ctx:Context)=>{
    const tokenData = ctx.state.tokenData;
    if(!tokenData){
        ctx.response.status = 401;
        ctx.response.body = {message: "Token non valide, utilisateur non connecter"};
        console.log("probleme token");
        return;
    }

    console.log("coucouuu");
    const body = await ctx.request.body.json();
    const {listName} = body;
    const username = tokenData.username;
    const user = db.prepare(`SELECT id FROM users WHERE username = ?`).get(username) as {id: number} | undefined;

    if(!user){
        ctx.response.status = 401;
        ctx.response.body = {message: "Utilisateur inexistant"};
        return;
    }
    db.prepare(`INSERT INTO liste (name, userId) VALUES (?,?)`).run(listName, user.id);
    ctx.response.status = 200;
    ctx.response.body = {message: "Liste crée avec succée"};
    console.log("Liste crée avec succée");
}
//ajouter un film a une liste
export const addFilmListe = async (ctx)=>{
    const body = await ctx.request.body.json();
    // const {titel} = ctx
}
//recuperer les liste de l'utilisateur
export const getUserList = async (ctx)=>{
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