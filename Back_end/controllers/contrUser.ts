import { db } from "../database/data.ts";
import * as mw from "../middlewares.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { create, verify } from "https://deno.land/x/djwt/mod.ts";


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
export const getUser = async(ctx)=>{    
    const tokenData = ctx.state.tokenData; //recupere le token du middleware
    if(!tokenData){
        ctx.response.status =401;
        ctx.response.body = {message: "Token non valide, utilisateur non connecter"};
        console.log("probleme token");
        return;
    }
    ctx.response.body = {message : "token recuperer", username: tokenData.username, role:tokenData.role};
}

//fonction pour recuperer tout les films
export const getAllFilms = async (ctx: Context) => {
    try {
        const films = db.prepare(`SELECT * FROM films`).all(); // Fetch all films from the "film" table
        ctx.response.status = 200;
        ctx.response.body = { films }; // Return the films as JSON
        console.log("Films fetched successfully:", films);
    } catch (error) {
        console.error("Error fetching films:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur lors de la récupération des films" };
    }
};

//fonction pour ajouter un film
export const addFilm = async(ctx)=>{
    const body = await ctx.request.body.json();
    const {titel,poster_url,description} = body;
    const {response}= ctx;

    if(!titel || !poster_url || !description){
        ctx.response.status = 400;
        ctx.response.body = {message : "Tout les champs sont obligatoires"};
        console.log("tout les champs sont obligatoires");
        return;
    }
    const film = db.prepare(`SELECT * FROM films WHERE titel = ?`).get(titel);
    if(film){
        ctx.response.status = 400;
        ctx.response.body = {message : "Film deja existe dans la bibliotheque"};
        console.log("Film deja existe dans la bibliotheque");
        return;
    }
    db.prepare(`INSERT INTO films (titel, poster_url, description) VALUES (?,?,?)`).all(titel, poster_url, description);
    ctx.response.status = 200;
    ctx.response.body = {message: "Film ajouter avec succes", film: {titel, poster_url, description}};
    console.log("Film ajouter avec succes");
}






//fonction pour recuperer les film regarder par un utilisateur

//fonction pour recuperere les comantaire d'un meme film

//fonction pour chercher un films dans la bibliotheque

//fonction pour recevoir des notification lors des like d'un comentaire

//route qd je suis connecter portection avec le midelwere
    //-> dans cette page on peut acceder au a nous liste 
    //-> on peut cree des listes 
    //-> on peut acceder a notre collection
    //-> on peut liker des commentaire
    //-> on peut s'abonner au gens
    //-> on peut parler avec les gens
    //-> on peut acceder au liste des personnes


// Gestion du profil utilisateur : Permettre aux utilisateurs de modifier leur profil (nom, photo, description, etc.).
// Suivi des amis : Permettre aux utilisateurs de suivre d'autres utilisateurs
// Gestion des préférences de confidentialité : Choisir si les films vus, ou listes sont publiques ou privées.

// Base de données des films : Créer une table ou un modèle pour stocker les informations des films (titre, réalisateur, acteurs, genre, année de sortie, résumé, etc.).
// Recherche et filtrage des films : Implémenter une fonctionnalité de recherche pour permettre aux utilisateurs de trouver des films par nom, genre, acteur, année, etc.
// /!\ {Ajout manuel ou automatisé : Permettre l'ajout manuel des films ou l'intégration avec des API externes (comme IMDB, TMDB, ou OMDB) pour enrichir automatiquement les films dans la base de données.}

// Système de notation : Permettre aux utilisateurs de noter les films sur une échelle de 1 à 5 (avec des demi-étoiles).
// Commentaires sur les films : Permettre aux utilisateurs de rédiger des critiques et de les associer à des films spécifiques.
// Historique des critiques : Stocker un historique des films notés et commentés par chaque utilisateur.(prive pas aucces les autres)

// Création de listes personnalisées : Permettre aux utilisateurs de créer des listes de films (ex. "À voir", "Mes films préférés", "Films par genre").
// Ajout de films à une liste : Permettre l'ajout de films aux listes et l'édition de celles-ci.
// Partage de listes : Permettre aux utilisateurs de rendre leurs listes publiques ou privées et de les partager avec d'autres membres.


// Notifications : Implémenter un système de notifications pour informer un utilisateur des nouvelles critiques, des nouveaux films ajoutés à ses listes, ou des interactions avec ses publications (commentaires, likes, etc.).
// Suivi des activités des utilisateurs : Permettre aux utilisateurs de voir l'activité de leurs amis (quels films ils ont vus, commenté ou ajouté à une liste).
// Commentaires sur les critiques : Permettre aux utilisateurs de commenter les critiques d'autres utilisateurs, ajoutant une dimension sociale à la plateforme.

// Gestion des catégories et genres : Implémenter un système de gestion des genres de films (action, comédie, drame, etc.) et permettre aux utilisateurs de filtrer les films par genre.
// Gestion des listes de lecture de films : Créer une fonctionnalité permettant de gérer des listes de films (par exemple, les films vus, les films à voir, les films favoris).

