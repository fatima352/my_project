import * as cont from "./controllers/contrUser.ts";
import * as authCtrl from "./controllers/contrAuth.ts";//controllers pour l'authentification
import * as mw from "./middlewares.ts";
import {Router, Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";

export const router = new Router();

const connections: WebSocket[] = [];  //stock les requetes 
router.get("/", mw.authMw, (ctx) => cont.WebSocket(ctx, connections));// router.get("/register", cont.showRegister);//pour recupere la page register



//Route pour authentification
router.post("/register", authCtrl.register); //route pour l'inscription
router.post("/login", authCtrl.login); //route pour la connection
router.post('/logout', authCtrl.logout);//route pour se deconnecter


//Route utilisateur
router.get('/api/user', mw.authMw, cont.getUser);//route apres s'avoir loguer proteger par un middleware


//Route pour les films
router.get('/api/films',mw.authMw, cont.getAllFilms); //route pour recuperer tout les films acces admin
router.post('/api/films',mw.authMw,mw.adminMw, cont.addFilm); //route pour ajouter un film a la db unqiuement accesible par l'admin