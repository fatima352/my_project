
/*********************  FONCTIONS FETCHS  *********************/
//fonction fetch pour s'inscrire
function registerUser(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Récupération des valeurs saisies par l'utilisateur
    let username = document.getElementById("usernameReg").value;
    let email = document.getElementById("emailReg").value;
    let password = document.getElementById("passwordReg").value;

    // Create the data object to send to the backend
    const data = {
        username: username,
        email: email,
        password: password
    };

    // console.log(data); // Log the data for debugging

    // Send the data to the backend using fetch
    fetch(`http://localhost:3000/register`, {
        method: 'POST',
        mode: 'cros',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convert the data object to JSON

    })

    .then(response => {
        if (response.ok) {
            return response.json(); // Parse the JSON response
        } else {
            switch (response.status) {
                case 400:
                    alert('Utilisateur existe déjà. Veuillez reessayer.');
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
        console.log(data); // Log the response from the backend
        alert('Inscription réussie !'); // Notify the user
        window.location.href = "login.html"; // Redirect to the login page
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message); // Notify the user of the error
    });
    
}

//fonction fetch pour se loguer
function loginUser(event){
    event.preventDefault(); // Prevent the form from refreshing the page
    // Récupération des valeurs saisies par l'utilisateur
    let username = document.getElementById("usernameLogin").value;
    let password = document.getElementById("passwordLogin").value;

    // Create the data object to send to the backend
    const data = {
        username: username,
        password: password
    };

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

//fonction fetch pour se deconnecter
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

//fonction fetch pour recuperer les information de l'utilisateur avec l'id
function getUser(event){
    // // Extraire l'id depuis l'URL
    // const params = new URLSearchParams(window.location.search);
    // const id = params.get("id");

    // if (!id) {
    //     console.error("Aucun ID trouvé dans l'URL");
    //     return;
    // }
    fetch(`http://localhost:3000/api/user`,
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
        // Display user information on the profile page
        document.getElementById("username").innerText = `@${data.username}`;
        // document.getElementById("role").innerText = `Role: ${data.role}`;
    })
    .catch(error => {
        console.error("Error:", error);
        window.location.href = "login.html";
    });
}

function authUser(event){
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
        // Display user information on the profile page
        // document.getElementById("role").innerText = `Role: ${data.role}`;
        const menu = document.getElementById("menu")
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
    })
    .catch(error => {
        console.error("Error:", error);
        // window.location.href = 'login.html';
    });
}

//fonction fetch pour recupperer les films
function getMovies(event){
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
            throw new Error('Erreur lors de la récuperation des films');
        }
    })
    .then(data =>{
        const filmsContainer = document.getElementById('filmsContainer');
        if (!filmsContainer) {
            console.error("filmsContainer element not found in the DOM.");
            return;
        }

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

//FONCTION FETCH PPUR AJOUTER UN FILM
function fetchaddFilm(){
    const title = document.getElementById('titlefilm').value;
    const date = document.getElementById('datefilm').value;
    const posterURL = document.getElementById('posterURL').value;
    const description = document.getElementById('descriptionfilm').value;


    const data = {
        title : title,
        date : date,
        posterURL: posterURL,
        description: description
    }

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
                    alert('Tous les champs sont obligatoires ou mal formatés');
                    throw new Error('Tous les champs sont obligatoires ou mal formatés');
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

//fonction pour recupere les informations d'un film
function getMovie(){
    // Extraire l'id depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        console.error("Aucun ID trouvé dans l'URL");
        return;
    }
    fetch(`http://localhost:3000/api/films/${id}`,{
        method: 'GET',
        mode: 'cors',
        credentials: 'include',

    }
    )
    .then(response =>{
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error('Erreur lors de la recuperation des donées')
        }
    })
    .then(data =>{
        const film =data.film;
        console.log("FILM", film);

        //ajouter image
        document.getElementById("poster").innerHTML = `                    
            <img src="http://localhost:3000/images/${film.posterURL}" alt="${film.title}" class="poster"> 
            `;

        // Titre du film
        document.getElementById("titreFilm").innerText = film.title;
        
        //ajouter la decription
        document.getElementById("description-film").innerText =film.description;
    })
    .catch(error => {
        console.error("Erreur:", error.message);
    });
}

function fetchUpdateFilm() {
    // Récupérer les valeurs saisies par l'utilisateur
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        console.error("Aucun ID trouvé dans l'URL");
        return;
    }

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
        alert(data.message); // Afficher un message de succès
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Erreur: ' + error.message); // Afficher une erreur en cas de problème
    });
}

//fonction fetch pour verifier l'admin
function checkAdminAccess() {
    fetch('http://localhost:3000/api/admin-access', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            // Si la réponse n’est pas 200, on redirige vers home ou login
            throw new Error('Accès refusé');
        }
        return response.json();
    })
    .then(data => {
        const adminAction = document.getElementById("adminAction");
        if (adminAction) {
            const button = document.createElement("button");
            button.className = "btn-addFilm";
            button.innerText = "Add Film";
            button.onclick =  showPopup; 
            adminAction.appendChild(button);
        }

        // PAGE PROFIL (film individuel)
        const actionModif = document.getElementById("actionModif");
        if (actionModif) {
            const modifBtn = document.createElement("button");
            modifBtn.className = "btn-addFilm ";
            modifBtn.innerText = "Edit";
            modifBtn.onclick =  showPopupEdit; 
            actionModif.appendChild(modifBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn-addFilm delete ";
            deleteBtn.innerText = "Delete";
            deleteBtn.onclick =  showPopupDelete; 
            actionModif.appendChild(deleteBtn);
        }
        
        console.log(data.message); // Affiche "Accès autorisé"
    })
    .catch(error => {
        console.warn("Non admin ou non connecté :", error.message);
        // window.location.href = 'index.html'; // ou login.html si pas connecté
    });
}
//fonction pour supprimer film
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

//function fetch pour cree une liste
function fetchCreateList(){
    const listName = document.getElementById('nameList').value;
    const data = {listName};

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

//fonction fetch pour pemettre a l'utilisateur d'ajouter un film a sa collection
function fetchUserAddmovie(){
    const title = document.getElementById('titleMovie').value;
    const data = {title};

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
            switch(response.status){
                case 401:
                    alert("Utilisateur non connecter");
                    throw Error("Token non valide, utilisateur non connecter");
                case 404:
                    alert("Film introuvable");
                    throw Error("Film introuvable, pas disponible dans la base de donnée");
                default:
                    throw Error("Erreur inconnue");
            }
        }
    })
    .then(data =>{
        console.log(data);
        alert('Film ajouter');
        window.location.href = 'profil.html';
    })
    .catch(error => {
        console.log(error);
        alert('Erreur: ' + error.message);
    });
}


/* ************************** AUTRES FONCTIONS ************************** */
//fonction pour ouvrir popup page pour ajouter un film
function showPopup() {
    const popup = document.getElementById('addMoviePopup');
    popup.classList.remove('hidden');
}
//fonction pour fermer popup page pour ajouter un film
function closePopup() {
    const popup = document.getElementById('addMoviePopup');
    popup.classList.add('hidden');
}

//fonction pour ajouter un film et fermer la fenetre après 
function addFilm(event) {
    fetchaddFilm(); // Call the existing addFilm function
    closePopup(); // Close the popup after submission
}

//modifier film
//fonction pour les popup pages pour modifier un film
function showPopupEdit() {
    const popup = document.getElementById('addMoviePopup');
    popup.classList.remove('hidden');
}
//fermer fenetre popup edit  
function closePopupEdit() {
    const popup = document.getElementById('addMoviePopup');
    popup.classList.add('hidden');
}

//fonction pour ajouter dees
function updateFilm() {
    fetchUpdateFilm(); // Call the existing addFilm function
    closePopup(); // Close the popup after submission
}

//fonction pour supprimer un film
function showPopupDelete() {
    const popup = document.getElementById('DeleteMoviePopup');
    popup.classList.remove('hidden');
}

function closePopupDelete() {
    const popup = document.getElementById('DeleteMoviePopup');
    popup.classList.add('hidden');
}

function deleteMovie(){
    fetchDeleteMovie();
    closePopupDelete();
}

//function ouvrir fenetre pop up cree liste 
function showPopupcreateList() {
    const popup = document.getElementById('creatListPopup');
    popup.classList.remove('hidden');
}

function closePopupCreateList() {
    const popup = document.getElementById('creatListPopup');
    popup.classList.add('hidden');
}

function CreateList(){
    fetchCreateList();
    closePopupCreateList();
}


//function ouvrir fenetre pop up ajouter film a la collection (cote utilisateur)
function showPopupUserAdd() {
    const popup = document.getElementById('AddFilmPopup');
    popup.classList.remove('hidden');
}

function closePopupUserAdd() {
    const popup = document.getElementById('AddFilmPopup');
    popup.classList.add('hidden');
}

function userAddmovie(){
    fetchUserAddmovie();
    closePopupUserAdd();
}





