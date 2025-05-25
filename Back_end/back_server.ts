import {Application, send} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import{router} from "./routes.ts"

const app = new Application();

if (Deno.args.length < 1) {
    console.log(`Usage: $ deno run --allow-net --allow-read server.ts PORT [CERT_PATH KEY_PATH]`);
    Deno.exit();
}

// Configuration HTTPS modifiée
let options: {
  port: number;
  secure?: boolean;
  cert?: string;
  key?: string;
} = {
  port: Number(Deno.args[0])
};

// Si certificats fournis en arguments
if (Deno.args.length >= 3) {
    options.secure = true;
    options.cert = await Deno.readTextFile(Deno.args[1]);  // Lire le contenu du certificat
    options.key = await Deno.readTextFile(Deno.args[2]);   // Lire le contenu de la clé
    console.log(`SSL conf ready (use https)`);
}

console.log(`Oak back server running on port ${options.port}`);

/**
 * CORS modifié pour HTTPS
 */
app.use(oakCors({
  origin: [
    "https://localhost:8000", // Frontend HTTPS (port par défaut)
    "http://localhost:8000",  // Frontend HTTP (port par défaut) 
    "https://127.0.0.1:8000",
    "http://127.0.0.1:8000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true
}));

// Serve static files
app.use(async (ctx, next) => {
    const path = ctx.request.url.pathname;
    if (path.startsWith('/images/')) {
        try {
            const filePath = `.${path}`;
            ctx.response.body = await Deno.readFile(filePath);
            return;
        } catch {
            ctx.response.status = 404;
        }
    }
    await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

// Lancement du serveur avec les bonnes options
console.log(`Serveur Oak lancé sur ${options.secure ? "https" : "http"}://localhost:${options.port}`);

// Utiliser les options configurées au lieu du port en dur
await app.listen(options);