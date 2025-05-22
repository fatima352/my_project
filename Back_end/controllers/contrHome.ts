import { db } from "../database/data.ts";
import * as mw from "../middlewares.ts";

// export const getlastfilm = (ctx) => {
//     try {
//         const films = db.prepare(`SELECT * FROM film ORDER BY id DESC LIMIT 5`).all(); // Fetch all films from the "film" table
//         ctx.response.status = 200;
//         ctx.response.body = { films }; // Return the films as JSON
//         console.log("Films récupérer avec succé");
//     } catch (error) {
//         console.error("Erreur lors de la récupérartion:", error);
//         ctx.response.status = 500;
//         ctx.response.body = { message: "Erreur lors de la récupération des films" };
//     }
// }



export const getlastList = (ctx) => {
    try {
        // Simplified query to avoid join issues
        const list = db.prepare(`
            SELECT liste.id, liste.name AS nameListe, users.username AS username 
            FROM liste 
            JOIN users ON liste.userId = users.id 
            ORDER BY liste.id DESC 
            LIMIT 3
        `).all();

        if (!list || list.length === 0) {
            ctx.response.status = 404;
            ctx.response.body = { message: "Aucune liste trouvée" };
            console.log("Aucune liste trouvée");
            return;
        }
        console.log(list);
        ctx.response.status = 200;
        ctx.response.body = { list };
        console.log("Listes récupérées avec succès");
    } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur lors de la récupération des listes" };
    }
};

export const getTopRatedFilms = (ctx) => {
    try {
        const topFilms = db.prepare(`
            SELECT 
                film.id,
                film.title, 
                film.posterURL,
                film.description,
                AVG(reviewsfilm.rating) AS averageRating,
                COUNT(reviewsfilm.id) AS reviewCount
            FROM 
                film
            LEFT JOIN 
                reviewsfilm ON film.id = reviewsfilm.filmId
            GROUP BY 
                film.id
            ORDER BY 
                AVG(reviewsfilm.rating) DESC
            LIMIT 5
        `).all();

        if (!topFilms || topFilms.length === 0) {
            ctx.response.status = 404;
            ctx.response.body = { message: "Aucun film noté trouvé" };
            console.log("Aucun film noté trouvé");
            return;
        }

        // Arrondir les moyennes pour chaque film
        topFilms.forEach(film => {
            const avg = Number(film.averageRating);
            film.averageRating = isNaN(avg) ? 0 : Math.round(avg * 10) / 10;
        });

        ctx.response.status = 200;
        ctx.response.body = { topFilms };
        console.log("Top 5 des films les mieux notés récupérés avec succès");
    } catch (error) {
        console.error("Erreur lors de la récupération des films les mieux notés:", error);
        ctx.response.status = 500;
        ctx.response.body = { message: "Erreur lors de la récupération des films les mieux notés" };
    }
};