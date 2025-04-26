import * as userCtrl from "./controllers/contrUser.ts";
import * as authCtrl from "./controllers/contrAuth.ts";//controllers pour l'authentification
import * as filmCtrl from "./controllers/controFilm.ts";//controllers pour les films
import * as mw from "./middlewares.ts";
import {Router, Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";

export const router = new Router();

const connections: WebSocket[] = [];  //stock les requetes 
// router.get("/", mw.authMw, (ctx) => userCtrl.WebSocket(ctx, connections));// router.get("/register", cont.showRegister);//pour recupere la page register



//Route pour authentification
router.post("/register", authCtrl.register); //route pour l'inscription
router.post("/login", authCtrl.login); //route pour la connection
router.post('/logout', authCtrl.logout);//route pour se deconnecter


//Route utilisateur
router.get('/api/user', mw.authMw, userCtrl.getUser);//route apres s'avoir loguer proteger par un middleware


//Route pour les film
router.get('/api/films', filmCtrl.getAllFilms); //route pour recuperer tout les films
// router.post('/api/films',mw.authMw,mw.adminMw, userCtrl.addFilm); //route pour ajouter un film a la db unqiuement accesible par l'admin
// router.post("/upload", userCtrl.uploadImage);
router.post('/api/films',mw.authMw, mw.adminMw, filmCtrl.addFilm); //route pour ajouter un film a la db uniquement accesible par l'admin
router.get('/api/films/:id',filmCtrl.getFilm) //route pour voir tous les films


//Route pour les listes
router.post('/api/liste',mw.authMw, userCtrl.createList); //route pour creer une liste
