// backend/ws.ts

import { Application } from "https://deno.land/x/oak/mod.ts";

// Stockage des connexions WebSocket
const sockets = new Set<WebSocket>();

// Fonction pour diffuser un message à tous les clients connectés
function broadcast(message: string): void {
  for (const socket of sockets) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  }
}

// Fonction pour initialiser WebSocket
export function initWebSocket(app: Application): void {
  // Gestion des connexions WebSocket
  app.use(async (ctx, next) => {
    if (ctx.request.url.pathname === "/ws") {
      const socket = await ctx.upgrade();
      
      sockets.add(socket);
      
      socket.onopen = () => {
        console.log("Nouveau client WebSocket connecté");
      };
      
      socket.onmessage = (event) => {
        // Tu peux gérer les messages entrants ici si besoin
        console.log("Message reçu:", event.data);
      };
      
      socket.onclose = () => {
        sockets.delete(socket);
        console.log("Client WebSocket déconnecté");
      };
    } else {
      await next();
    }
  });
}

// Fonction pour notifier les nouveaux films
export function notifyNewFilm(filmData: any): void {
  broadcast(JSON.stringify({
    type: "NEW_FILM",
    data: filmData
  }));
}