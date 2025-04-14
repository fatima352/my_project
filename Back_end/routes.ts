import * as cont from "./controllers.ts";
import {Router, Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";

export const router = new Router();

const connections: WebSocket[] = [];  //stock les requetes 
router.get("/", cont.authorizationMiddleware, (ctx) => cont.WebSocket(ctx, connections));// router.get("/register", cont.showRegister);//pour recupere la page register
router.post("/register", cont.register); //route pour l'inscription
router.post("/login", cont.login); //route pour la connection
router.get('/profil', cont.authorizationMiddleware, cont.get_profil);//route pour le
