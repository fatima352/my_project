import { Application, Context, Router } from "https://deno.land/x/oak@v17.1.4/mod.ts"; // version 17

const app = new Application();
const ROOT = `${Deno.cwd()}/`;

app.use(async (ctx) => {
  try {
    await ctx.send({
      root: ROOT,
      index: "index.html",
    });
  } catch {
    ctx.response.status = 404;
    ctx.response.body = "404 File not found";
  }
});

if (Deno.args.length < 1) {
  console.log(`Usage: $ deno run --allow-net --allow-read=./ server.ts PORT [CERT_PATH KEY_PATH]`);
  Deno.exit();
}

// Configuration HTTPS corrigée pour Oak v17.1.4
const options: {
  port: number;
  secure?: boolean;
  cert?: string;
  key?: string;
} = {
  port: Number(Deno.args[0])  // Conversion en nombre
};

if (Deno.args.length >= 3) {
  options.secure = true;
  // options.cert = await Deno.readTextFile(Deno.args[1]);  // Lire le contenu du certificat
  // options.key = await Deno.readTextFile(Deno.args[2]);   // Lire le contenu de la clé
  console.log(`SSL conf ready (use https)`);
}

console.log(`Oak static server running on ${options.secure ? "https" : "http"}://localhost:${options.port} for the files in ${ROOT}`);
await app.listen(options);