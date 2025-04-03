import * as cont from "./controllers.ts";
import {Router} from "https://deno.land/x/oak@v17.1.4/mod.ts";

export const router = new Router();

// router.get("/register", cont.showRegister);//pour recupere la page register
router.post("/register", cont.register); //route pour l'inscription
router.post("/login", cont.login); //route pour la connection
