import {Context} from "https://deno.land/x/oak@v17.1.4/mod.ts";

// controllers/posterController.ts
export const uploadPoster = async (ctx: Context) => {
  try {
      // 1. Vérification du Content-Type
      const contentType = ctx.request.headers.get("content-type");
      if (!contentType?.includes("multipart/form-data")) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Content-Type must be multipart/form-data" };
        return;
      }
  
      // 2. Récupération du FormData (nouvelle API Oak v17)
      const formData = await ctx.request.body.formData();

      // 3. Récupération du fichier (remplacez "file" par votre nom de champ)
      const fileEntry = formData.get("posterImage"); // "file" doit matcher avec le nom du champ
      const filmTitle = formData.get("filmTitle");

      if (!fileEntry || typeof fileEntry === "string") {
        ctx.response.status = 400;
        ctx.response.body = { error: "Aucun fichier reçu ou champ incorrect" };
        return;
      }

      const safeTitle = filmTitle.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
      const extension = fileEntry.filename?.split(".").pop() || "jpg";
      const fileName = `${safeTitle}.${extension}`;
      const filePath = `./images/${fileName}`;


        const reader = fileEntry.stream().getReader();
        const { value: contentBuffer, done } = await reader.read();

        if (!contentBuffer || done) {
        ctx.response.status = 500;
        ctx.response.body = { error: "Fichier vide ou erreur de lecture" };
        return;
        }

        await Deno.mkdir("./images", { recursive: true }).catch(() => {});
        await Deno.writeFile(filePath, contentBuffer);

      // 6. Réponse
      ctx.response.status = 201;
      ctx.response.body = {
          success: true,
          path: `${fileName}`
      };
      console.log("réussiiiiii !")
  } catch (error) {
      console.error("Upload error:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Erreur lors du traitement du fichier" };
  }
};