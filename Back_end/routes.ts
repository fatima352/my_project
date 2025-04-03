import {register, login} from "./controllers.ts";
import {Router} from "https://deno.land/x/oak@v17.1.4/mod.ts";

export const router = new Router();
router.post("/register", register); //route pour l'inscription
router.post("/login", login); //route pour la connection
