// backend/ws.ts

const sockets: WebSocket[] = [];

// Ajouter un nouveau client
export function handleWsConnection(socket: WebSocket) {
  console.log("WebSocket connecté...");
  sockets.push(socket);

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

  socket.onmessage = (event) => {
    console.log("Message reçu du client :", event.data);

    const data = JSON.parse(event.data);
    if (data.type === "NEW_FILM") {
      console.log("Nouveau film ajouté:", data.title);
    }
    if (data.type === "DELETE_FILM") {
      console.log("Film supprimé:", data.title);
    }
  };
  socket.close()
}

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