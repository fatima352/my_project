import {Application, send} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import{router} from "./routes.ts"

const app = new Application();

if (Deno.args.length < 1) {
    console.log(`Usage: $ deno run --allow-net server.ts PORT [CERT_PATH KEY_PATH]`);
    Deno.exit();
  }

//modif https
let options: {
  port: number;
  secure?: boolean;
  certFile?: string;
  keyFile?: string;
} = {
  port: Number(Deno.args[0])
};

if (Deno.args.length >= 3) {
    options.secure = true;
    options.cert = await Deno.readTextFile(Deno.args[1]);
    options.key = await Deno.readTextFile(Deno.args[2]);
    console.log(`SSL conf ready (use https)`);
}

console.log(`Oak back server running on port ${options.port}`);

/**
 * Cros qui permet toutes les méthodes
 */
app.use(oakCors({
  origin: "https://localhost:8443",
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

// Lancement du serveur (HTTP ou HTTPS)
// console.log(`Serveur Oak lancé sur ${options.secure ? "https" : "http"}://localhost:${options.port}`);

await app.listen({ hostname: "192.168.1.152", port: 3000 });