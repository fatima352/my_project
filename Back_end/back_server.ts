import {Application, send} from "https://deno.land/x/oak@v17.1.4/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts"; // pour resoudre le probleme de oakCors
import{router} from "./routes.ts"
import { initWebSocket } from "./websocket.ts";

const app = new Application();

if (Deno.args.length < 1) {
    console.log(`Usage: $ deno run --allow-net server.ts PORT [CERT_PATH KEY_PATH]`);
    Deno.exit();
  }

const options = {port: Deno.args[0]}

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
  origin: "http://localhost:8000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true
}));

// Recupération des fichiers images 
app.use(async (ctx, next) => {
  if (ctx.request.url.pathname.startsWith("/images")) {
    const filePath = ctx.request.url.pathname.replace("/images", ""); // Remove "/images" prefix
    await send(ctx, filePath, {
      root: `${Deno.cwd()}/images`, // Correct path to the "images" folder
    });
  } else {
    await next();
  }
});

app.use(router.routes()); 
app.use(router.allowedMethods()); 

await app.listen({port: 3000}); 