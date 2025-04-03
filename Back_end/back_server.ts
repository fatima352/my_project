import {Application } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import{router} from "./routes.ts"
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

app.use(router.routes()); 
app.use(router.allowedMethods()); 

await app.listen({port: 3000}); 