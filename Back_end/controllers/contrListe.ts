import { db } from "../database/data.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";


// Fonction pour que l'user créer un liste ou stocker des films
export const createList = async (ctx:Context)=>{
    try{
        const tokenData = ctx.state.tokenData;
        if(!tokenData){
            ctx.response.status = 401;
            ctx.response.body = {message: "Token non valide, utilisateur non connecter"};
            console.log("probleme token");
            return;
        }
    
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
    }catch(error){
        ctx.response.status = 500;
        ctx.response.body = {message: "Erreur serveur", error: error.message};
        console.error("Erreur dans createList :", error);
    }

}

//Fonction pour ajouter un film a une liste (seulement le propriétaire de la liste a l'accés)
export const addFilmToListe = async (ctx) => {
    try{
        console.log("strat add film list");
        const tokenData = ctx.state.tokenData;
    
        if (!tokenData) {
            ctx.response.status = 401;
            ctx.response.body = { message: "Token non valide, utilisateur non connecté" };
            console.log("Token invalide");
            return;
        }
    
        const body = await ctx.request.body.json();
        const {filmTitle} =  body;
        if(!filmTitle){
            ctx.response.status = 400;
            ctx.response.body = {message: "Entrer le titre du film"};
            console.log("Entrez le titre su film");
            return;
        }
        //chercher film dans la base de donnée et recupere son id
        const filmId = db.prepare(`SELECT id FROM film WHERE title LIKE ?`).get(filmTitle) as {id:number}|undefined;
            //si pas la erreur film introuvable 
        if(!filmId){
            ctx.response.status = 400;
            ctx.response.body = {message:"Film indisponible dans la base de données"};
            console.log("film indisponnible dans la base de donées");
            return;
        }
        //recuperer id liste du URL
        // const liste = ;
        const listeId = parseInt(ctx.params.id);
        if(!listeId){
            ctx.response.status = 401;
            ctx.response.body = {message:"Erreur lors de la récupération de l'id liste dans l'URL"};
            console.log("Erreur lors de la récupération de l'id liste dans l'URL");
            return;
        }
        //ajoute dans la table association Film-Liste
        db.prepare(`INSERT INTO listeFilm (listeId, filmId) VALUES (?,?)`).run(listeId, filmId.id);
        ctx.response.status = 201;
        ctx.response.body = {message:"Film ajouté avec succès dans la liste"};
        console.log("Film ajouté avec succès dans la liste");
    }
    catch(error){
        console.error("Erreur lors de l'ajout du film à la liste:", error);
        ctx.response.status = 500;
        ctx.response.body = {message:"Erreur interne du serveur"};
    }

}

// Fonction pour récupérer les films d'une liste (à refaire)
export const getList = (ctx) => {
    try{
        const listeId = parseInt(ctx.params.id);

        const nameList = db.prepare(`
        SELECT l.name, l.userId, u.username 
        FROM liste l
        JOIN users u ON l.userId = u.id
        WHERE l.id = ?
        `).get(listeId) as {name: string, user_id: number, username: string} | undefined;      

        if(!nameList){
            ctx.response.status = 400;
            ctx.response.body = { message: "Liste introuvable" };
            console.log("Liste introuvable");
            return;
        }
        
        if (!listeId) {
            ctx.response.status = 400;
            ctx.response.body = { message: "ID manquant dans l'URL" };
            return;
        }
    
        //récupére les ids des films de cette liste
        const filmsListe = db.prepare(`SELECT * FROM listeFilm, film WHERE listeId = ? AND listeFilm.filmID = film.id`).all(listeId) as {id: number}[];
        if(filmsListe.length<=0){
            ctx.response.status = 400;
            ctx.response.body = {message: "Liste vide"};
            console.log("Liste vide");
        }
    
        ctx.response.status = 200;
        ctx.response.body = {message: "Récupération des films de la liste réussi", filmsListe, nameList};
        console.log("Récupération des film de la liste réussi");
    
    }
    catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur serveur", error: error.message };
        console.error("Erreur dans getList :", error);
    }

}

export const deleteList = async (ctx) =>{
    try{
            // recupere l'id de la liste 
    const body =  await ctx.request.body.json();
    const {listId} = body;
    if(!listId){
        ctx.response.status = 400;
        ctx.response.body = {message: "Erreur lors de la récupération de l'id liste dans le body"};
        console.log("Erreur lors de la récupération de l'id liste dans le body");
        return;
    }
    // je le supprime de la db
    const deleteList = db.prepare(`DELETE FROM liste WHERE id = ?`).run(listId);
    if(!deleteList){
        ctx.response.status = 400;
        ctx.response.body = {message: "Erreur lors de la suppression de la liste"};
        console.log("Erreur lors de la suppression de la liste");
        return;
    }
    ctx.response.status = 200;
    ctx.response.body = {message: "Liste supprimée avec succès"};
    console.log("Liste supprimée avec succès");
    }
    catch(error){
        ctx.response.status = 500;
        ctx.response.body = {message: "Erreur serveur", error: error.message};
        console.error("Erreur dans deleteList :", error);
    }

}

export const getAllListe = (ctx) => {
    try{
        const listes = db.prepare(`SELECT * FROM liste`).all();
        if(listes.length <= 0){
            ctx.response.status = 400;
            ctx.response.body = {message: "Aucune liste trouvée"};
            console.log("Aucune liste trouvée");
            return;
        }
        ctx.response.status = 200;
        ctx.response.body = {message: "Récupération des listes réussie", listes};
        console.log("Récupération des listes réussie");
    }
    catch(error){
        ctx.response.status = 500;
        ctx.response.body = {message: "Erreur serveur", error: error.message};
        console.error("Erreur dans getAllListe :", error);
    }
}

// Dans controllers/contrListe.ts
export const getListeOwner = (ctx: Context) => {
    const listeId = parseInt(ctx.params.id); //recuperer id liste
    const tokenData = ctx.state.tokenData; //recupere utilisateur connecter
        if(!tokenData){
            ctx.response.status = 401;
            ctx.response.body = {message: "Token non valide, utilisateur non connecter"};
            console.log("problème token");

        }
    if (!listeId) {
        ctx.response.status = 400;
        ctx.response.body = { message: "ID de la liste invalide" };
        return;
    }

    const owner = db.prepare("SELECT users.username FROM liste JOIN users ON liste.userId = users.id WHERE liste.id = ?").get(listeId) as { username: string } | undefined;
    
    if (!owner) {
        ctx.response.status = 404;
        ctx.response.body = { message: "Liste introuvable" };
        return;
    }
    

    if(owner.username==tokenData.username){
        ctx.response.status = 200;
        ctx.response.body = { ownerUsername: owner.username };
        return;
    }
};


