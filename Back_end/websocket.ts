// backend/ws.ts

const sockets: WebSocket[] = [];

// Ajouter un nouveau client
export function handleWsConnection(socket: WebSocket) {
  console.log("WebSocket connecté...");
  sockets.push(socket);
  console.log("Client WebSocket connecté");

  socket.onclose = () => {
    const index = sockets.indexOf(socket);
    if (index > -1) sockets.splice(index, 1);
    console.log("Client WebSocket déconnecté");
  };

  socket.onerror = () => {
    const index = sockets.indexOf(socket);
    if (index > -1) sockets.splice(index, 1);
    console.log("Erreur WebSocket");
  };

  // Tu peux aussi gérer les messages reçus si besoin
  socket.onmessage = (event) => {
    console.log("Message reçu du client :", event.data);

    const data = JSON.parse(event.data);
    if (data.type === "NEW_FILM") {
      // Traitez le message ici si nécessaire
      console.log("Nouveau film ajouté:", data.title);
    }
    if (data.type === "DELETE_FILM") {
      // Traitez le message ici si nécessaire
      console.log("Film supprimé:", data.title);
    }
    if (data.type === "ADD_REVIEWFILM") {
      // Traitez le message ici si nécessaire
      console.log("Nouvelle critique ajoutée:", data.title);
    }
  };
}

// Notifier tous les clients
export function notifyNewFilm(filmData: any) {
  const message = JSON.stringify({
    type: "NEW_FILM",
    data: filmData,
  });

  sockets.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  });
}

export function notifyDeleteFilm(filmData: any) {
  const message = JSON.stringify({
    type: "DELETE_FILM",
    data: filmData,
  });

  sockets.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  });
}

export function notifyNewReviewFilm(reviewData: any ){
  const message = JSON.stringify({
    type: "ADD_REVIEWFILM",
    data: reviewData,
  });
  sockets.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  });
}
