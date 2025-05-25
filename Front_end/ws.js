const socket = new WebSocket("wss://localhost:3000/ws");


socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "NEW_FILM") {
        const film = message.data;
        showNotification(`Nouveau film ajouté : ${film.title}`);
        getMovies(); 
    }
    else if(message.type === "DELETE_FILM"){
        const film = message.data;
        showNotification(`Film supprimé : ${film.title}`)
        getMovies(); 
    }

    else if (message.type === "ADD_LIST") {
        const list = message.data;
        getUserLists();
        showNotification(`Liste "${list.name}" ajoutée`);
    }
    else if (message.type === "DELETE_LIST") {
        const list = message.data;
        getUserLists();
        showNotification(`Liste "${list.name}" supprimée`);
    }
    else if (message.type ==="ADD_FILM_LIST"){
        getList();
    }
    else if (message.type === "UPDATE_FILM") {
        const film = message.data;
        getMovie();
        showNotification(`Film "${film.title}" mis à jour`);
    }
};

function showNotification(message) {
    let notification = document.getElementById('ws-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'ws-notification';
        notification.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#40648d; color:white; padding:12px 20px; border-radius:4px; box-shadow:0 2px 10px rgba(0,0,0,0.2); opacity:0; transition:opacity 0.3s ease;';
        document.body.appendChild(notification);
    }
    notification.textContent = message;
    notification.style.opacity = '1';

    setTimeout(() => {
        notification.style.opacity = '0';
    }, 3000);
}

socket.onopen = () => console.log("WS connecté");
socket.onclose = () => console.log("WS déconnecté");