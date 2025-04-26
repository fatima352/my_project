import { db } from "../database/data.ts";
import * as mw from "../middlewares.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { create, verify } from "https://deno.land/x/djwt/mod.ts";


//fonction pour hasher les mots de passe
const get_hash = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    return hash;
}

//fonction pour s'inscrire
export const register = async(ctx:Context)=>{
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
export const login = async(ctx:Context)=>{
    const body = await ctx.request.body.json();
    const { username, password } = body;
    // const { response } = ctx; 

    if(!username || !password){
        ctx.response.status = 400;
        ctx.response.body = {message : "Tous les champs sont obligatoires"};
        return;
    }

    // Récupère le mdp et le role de l'utilisateur dans la base de données (sous forme de table)
    const user = db.prepare(`SELECT password_hash, role FROM users WHERE username = ?`).get(username) as { password_hash: string, role: string} | undefined;

    // Vérifie si l'utilisateur existe
    if (!user) {
        ctx.response.status = 401;
        ctx.response.body = { message: "Utilisateur inexistant"};
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
    const role = user?.role;
    //utilisation de l'username et du role pour créer le token ou pas ?
    // const token = await create({alg: "HS512", typ: "JWT"}, {username, role}, secretKey );
    const token = await create({alg: "HS512", typ: "JWT"}, {username,role}, mw.secretKey );
    mw.tokens[username] = token; //stocké le token de l'utilisateur

    // ctx.response.headers.set("Set-Cookie", `auth_token; HttpOnly; SameSite=Strict; Max-Age=3600`); ?????
    ctx.response.headers.set("Set-Cookie", `auth_token=${token}; HttpOnly; SameSite=Strict; Max-Age=3600`);

    ctx.response.status = 200;
    ctx.response.body = {message: "Connexion réussie"};//ajout du token dans le body ???
}

export const logout = async (ctx:Context) => {
    const cookies = ctx.cookies;
  
    if (!cookies || typeof cookies.get !== "function") {
      ctx.response.status = 500;
      ctx.response.body = { message: "Erreur serveur : cookies non disponibles" };
      return;
    }
  
    const token = await cookies.get("auth_token");
  
    if (!token) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Déconnexion impossible : aucun token" };
      return;
    }
  
    await cookies.delete("auth_token");
  
    ctx.response.status = 200;
    ctx.response.body = { message: "Déconnexion réussie" };
};


