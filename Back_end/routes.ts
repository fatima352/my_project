import {Router, Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";

import * as mw from "./middlewares.ts"; 

import * as userCtrl from "./controllers/contrUser.ts";//contreollers pour les fonctionnalité des utilisateurs
import * as authCtrl from "./controllers/contrAuth.ts";//controllers pour l'authentification
import * as filmCtrl from "./controllers/controFilm.ts";//controllers pour les fonctionnalité des films
import * as reviewCtr from "./controllers/contrReview.ts";//contreollers popur la gestion des commentaires
import * as ListCtr from "./controllers/contrListe.ts";

export const router = new Router();

const connections: WebSocket[] = [];  //stock les requetes 
// Route popur les ws
// router.get("/ws", mw.authMw, (ctx) => userCtrl.WebSocket(ctx, connections));// router.get("/register", cont.showRegister);//pour recupere la page register



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
router.post('/api/liste/:id/films', mw.authMw,ListCtr.addFilmToListe);

// Route pour récupérer les listes d'un utilisateurs
router.get('/api/liste',mw.authMw, userCtrl.getUserLists); 

// Route pour récupérer les films d'une liste
router.get('/api/liste/:id/films', ListCtr.getFilmsList);

// Route pour supprimer une liste
router.delete('/api/liste', mw.authMw, ListCtr.deleteList);


/*
 * ROUTES POUR LA GESTION DES COMMENTAIRES
 */

// Route pour ajouter un commentaire
router.post('/api/films/:id/reviews', reviewCtr.commentFilm);




//testes middlexware
// router.get("/api/test-auth", mw.authMw, (ctx) => {
//     ctx.response.body = {
//       message: "Access granted",
//       user: ctx.state.tokenData,
//     };
//   });
  


