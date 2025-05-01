/************************************************************ */
/*********************  FONCTIONS FETCHS  *********************/
/************************************************************ */


/*--- AUTHENTIFICATIONS ---*/

// Fonction fetch pour l'inscription
function registerUser(event) {
    event.preventDefault();

    // Récupération des valeurs saisies par l'utilisateur
    let username = document.getElementById("usernameReg").value;
    let email = document.getElementById("emailReg").value;
    let password = document.getElementById("passwordReg").value;

    const data = {
        username,
        email,
        password
    };

    //Envoyer les données vers le backend avec la méthode POST
    fetch(`http://localhost:3000/register`, {
        method: 'POST',
        mode: 'cros',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convertir les données en JSON

    })

    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            switch (response.status) {
                case 400:
                    alert('Utilisateur existe déjà. Veuillez réessayer.');
                    throw new Error('Nom d’utilisateur déjà pris. Veuillez réessayer.');
                case 500:
                    alert('Erreur serveur. Veuillez réessayer plus tard.');
                    throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
                default:
                    alert('Une erreur inconnue s’est produite.');
                    throw new Error('Une erreur inconnue s’est produite.');
            }        
        }
    })
    .then(data => {
        console.log(data); 
        alert('Inscription réussie !'); 
        window.location.href = "login.html"; // Rediriger vers la page de login
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message); 
    });
    
}

// Fonction fetch pour se connecter
function loginUser(event){
    event.preventDefault(); 

    // Récupération des valeurs saisies par l'utilisateur
    let username = document.getElementById("usernameLogin").value;
    let password = document.getElementById("passwordLogin").value;

    //Objet à envoyer vers le backend
    const data = {
        username,
        password
    };
    //Envoyer les données vers le backend avec la méthode POST
    fetch(`http://localhost:3000/login`, {
        method : 'POST',
        mode: 'cors',
        credentials : 'include',
        headers : {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(data)
    })
    .then(response => {
        if (response.ok){
            return response.json();
        }else{
            switch (response.status) {
                case 401:
                    alert('Nom d’utilisateur ou mot de passe invalide. Veuillez réessayer.');
                    throw new Error('Nom d’utilisateur ou mot de passe invalide. Veuillez réessayer.');
                case 500:
                    alert('Erreur serveur. Veuillez réessayer plus tard.');
                    throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
                default:
                    alert('Une erreur inconnue s’est produite.');
                    throw new Error('Une erreur inconnue s’est produite.');
            }
            // throw new Error('the token was not verified.');
        }
    })
    .then(data =>{
        console.log("response recu : ", data);
        // localStorage.setItem('token', data.token); // Store the token
        // alert('Connection réussie!');
        window.location.href = "index.html"    
        })
    .catch(error => {
        console.error('Error', error);
        alert('Error: ' + error.message);
    })

}

// Fonction fetch pour se deconnecter
function logoutUser(event) {
    // event.preventDefault();
    fetch(`http://localhost:3000/logout`, {
        method : 'POST',
        mode: 'cors',
        credentials : 'include'
    })

    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            switch (response.status){
                case 401:
                    throw new Error('Deconnexion échouée. Veuillez réessayer.')
                case 500:
                    throw new Error('Erreur serveur');
                default:
                    throw new Error('Erreur inconnue');
            }
        }
    })
    .then(data =>{
        console.log(data);
        alert('Deconnexion réussie !');
        // localStorage.removeItem('auth_token');// vu qu'
        window.location.href = '/login.html';
    })
    .catch(error => {
        console.error('Error', error);
        alert('Error:' + error.message);
    })

}

// Fonction pour vérifier la connection de  l'utilisateure
function authUser(event){

    //Fetch qui récupere les inforamtion du backend, methode GET
    fetch(`http://localhost:3000/`,
        {
            method : 'GET',
            mode: 'cors',
            credentials : 'include'
        }
    )
    .then(response =>{
        if (response.ok){
            return response.json();
        }else{
            throw new Error('pas connecté');
        }
    })
    .then(data => {
        console.log("User authenticated:", data);
        const menu = document.getElementById("menu")

        //Changer le header si utilisateur connecter
        if(menu){
            menu.innerHTML = '';
            menu.innerHTML = `
                <li id="menu-profil">
                <a href="profil.html" class="nav-link" id="username">
                    <span class="link-text">PROFIL</span>
                </a>
                </li>
                <li class="menu-home">
                    <a href="index.html" class="nav-link">
                        <span class="link-text">HOME</span>
                    </a>
                </li>
                <li id="menu-films">
                <a href="films.html" class="nav-link">
                    <span class="link-text">MOVIES</span>
                </a>
                </li>
                <li class="menu-logout">
                    <a href="#" class="nav-link" onclick="logoutUser()">
                    <span class="link-text">LOG OUT</span>
                    </a>
                </li>
            `;
        }
        document.getElementById("username").innerText = `@${data.username}`;
        //BOUTON POUR AJOUTER UN FILM A LA LISTE SI PROPREITAIRE
        // const UserAction = document.getElementById('UserAction');
        // if(UserAction){
        //     //bouton ajout film
        //     const buttonAdd = document.createElement("button");
        //     buttonAdd.className = "btn-addFilm";
        //     buttonAdd.innerText = "Add film";
        //     buttonAdd.onclick = showPopupEdit;//user
        //     UserAction.appendChild(buttonAdd);

        //     // //bouton supprimer list 
        //     // const buttonDelete = document.createElement("button");
        //     // buttonDelete.className = "btn-addFilm";
        //     // buttonDelete.innerText = "Add film";
        //     // buttonDelete.onclick = showPopupDeleteList;//user
        //     // UserAction.appendChild(buttonDelete);

        //     // //bouton modifier nom liste
        //     // const buttonUpdate = document.createElement("button");
        //     // buttonUpdate.className = "btn-addFilm";
        //     // buttonUpdate.innerText = "Add film";
        //     // buttonUpdate.onclick = showPopupEditList;//user
        //     // UserAction.appendChild(buttonUpdate);

        // }

})
    .catch(error => {
        console.error("Error:", error);
        // window.location.href = 'login.html';
    });
}

//Fonction pour vérifier si l'utilisateur a accès à la au fonctionnalité admin
function checkAdminAccess() {
    fetch('http://localhost:3000/api/admin-access', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Accès refusé');
        }
        return response.json();
    })
    .then(data => {
        //Bouton pour ajouter un film afficher dans la page "films.html"
        const adminAction = document.getElementById("adminAction");
        if (adminAction) {
            const button = document.createElement("button");
            button.className = "btn-addFilm";
            button.innerText = "Add Film";
            button.onclick =  showPopup; 
            adminAction.appendChild(button);
        }

        // pour modifier et supprimer un film apparait dans la page "films.html"
        const actionModif = document.getElementById("actionModif");
        if (actionModif) {
            const modifBtn = document.createElement("button");
            modifBtn.className = "btn-addFilm ";
            modifBtn.innerText = "Edit";
            modifBtn.onclick =  showPopup; 
            actionModif.appendChild(modifBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn-addFilm delete ";
            deleteBtn.innerText = "Delete";
            deleteBtn.onclick =  showPopup2; 
            actionModif.appendChild(deleteBtn);
        }
        console.log(data.message);
    })
    .catch(error => {
        console.warn("Non admin ou non connecté :", error.message);
    });
}


/*---  FONCTIONNALTÉ USER  ----*/

// Fonction fetch pour ajouter un film à la collection de l'utilisateur (PAS FONCTIONNEL)
function fetchAddMovieCollection(){
    const title = document.getElementById('titleMovie').value;
    // console.log("Recherche du film:", title);
    const data = {filmTitle: title};
    // const title = titleInput.value.trim();//supprmier les espace inutiles
    if (!title) {
        alert("Veuillez entrer un titre de film");
        return;
    }
    
    fetch(`http://localhost:3000/api/collection`,{
        method : 'POST',
        mode: 'cors',
        headers: {
             'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })
    .then(response =>{
        if (response.ok){
            return response.json();
        }else{
            switch(response.status) {
                case 401:
                    alert("Film indiponible dans la base de donées");
                    throw Error("Film indiponible dans la base de donées");
                case 404:
                    alert("Film déjà ajouter");
                    throw Error("Film déjà ajouter");
                default:
                    throw Error("Erreur inconnue: " + data.message);
            }
        }
    })
    .then(data =>{
        console.log(data);
        alert('Film ajouter');
        // window.location.href = 'profil.html';
    })
    .catch(error => {
        console.log(error);
        alert('Erreur: ' + error.message);
    });
}

function getUserCollection(){
    fetch(`http://localhost:3000/api/collection`,{
        method : 'GET',
        mode: 'cors',
        credentials: 'include'
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error('Erreur lors de la récupération des films');
        }
    })
    .then(data =>{
        const filmsContainer = document.getElementById('filmsContainer');
        if (!filmsContainer) {
            console.error("filmsContainer pas trouver dans le DOM.");
            return;
        }
        // Ajouter les films dans le DOM 
        filmsContainer.innerHTML = '';
        data.userCollection.forEach(film => {
            const filmsItem = document.createElement('li');
            const deleteFilm = document.createElement('button');

            deleteFilm.className = "btn-addFilm delete";
            deleteFilm.innerText = "X";

            deleteFilm.onclick = () => showPopup3(film.id);

            filmsItem.classList.add('item')
            filmsItem.innerHTML = `
               <a href="film.html?id=${film.id}">
                    <img src="http://localhost:3000/images/${film.posterURL}" alt="${film.title}" class="img"> 
                </a>
                <a href="film.html?id=${film.id}" class="films-links">${film.title}</a>
            `;
            filmsContainer.appendChild(filmsItem);
            filmsItem.appendChild(deleteFilm);
        });

    })
    .catch(error => {
        console.error('Error:', error);
        alert('Erreur: ' + error.message);
    });

}


/*--- GESTIONS DES FILMS ---*/

// Fonction fetch pour récupérer les films du backend
function getMovies(event){
    // Fonction fetch qui récupere les inforamtion du backend, methode GET
    fetch(`http://localhost:3000/api/films`,{
        method : 'GET',
        mode: 'cors',
        credentials: 'include'
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error('Erreur lors de la récupération des films');
        }
    })
    .then(data =>{
        const filmsContainer = document.getElementById('filmsContainer');
        if (!filmsContainer) {
            console.error("filmsContainer pas trouver dans le DOM.");
            return;
        }
        // Ajouter les films dans le DOM 
        filmsContainer.innerHTML = '';
        data.films.forEach(film => {
            const filmsItem = document.createElement('li');
            filmsItem.classList.add('item')
            filmsItem.innerHTML = `
               <a href="film.html?id=${film.id}">
                    <img src="http://localhost:3000/images/${film.posterURL}" alt="${film.title}" class="img"> 
                </a>
                <a href="infoFilm.html?id=${film.id}" class="films-links">${film.title}</a>
            `;
            filmsContainer.appendChild(filmsItem);
        });

    })
    .catch(error => {
        console.error('Error:', error);
        alert('Erreur: ' + error.message);
    });
}

// Fonction fetch pour ajouter un film à la base de donée (admin)
function fetchaddFilm(){
    // Récupérer les valeurs saisies par l'utilisateur
    const title = document.getElementById('titlefilm').value;
    const date = document.getElementById('datefilm').value;
    const posterURL = document.getElementById('posterURL').value;
    const description = document.getElementById('descriptionfilm').value;


    const data = {
        title,
        date,
        posterURL,
        description
    }

    // fetch qui envoie les données vers le backend
    fetch(`http://localhost:3000/api/films`,{
        method : 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data) // Convert the data object to JSON
    })
    .then(response => {
        if (!response.ok){
            switch (response.status) {
                case 400:
                    alert('Tous les champs sont obligatoires');
                    throw new Error('Tous les champs sont obligatoires');
                case 401:
                    alert('Token non valide, veuillez vous reconnecter');
                    throw new Error('Token non valide, veuillez vous reconnecter');

                case 403:
                    alert('Accès interdit, vous n\'êtes pas admin');
                    throw new Error('Accès interdit, vous n\'êtes pas admin');
                case 409:
                    alert('Film déjà existant');
                    throw new Error('Film déjà existant');
                case 500:
                    alert('Une erreur est survenue sur le serveur');
                    throw new Error('Une erreur est survenue sur le serveur');
                default:
                    alert('Une erreur inconnue est survenue');
                    throw new Error('Une erreur inconnue est survenue');
            } 
        }
        else{
            return response.json();
        }
    })
    .then(data => {
        console.log(data);
        alert('Film ajouté avec succès !');
        window.location.href = 'films.html';
    })

}

// Fonction fetch pour récupérer un film spécifique
function getMovie(){
    // Extraire l'id depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        console.error("Aucun ID trouvé dans l'URL");
        return;
    }
    // Fetch qui récupere les informations du backend, methode GET
    fetch(`http://localhost:3000/api/films/${id}`,{
        method: 'GET',
        mode: 'cors',
        credentials: 'include',

    })
    .then(response =>{
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error('Erreur lors de la récupération des données')
        }
    })
    .then(data =>{
        const film = data.film;
        console.log("FILM", film);

        //Ajouter le film dans le DOM
        document.getElementById("poster").innerHTML = `                    
            <img src="http://localhost:3000/images/${film.posterURL}" alt="${film.title}" class="poster"> 
            `;

        document.getElementById("titreFilm").innerText = film.title;
        
        //ajouter la decription
        document.getElementById("description-film").innerText =film.description;
    })
    .catch(error => {
        console.error("Erreur:", error.message);
    });
}

// Fonction fetch pour modifier un film (admin)
function fetchUpdateFilm() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        console.error("Aucun ID trouvé dans l'URL");
        return;
    }

    // Récupérer les valeurs saisies par l'utilisateur
    const title = document.getElementById("titlefilm").value;
    const date = document.getElementById("datefilm").value;
    const posterURL = document.getElementById("posterURL").value;
    const description = document.getElementById("descriptionfilm").value;

    // Créer un objet de données à envoyer au backend
    const data = {
        title,
        date,
        posterURL,
        description
    };

    // Envoyer les données vers le backend avec la méthode PUT
    fetch(`http://localhost:3000/api/films/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erreur lors de la mise à jour du film');
        }
    })
    .then(data => {
        console.log("Réponse reçue : ", data);
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Erreur: ' + error.message); 
    });
}

// Fonction pour supprimer un film (admin)
function fetchDeleteMovie(){
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        console.error("Aucun ID trouvé dans l'URL");
        return;
    }

    fetch(`http://localhost:3000/api/films/${id}`,{
        method: 'DELETE',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error('Erreur lors de la suppression du film');
        }
    })
    .then(data=>{
        console.log("Suppression réussie")
        alert(data.message);
        window.location.href = "films.html";
    })
    .catch(error => {
        console.log(error);
        alert('Erreur: ' + error.message);
    });
}


/*--- GESTIONS DES LISTES ---*/

//Fonction fetch pour créer une liste
function fetchCreateList(){
    const listName = document.getElementById('nameList').value;
    const data = {listName};

    //fetch pour envoyer les données vers le backend (table liste)
    fetch(`http://localhost:3000/api/liste`,{
        method : 'POST',
        mode: 'cors',
        headers: {
             'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })
    .then(response =>{
        if (response.ok){
            return response.json();
        }else{
            alert("Utilisateur non connecter");
            throw Error("Token non valide, utilisateur non connecter");
        }
    })
    .then(data =>{
        console.log(data);
        alert('List created');
        window.location.href = 'profil.html';
    })
    .catch(error => {
        console.log(error);
        alert('Erreur: ' + error.message);
    });

}
 
//Fonction pour récupérer les listes de l'utilisateur
function getUserLists(){
    fetch(`http://localhost:3000/api/liste`,{
        method : 'GET',
        mode: 'cors',
        credentials: 'include'
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error('Erreur lors de la récupération des listes');
        }
    })
    .then(data =>{
        const containerListe = document.getElementById('containerListe');
        if (!containerListe) {
            console.error("containerListe élément non trouvé dans le DOM.");
            return;
        }
        containerListe.innerHTML = '';
        data.userList.forEach(list => {
            const listItem = document.createElement('li');
            const deleteBtn = document.createElement('button');

            deleteBtn.className = "btn-addFilm delete";
            deleteBtn.innerText = "X";
            
            //ici on recupere l'id de la liste qu'on souhaite supprimer
            deleteBtn.onclick = () => showPopup3(list.id);

            listItem.classList.add('item')
            listItem.innerHTML = `
                <a href="list.html?id=${list.id}" class="films-links" data-id="${list.id}">${list.name}</a>
            `;
            listItem.appendChild(deleteBtn);
            containerListe.appendChild(listItem);
        });

    })
    .catch(error => {
        console.error('Error:', error);
        // alert('Erreur: ' + error.message);
    });

}

//Fonction pour ajouter un film à une liste
function fetchaddFilmToListe() {
    const filmTitle = document.getElementById("titlefilm").value;
    const data = {filmTitle};
    
    const params = new URLSearchParams(window.location.search);
    const listeId = params.get("id");


    fetch(`http://localhost:3000/api/liste/${listeId}/films`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok){
            return response.json();
        }else{
            switch (response.status) {
                case 400:
                    alert(data.message);
                    throw new Error(data.message);
                case 401:
                    alert(data.message);
                    throw new Error(data.message);
                case 409:
                    alert(data.message);
                    throw new Error(data.message);
                default:
                    alert('Film déjà ajouté dans la liste');
                    throw new Error('Film déjà ajouté dans la liste');
            } 
        }
    })
    .then(data => {
        alert("Film ajouté à la liste avec succès !");
        console.log(data);
    })
    .catch(error => {
        alert("Erreur : " + error.message);
    });
}

//Fonction pour récupérer les films d'une liste
function getFilmsList(){
    const params = new URLSearchParams(window.location.search);
    const listeId = params.get("id");
    fetch(`http://localhost:3000/api/liste/${listeId}/films`,{
        method : 'GET',
        mode: 'cors'
    })
    .then(response=>{
        if(response.ok){
            return response.json();
        }else{
            switch(response.status) {
                case 401:
                    alert(data.message);
                    throw Error(data.message);
                case 404:
                    alert(data.message);
                    throw Error(data.message);
                case 409:
                    alert(data.message);
                    throw Error(data.message);
                default:
                    throw Error("Erreur inconnue: " + data.message);
            }
        }

    })
    .then(data=>{
        const filmsContainer = document.getElementById("filmsContainer");
        filmsContainer.innerHTML = '';
        data.filmsListe.forEach(film => {
            const filmsItem = document.createElement('li');
            filmsItem.classList.add('item')
            filmsItem.innerHTML = `
               <a href="film.html?id=${film.id}">
                    <img src="http://localhost:3000/images/${film.posterURL}" alt="${film.title}" class="img"> 
                </a>
                <a href="film.html?id=${film.id}" class="films-links">${film.title}</a>
            `;
            filmsContainer.appendChild(filmsItem);

        });
        const titre = document.getElementById("nameList");
        const nameList = document.createElement("h3");
        nameList.innerHTML = '';
        nameList.innerHTML = `                
         <p class="titre">MOVIES IN THE LIST  ${data.nameList.name} </p>`;
        titre.appendChild(nameList);
        console.log(data);
    })

}

// Fonction pour supprimer une liste
function fetchDeleteList(listId) {

    fetch(`http://localhost:3000/api/liste`,{
        method: 'DELETE',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ listId: listId })
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error('Erreur lors de la suppression de la liste');
        }
    })
    .then(data=>{
        console.log("Suppression réussie")
        alert(data.message);
        window.location.href = "profil.html";
    })
    .catch(error => {
        console.log(error);
        alert('Erreur: ' + error.message);
    });
}

// Fonction pour supprimer un film de la collection
function fetchDeleteFilmCollec(filmId){
    fetch(`http://localhost:3000/api/collection`, {
        method : 'DELETE',
        mode : 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials : 'include',
        body : JSON.stringify({filmId : filmId})
    })
    .then(response=> {
        if(response.ok){
            return response.json();
        }else{
            throw new Error('Erreur lors de la suppression du film');
        }
    })
    .then(data=>{
        console.log("Suppression réussie")
        alert(data.message);
        window.location.href = "profil.html";
    })
    .catch(error => {
        console.log(error);
        alert('Erreur: ' + error.message);
    });

}


//teste mw
// async function testAuth() {
//     fetch(`http://localhost:3000/api/test-auth`, {
//         method: "GET",
//         mode: "cors",
//         credentials: "include",
//         // body: JSON.stringify(data)
//     })
//     .then(response => {
//         if(response.ok){
//             alert("yesss");
//             console.log("yesss")
//             return response.json();
//         }
//         else{
//             alert("pb mw")
//             console.log ("pb mw ");
//         }
//     })
//     .then(data=>{
//         console.log(data);
//         alert('yess');
//     })
//     .catch(error => {
//         console.log(error);
//         alert('Erreur: ' + error.message);
//     });
// }

  
/************************************************************ */
/*********************  AUTRES FONCTIONS  *********************/
/************************************************************ */

// --> Fonction popup pour ajouter un film/Update/créer une liste

// Fonction pour afficher la fenetre popup de l'ajout de film
function showPopup() {
    const popup = document.getElementById('addMoviePopup');
    popup.classList.remove('hidden');
}

// Fonction pour fermer la fenetre popup de l'ajout de film
function closePopup() {
    const popup = document.getElementById('addMoviePopup');
    popup.classList.add('hidden');
}

// Fonction pour ajouter un film et fermer la fenêtre après 
function addFilm(event) {
    fetchaddFilm(); // Call the existing addFilm function
    closePopup(); // Close the popup after submission
}
// Fonction pour modifier un film et fermer la fenêtre après
function updateFilm() {
    fetchUpdateFilm(); 
    closePopup(); 
}
// Fonction pour afficher la fenetre popup de la creation de liste
function CreateList(){
    fetchCreateList();
    closePopup();
}
// 
function addFilmList(){
    fetchaddFilmToListe();
    closePopup();
}

// --> Fonction popup pour ajouter un supprimer film db/ajouter film collection
function showPopup2() {
    const popup = document.getElementById('DeleteMoviePopup');
    popup.classList.remove('hidden');
}
function closePopup2() {
    const popup = document.getElementById('DeleteMoviePopup');
    popup.classList.add('hidden');
}

// Fonction pour supprimer un film et fermer la fenêtre après
function deleteMovie(){
    fetchDeleteMovie();
    closePopup2();
}

// Fonction pour ajouter un film à la collection et fermer la fenêtre après
function AddMovieCollection(){
    fetchAddMovieCollection();
    closePopup2();
}

// --> Fonction popup pour supprimer une liste apartir d'un bouton
let listeToDelete; // Variable pour stocker l'ID de la liste à supprimer

function showPopup3(listId) {

    listeToDelete = listId;
    const popupDeleteList = document.getElementById('DeleteListPopup');
    const popupDeleteFilm = document.getElementById('DeleteFilmPopup');

    if(popupDeleteList){
        popupDeleteList.classList.remove('hidden');
    }
    if(popupDeleteFilm){
        popupDeleteFilm.classList.remove('hidden');
    }
}

function closePopup3() {
    const popupDeleteList = document.getElementById('DeleteListPopup');
    const popupDeleteFilm = document.getElementById('DeleteFilmPopup');

    if(popupDeleteList){
        popupDeleteList.classList.add('hidden');
    }
    if(popupDeleteFilm){
        popupDeleteFilm.classList.add('hidden');
    }

    listeToDelete = null;
}

function deleteList(){
    fetchDeleteList(listeToDelete);
    closePopup3();
}

function deleteFilmColl(){
    fetchDeleteFilmCollec(listeToDelete);
    closePopup3();
}