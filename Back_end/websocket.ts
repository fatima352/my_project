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
    if(data.type === "ADD_TO_COLLECTION"){
      console.log("ADD_TO_COLLECTION");
    }
    if(data.type === "DELETE_FILM_COLLECTION"){
      console.log("DELETE_FILM_COLLECTION");
    }
    if(data.type === "ADD_LIST"){
      console.log("ADD_LIST");
    }
    if(data.type === "DELETE_LIST"){
      console.log("DELETE_LIST");
    }
    if(data.type === "ADD_FILM_LIST"){
      console.log("ADD_FILM_LIST");
    }
    if(data.type === "UPDATE_FILM"){
      console.log("UPDATE_FILM");
    }
  };
  socket.close()
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

export function notifyFilmAddedToCollection(filmData: any) {
  const message = JSON.stringify({
    type: "ADD_TO_COLLECTION",
    data: filmData,
  });

  sockets.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  });
}


export function notifyDeleteFilmCollection(filmData: any) {
  const message = JSON.stringify({
    type: "DELETE_FILM_COLLECTION",
    data: filmData,
  });

  sockets.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  });
}

export function notifyListCreated(listData: any) {
  const message = JSON.stringify({
    type: "ADD_LIST",
    data: listData,
  });

  sockets.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  });
}
export function notifyDeleteList(listData: any) {
  const message = JSON.stringify({
    type: "DELETE_LIST",
    data: listData,
  });

  sockets.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  });
}

export function notifyAddFilmList(listData: any) {
  const message = JSON.stringify({
    type: "ADD_FILM_LIST",
    data: listData,
  });

  sockets.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  });
}

export function notifyUpdateFilm(filmData: any) {
  const message = JSON.stringify({
    type: "UPDATE_FILM",
    data: filmData,
  });

  sockets.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  });
}