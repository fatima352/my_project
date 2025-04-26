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

//creer une liste de film
export const createList = async (ctx)=>{
    const tokenData = ctx.state.tokenData;
    if(!tokenData){
        ctx.response.status = 401;
        ctx.response.body = {message: "Token non valide, utilisateur non connecter"};
        console.log("probleme token");
        return;
    }
    const body =await ctx.request.body.json();
    const {listName} = body;
    const username = tokenData.username;
    const user = db.prepare(`SELECT id FROM users WHERE username = ?`).get(username) as {id: number} | undefined;

    if(!user){
        ctx.response.status = 401;
        ctx.response.body = {message: "Utilisateur inexistant"};
        return;
    }
    const userId = user?.id;
    db.prepare(`INSERT INTO liste (name, userId) VALUES (?,?)`).run(listName, userId);
    ctx.response.status = 200;
    ctx.response.body = {message: "Liste crée avec succée"};
    console.log("Liste crée avec succée");
}

//fonction pour ajouter un film

//fonction pour recuperere les commentaire d'un meme film

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


//------------------------------------------------

// const uploadDir = "./Back_end/uploads";
// await ensureDir(uploadDir);

// export const uploadImage = async (ctx: Context) => {
//     const body = await ctx.request.body({ type: "form-data" });
//     const formData = await body.value;
    
//     for await (const [key, value] of formData.entries()) {
//       if (value instanceof File) {
//         const content = await value.arrayBuffer();
//         const uint8Array = new Uint8Array(content);
    
//         const uploadDir = "./images"; // mets ton bon chemin ici
//         const destPath = path.join(uploadDir, value.name);
//         await Deno.writeFile(destPath, uint8Array);
    
//         ctx.response.status = 200;
//         ctx.response.body = { message: "Image uploadée", fileName: value.name };
//         console.log("image chargée avec succès :", value.name);
//         return;
//       }
//     }
    
//     ctx.response.status = 400;
//     ctx.response.body = { message: "Aucun fichier reçu" };
//     console.log("0 fichier reçu");
    
// };