import { db } from "../database/data.ts";
import * as mw from "../middlewares.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { create, verify } from "https://deno.land/x/djwt/mod.ts";

// Fonction pour hasher les mots de passes
const get_hash = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    return hash;
}

// Fonction pour effacer les token 
// But: évite qu'un user aie plusieurs sessions
function removeTokenByUser(user: string) {
    for (const token in   mw.tokens) {
      if ( mw.tokens[token] === user) {
        delete   mw.tokens[token];
        break;
      }
    }
}

// Fonction pour s'inscrire
export const register = async(ctx:Context)=>{

    try{
        const body = await ctx.request.body.json();
        const { username, email, password } = body;
    
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
    }catch(error){
        ctx.response.status = 500;
        ctx.response.body = {message: "Erreur serveur", error: error.message};
        console.error("Erreur dans register :", error);
    }


}

// Fonction pour se connecter
export const login = async(ctx:Context)=>{
    try{
        const body = await ctx.request.body.json();
        const { username, password } = body;
      
    
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
        const token = await create({alg: "HS512", typ: "JWT"}, {username,role},  mw.secretKey );
    
        removeTokenByUser(username);//supprimer token si existant commme ca un seule session par utilisateur
    
        mw.tokens[username] = token; //stocké le token de l'utilisateur
    
        ctx.response.headers.set("Set-Cookie", `auth_token=${token}; HttpOnly; Secure;SameSite=Strict; Max-Age=3600`);//enelever secure
    
        ctx.response.status = 200;
        ctx.response.body = {message: "Connexion réussie"};
    }catch(error){
        ctx.response.status = 500;
        ctx.response.body = {message: "Erreur serveur", error: error.message};
        console.error("Erreur dans login :", error);
    }
    
}

// Fonction pour se deconnecter
export const logout = async (ctx:Context) => {
    try{
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
    }catch(error){
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur serveur", error: error.message };
        console.error("Erreur dans logout :", error);
    }
};

export const changePassword = async (ctx: Context) => {
    try {
        const body = await ctx.request.body.json();
        const { currentPassword, newPassword, confirmNewPassword } = body;
        const tokenData = ctx.state.tokenData;
        if (!tokenData) {
            ctx.response.status = 401;
            ctx.response.body = { message: "Token non valide, utilisateur non connecté" };
            return;
        }
        
        const username = tokenData.username;
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Tous les champs sont obligatoires" };
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Les nouveaux mots de passe ne correspondent pas" };
            return;
        }
        
        const user = db.prepare(`SELECT password_hash FROM users WHERE username = ?`).get(username) as { password_hash: string } | undefined;
        if (!user) {
            ctx.response.status = 404;
            ctx.response.body = { message: "Utilisateur introuvable" };
            return;
        }
        
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        
        if (!isCurrentPasswordValid) {
            ctx.response.status = 401;
            ctx.response.body = { message: "Mot de passe actuel incorrect" };
            return;
        }
        
        const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
        if (isSamePassword) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Le nouveau mot de passe doit être différent de l'ancien" };
            return;
        }
        
        // Hasher le nouveau mot de passe
        const newPasswordHash = await get_hash(newPassword);
        
        // Mettre à jour le mot de passe dans la base de données
        const result = db.prepare(`UPDATE users SET password_hash = ? WHERE username = ?`).run(newPasswordHash, username);
        
        if (result.changes > 0) {
            ctx.response.status = 200;
            ctx.response.body = { message: "Mot de passe modifié avec succès" };
            console.log(`Mot de passe modifié pour l'utilisateur: ${username}`);
        } else {
            ctx.response.status = 500;
            ctx.response.body = { message: "Erreur lors de la mise à jour du mot de passe" };
        }
        
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur serveur", error: error.message };
        console.error("Erreur dans changePassword :", error);
    }
};