import {Router, Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";

import * as mw from "./middlewares.ts"; 
// import { WebSocket } from "https://deno.land/std/ws/mod.ts"; // Importation de WebSocket
import { handleWsConnection } from "./websocket.ts"; // Importation de la fonction pour gérer les connexions WebSocket

import * as userCtrl from "./controllers/contrUser.ts";//contreollers pour les fonctionnalité des utilisateurs
import * as authCtrl from "./controllers/contrAuth.ts";//controllers pour l'authentification
import * as filmCtrl from "./controllers/controFilm.ts";//controllers pour les fonctionnalité des films
import * as reviewCtr from "./controllers/contrReview.ts";//contreollers popur la gestion des commentaires
import * as ListCtr from "./controllers/contrListe.ts";
import * as uploadCtr from "./controllers/contrUpload.ts"
import * as HomeCtr from "./controllers/contrHome.ts";


export const router = new Router();

// Route popur les ws
// router.get("/ws", mw.authMw, (ctx) => userCtrl.WebSocket(ctx, connections));
router.get("/ws", async (ctx) => {
    const socket = await ctx.upgrade();
    handleWsConnection(socket);
  });


/*
 * ROUTES D'AUTHENTIFICATIONS
 */

// Route pour l'inscription
router.post("/register", authCtrl.register); 

// Route pour la connection
router.post("/login", authCtrl.login); 

// Route pour se déconnecter
router.post('/logout', authCtrl.logout);

// Route quand l'utilisateur est connecté
router.get('/', mw.authMw, userCtrl.getUser);

// Route securiser page profil

// Route protégée par authMw + adminMw
router.post("/api/upload-poster", uploadCtr.uploadPoster);

/*
 * ROUTES POUR LES FONCTIONNALITÉS DES UTILISATEURS 
 */

// Route pour vérifier si l'utilisateur est Admin ou non
router.get('/api/admin-access', mw.authMw, mw.adminMw);

// Route pour ajouter un film à la colletion
router.post('/api/collection', mw.authMw, userCtrl.addFilmCollection);

// Route pour récupérer la collection de l'utilisateur
router.get('/api/collection', mw.authMw, userCtrl.getUserCollection); 

// Route pour supprimer un film de la collection
router.delete('/api/collection', mw.authMw, userCtrl.deleteFilmCollection);

/*
 * ROUTES POUR LA GESTION DES FILMS
 */

// Route pour récupérer tous les films
router.get('/api/films',filmCtrl.getAllFilms); 

// Route pour ajouter un film à la db uniquement accessible par l'admin
router.post('/api/films',mw.authMw, mw.adminMw, filmCtrl.addFilm); 

// Route pour récupérer tous les films
router.get('/api/films/:id',filmCtrl.getFilm); 

// Route pour mettre à jour les données d'un film (Admin)
// ---> ici j'ai enlever mw.adminMw car le bouton qui permet cette fonctionnalité n'est pas visible au autres utilisateurs
router.put('/api/films/:id',filmCtrl.updateFilm);

// Route DELETE pour supprimer un film par ID de la base de donnée (Adim)
router.delete('/api/films/:id',mw.authMw, mw.adminMw,filmCtrl.deleteFilm);

/*
 * ROUTES POUR LA GESTION DES LISTES
 */

// Route pour créer une liste
router.post('/api/liste',mw.authMw, ListCtr.createList); 

// Fonction pour ajouter un film à la liste
router.post('/api/liste/:id', mw.authMw,ListCtr.addFilmToListe);

// Route pour récupérer les listes d'un utilisateurs
router.get('/api/liste',mw.authMw, userCtrl.getUserLists); 

// Route pour récupérer les films d'une liste
router.get('/api/liste/:id', ListCtr.getList);

// Route pour supprimer une liste
router.delete('/api/liste', mw.authMw, ListCtr.deleteList);

//recuperer toutes les listes accessible par tous
router.get('/api/listes', ListCtr.getAllListe);

// verifier si propriétaire de la liste
router.get('/api/liste/:id/owner', mw.authMw, ListCtr.getListeOwner);


/*
 * ROUTES POUR LA GESTION DES COMMENTAIRES
 */

// Route pour ajouter un commentaire au films
router.post('/api/films/:id/reviewsFilm',mw.authMw, reviewCtr.commentFilm);
router.get('/api/films/:id/reviewsFilm', reviewCtr.getFilmReview);

//Commenter un list
router.post('/api/liste/:id/reviewsList', mw.authMw, reviewCtr.commentList);
router.get('/api/liste/:id/reviewsList', reviewCtr.getListReview);


/*
* ROUTE POUR LA PAGE HOME
*/

// router.get('/api/home/films', HommeCtr.getlastfilm); // Récupérer les 5 derniers films ajoutés
router.get('/api/home/liste', HomeCtr.getlastList); // Récupérer les 5 dernières listes ajoutées
router.get("/api/home/top-films", HomeCtr.getTopRatedFilms);




