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
router.get('/', mw.authMw, userCtrl.getUser);//route quand l'utilisateur est connecter



//Route utilisateur
router.get('/api/user', mw.authMw, userCtrl.getUser);//route apres s'avoir loguer proteger par un middleware
router.get("/api/admin-access", mw.authMw, mw.adminMw);//checke l'admin
router.post('/api/films/:id/reviews', userCtrl.commentFilm);//ajouter un commentaire au film (A TESTER)
router.post('/api/collection', mw.authMw, userCtrl.addFilmCollection);//route pour ajouter un film à la collection


//Route pour les film
router.get('/api/films',filmCtrl.getAllFilms); //route pour recuperer tout les films
router.post('/api/films',mw.authMw, mw.adminMw, filmCtrl.addFilm); //route pour ajouter un film a la db uniquement accesible par l'admin
router.get('/api/films/:id',filmCtrl.getFilm); //route pour voir tous les films
router.put('/api/films/:id',filmCtrl.updateFilm);//route pour mettre a jour le donnée du film(ici j'ai enlever mw.adminMw)
router.delete('/api/films/:id',mw.authMw, mw.adminMw,filmCtrl.deleteFilm);// Route DELETE pour supprimer un film par ID


//Route pour les listes
router.post('/api/liste',mw.authMw, userCtrl.createList); //route pour creer une liste




