import { db } from "./database/data.ts";
import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { create, verify } from "https://deno.land/x/djwt/mod.ts";

//Clés secrete pour sécuriser les tokens JWT
export const secretKey = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
);

//tableau pour stoker les tokens
export const tokens: {[key: string]: string} = {};

// Middleware to verify JWT token (partie 3)
export const authMw = async (ctx: Context, next: () => Promise<unknown>) => {
  const cookie = ctx.request.headers.get("cookie");
  const authToken = cookie?.split("; ").find(row => row.startsWith("auth_token="))?.split('=')[1];

  if (!authToken) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized: Missing token" };
    return;
  }

  try {
    // Verify the token
    const tokenData = await verify(authToken, secretKey);
    ctx.state.tokenData = tokenData; // Store data in ctx.state for use in other middlewares/routes

    await next();
  } catch {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized: Invalid token" };
  }
};


//Middelware pour proteger les routes de l'admin
export const adminMw = async(ctx : Context, next:() => Promise<unknown>)=>{
  const tokenData = ctx.state.tokenData; 
  if(!tokenData){
    ctx.response.status = 401;
    ctx.response.body = {message: "Token non valide, utilisatueur non connecter"};
    console.log("probleme token");
    return;
  }
  if(tokenData.role !== "admin"){
    ctx.response.status = 403;
    ctx.response.body = {message: "Acces interdit, vous n'etes pas admin"};
    console.log("Acces interdit");
    return;
  }
  await next();
  ctx.response.status = 200;
  ctx.response.body = {message: "Acces autoriser"};
  console.log("Acces autoriser");
}
