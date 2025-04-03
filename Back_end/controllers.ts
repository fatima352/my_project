import { db } from "./database/data.ts";

import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { create, verify } from "https://deno.land/x/djwt/mod.ts";


//fonction pour hasher les mots de passe
const get_hash = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    return hash;
}

//Clés secrete pour sécuriser les tokens JWT
const secretKey = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
);

//tableau pour stoker les tokens
const tokens: {[key: string]: string} = {};


//fonction pour s'inscrire
export const register = async(ctx)=>{
    // const {username, email, password} = await ctx.request.body.json().value;

    const body = await ctx.request.body.json();
    const { username, email, password } = body;
    // const { response } = ctx;

    if(!username || !email || !password){
        ctx.response.status = 400;
        ctx.response.body = {message :"Tous les champs sont obligatoires"}
        console.log("Champs obligatoires manquants")
        return;
    }
    if(db.prepare(`SELECT * FROM users WHERE username = ?`).all(username).length > 0){
        ctx.response.status = 400;
        ctx.response.body = {message :"Nom d'utilisateur déjà pris"}
        console.log("Nom d'utilisateur déjà pris")
        return;
    }

    const passeword_hash = await get_hash(password);
    const result = db.prepare(`INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`).run(username, email, passeword_hash);
    if(result.changes > 0){
        ctx.response.status = 201;
        ctx.response.body = {message :  "Utilisateur créé avec succès"}
        console.log("Création réussie")
    }
}

//fonction pour se connecter
export const login = async(ctx)=>{
    const body = await ctx.request.body.json();
    const { username, password } = body;
    const { response } = ctx;

    if(!username || !password){
        ctx.response.status = 400;
        ctx.response.body = {message : "Tous les champs sont obligatoires"};
        return;
    }

    // Récupère l'utilisateur dans la base de données
    const user = db.prepare(`SELECT password_hash FROM users WHERE username = ?`).get(username) as { password_hash: string } | undefined;

    // Vérifie si l'utilisateur existe
    if (!user) {
        response.status = 401;
        response.body = { message: "Utilisateur inexistant"};
        return;
    }

    // Récupère le hachage du mot de passe
    const user_password_hash = user?.password_hash;
    const result = await bcrypt.compare(password, user_password_hash);

    if(!result){
        ctx.response.status = 401;
        ctx.response.body = {message : "Mot de passe ou nom d'utilisateur invalide"};
        return;
    }

    const token = await create({alg: "HS512", typ: "JWT"},{username : username}, secretKey );
    tokens[username] = token; //stoke le token de l'utilisateur

    // ctx.response.headers.set("Set-Cookie", `auth_token=${token}; HttpOnly; SameSite=Strict; Max-Age=3600`);
    ctx.response.status = 200;
    ctx.response.body = {message: "Connexion réussie"}
}


//fonction pour recuperer les film regarder par un utilisateur

//fonction poir recuperere les comantaire d'un meme film

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

