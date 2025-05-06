// --- WebSocket connection ---
const socket = new WebSocket("ws://localhost:3000/ws");

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "NEW_FILM") {
        const film = message.data;
        alert(`Nouveau film ajouté : ${film.title}`);
        getMovies(); // recharge les films automatiquement
    }
    else if(message.type === "DELETE_FILM"){
        const film = message.data;
        alert(`Film supprimé : ${film.title}`);
        getMovies(); // recharge les films automatiquement
    }
    else if (message.type === "ADD_REVIEWFILM") {
        const film = message.data;
        alert(`Nouvelle critique ajoutée pour le film : ${film.title}`);
        getMovies(); // recharge les films automatiquement
    }
};

socket.onopen = () => console.log("WS connecté");
socket.onclose = () => console.log("WS déconnecté");