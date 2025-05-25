/************************************************************ */
/*********************  FONCTIONS FETCHS  *********************/
/************************************************************ */


//récupérer utilisateur connecté (variable global)

/*--- 0) AUTHENTIFICATIONS ---*/

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
        // mode: 'cros',
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
        window.location.href = '/login.html';
    })
    .catch(error => {
        console.error('Error', error);
    })

}

function owner(){
    const params = new URLSearchParams(window.location.search);
    const listeId = params.get("id");
    fetch(`http://localhost:3000/api/liste/${listeId}/owner`, {
        method : 'GET',
        mode: 'cors',
        credentials: 'include'
   })
   .then(response => {
       if(response.ok){
           return response.json();
       }else{
           throw new Error('Erreur lors de la récupération des listes');
       }
   })
   .then(data => {
        //Bouton pour ajouter un film si propriétaire de la liste
        const ownerActions = document.getElementById("ownerActions");
        if (ownerActions) {
            const button = document.createElement("button");
            button.className = "btn-addFilm";
            button.innerText = "Add Film";
            button.onclick =  showPopup; 
            ownerActions.appendChild(button);
        }
        console.log(data);
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
                <li id="menu-lists">
                        <a href="lists.html" class="nav-link">
                            <span class="link-text">LISTS</span>
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
        if (data.profilePicturePath) {
            const ppImg = document.getElementById('previewPP');
            if (ppImg) {
                ppImg.src = data.profilePicturePath;
            }
        }
        //Ajouter un commentaire utilisateur
        const userActions = document.getElementById('userActionsFilm');
        if(userActions){
            const btnCommenter = document.createElement('button');
            btnCommenter.className = 'btn-addFilm';
            btnCommenter.innerText = 'Commenter';
            btnCommenter.onclick = showPopup4;
            userActions.appendChild(btnCommenter);
        }

        const userActionsList = document.getElementById('userActionsList');
        if(userActionsList){
            const btnCommenter = document.createElement('button');
            btnCommenter.className = 'btn-addFilm';
            btnCommenter.innerText = 'Commenter';
            btnCommenter.onclick = showPopup4;
            userActionsList.appendChild(btnCommenter);
        }


    })
    .catch(error => {
        console.error("Error:", error);
        const pageProfil = document.getElementById('profil');
        if(pageProfil){
            window.location.href = 'login.html';
        }
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
        console.log("Non admin ou non connecté :", error.message);
    });
}

// Fonction pour changer le mot de passe côté client
function changePassword(event) {
    event.preventDefault()
    const currentPassword = document.getElementById('currentPassword').value ;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    const data = {
        currentPassword,
        newPassword,
        confirmNewPassword
    }

    fetch(`http://localhost:3000/api/change-password`, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Erreur lors du changement de mot de passe');
            });
        }
    })
    .then(data => {
        console.log('Succès:', data.message);
        
        alert('Mot de passe modifié avec succès !');
        
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
    })
    .catch(error => {
        console.error('Erreur:', error.message);
        alert('Erreur: ' + error.message);
    });
}

/*------------------------------*/
/*--- 1)  FONCTIONNALTÉ USER  ----*/
/*------------------------------*/


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
    
    fetch(`http://localhost:3000/api/collection`, {
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
  
    })
    .catch(error => {
        console.log(error);
    });
}

// Fonction fetch pour récupérer la collection de l'utilisateur
function getUserCollection(){
    fetch(`http://localhost:3000/api/collection`, {
        method : 'GET',
        mode: 'cors',
        credentials: 'include'
    })
    .then(response => {
        if(response.ok){
            return response.json();
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

            deleteFilm.onclick = () => showDeleteFilmPopup(film.id);

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

// Fonction fetch pour commenter un film
function fetchCommenterFilm(){
    const contenu = document.getElementById('contenu').value;
    const rating = document.getElementById('rating').value;

    const params = new URLSearchParams(window.location.search);
    const idFilm = params.get("id");

    const data = {idFilm,contenu,rating};

    fetch(`http://localhost:3000/api/films/${idFilm}/reviewsFilm`, {
        method:'POST',
        mode : 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },        
        body: JSON.stringify(data)

    })
    .then(response =>{
        if(response.ok){
            return response.json();
        }else {
            switch(response.status){
                case 400:
                    alert("Requête invalide : Film introuvable");
                    throw new Error("Requête invalide : Film introuvable");
                case 401:
                    alert("Non autorisé : Utilisateur non connecté");
                    throw new Error("Non autorisé : Utilisateur non connecté");
                case 500:
                    alert("Erreur serveur : Veuillez réessayer plus tard");
                    throw new Error("Erreur serveur : Veuillez réessayer plus tard");
                default:
                    alert("Erreur inconnue : " + response.status);
                    throw new Error("Erreur inconnue : " + response.status);
            }
        }
        
    })
    .then(data=>{
        console.log("Réponse reçue : ", data);
        //recharger la page pour afficher le commentaire
        window.location.reload();
        alert(data.message);
    })
    .catch(error => {
        console.error("Erreur:", error.message);
    });
}

// Fonction fetch pour commenter un film
function fetchCommenterList(){
    const contenu = document.getElementById('contenu').value;

    const params = new URLSearchParams(window.location.search);
    const idList = params.get("id");

    const data = {idList,contenu};

    fetch(`http://localhost:3000/api/liste/${idList}/reviewsList`, {
        method:'POST',
        mode : 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },        
        body: JSON.stringify(data)

    })
    .then(response =>{
        if(response.ok){
            return response.json();
        }else {
            switch(response.status){
                case 400:
                    alert("Requête invalide : Film introuvable");
                    throw new Error("Requête invalide : Film introuvable");
                case 401:
                    alert("Non autorisé : Utilisateur non connecté");
                    throw new Error("Non autorisé : Utilisateur non connecté");
                case 500:
                    alert("Erreur serveur : Veuillez réessayer plus tard");
                    throw new Error("Erreur serveur : Veuillez réessayer plus tard");
                default:
                    alert("Erreur inconnue : " + response.status);
                    throw new Error("Erreur inconnue : " + response.status);
            }
        }
        
    })
    .then(data=>{
        console.log("Réponse reçue : ", data);
        alert(data.message);
    })
    .catch(error => {
        console.error("Erreur:", error.message);
    });
}

// Fonction fetch pour récupérer les commentaires d'un film
function getReviews(){
    const params = new URLSearchParams(window.location.search);
    const idFilm = params.get("id");

    fetch(`http://localhost:3000/api/films/${idFilm}/reviewsFilm`, {
        method:'GET',
        mode : 'cors'
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            switch(response.status){
                case 400:
                    alert("Requête invalide : Commentaire introuvable");
                    throw new Error("Requête invalide : Film introuvable");
                case 500:
                    alert("Erreur serveur : Veuillez réessayer plus tard");
                    throw new Error("Erreur serveur : Veuillez réessayer plus tard");
                default:
                    alert("Erreur inconnue : " + response.status);
                    throw new Error("Erreur inconnue : " + response.status);    
            }
        }
    })
    .then(data => {
        const reviewsContainer = document.getElementById('reviewsContainer');
        reviewsContainer.innerHTML = '';
        data.reviews.forEach(review => {
            const reviewItem = document.createElement('li');

            reviewItem.classList.add('item_review')
            reviewItem.innerHTML = `
               <div class="infoReview">
                <div class="user-meta">
                    <span class="username">${review.username}</span>
                    <span class="date">${review.date}</span>
                </div>
                <p class="reviewContenu">${review.contenu}</p>
               </div>
               
            `;
            reviewsContainer.appendChild(reviewItem);
        });
    })
}


// Fonction fetch pour récupérer les commentaires d'un film
function getReviewsList(){
    const params = new URLSearchParams(window.location.search);
    const idList = params.get("id");

    fetch(`http://localhost:3000/api/liste/${idList}/reviewsList`, {
        method:'GET',
        mode : 'cors'
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            switch(response.status){
                case 400:
                    alert("Requête invalide : Commentaire introuvable");
                    throw new Error("Requête invalide : Film introuvable");
                case 500:
                    alert("Erreur serveur : Veuillez réessayer plus tard");
                    throw new Error("Erreur serveur : Veuillez réessayer plus tard");
                default:
                    alert("Erreur inconnue : " + response.status);
                    throw new Error("Erreur inconnue : " + response.status);    
            }
        }
    })
    .then(data => {
        const reviewsContainer = document.getElementById('reviewsContainer');
        reviewsContainer.innerHTML = '';
        data.reviews.forEach(review => {
            const reviewItem = document.createElement('li');

            reviewItem.classList.add('item_review')
            reviewItem.innerHTML = `
               <div class="infoReview">
                <div class="user-meta">
                    <span class="username">${review.username}</span>
                    <span class="date">${review.date}</span>
                </div>
                <p class="reviewContenu">${review.contenu}</p>
               </div>
               
            `;
            reviewsContainer.appendChild(reviewItem);
        });
    })
}

/*--- 3) GESTIONS DES FILMS ---*/

// Fonction fetch pour récupérer les films du backend
function getMovies(event){
    // Fonction fetch qui récupere les inforamtion du backend, methode GET
    fetch(`http://localhost:3000/api/films`, {
        method : 'GET',
        mode: 'cors',
        credentials: 'include'
    })
    .then(response => {
        if(response.ok){
            return response.json();
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
                <a href="film.html?id=${film.id}" class="films-links">${film.title}</a>
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
async function fetchaddFilm() {

    const posterPath = await uploadPoster();
    if (!posterPath) return; 

    const title = document.getElementById('titlefilm').value;
    const date = document.getElementById('datefilm').value;
    const posterURL = posterPath 

    const description = document.getElementById('descriptionfilm').value;


    const data = {
        title,
        date,
        posterURL,
        description
    }

   
    fetch(`http://localhost:3000/api/films`, {
        method : 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data) 
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
async function fetchUpdateFilm() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const posterPath = await uploadPoster();
 

    if (!id) {
        console.error("Aucun ID trouvé dans l'URL");
        return;
    }

    // Récupérer les valeurs saisies par l'utilisateur
    const title = document.getElementById("titlefilm").value;
    const date = document.getElementById("datefilm").value;
    const posterURL = document.getElementById("posterUpload").value;
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

    fetch(`http://localhost:3000/api/films/${id}`, {
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

/*--- 4) GESTIONS DES LISTES ---*/

//Fonction fetch pour créer une liste
function fetchCreateList(){
    const listName = document.getElementById('nameList').value;
    const data = {listName};

    //fetch pour envoyer les données vers le backend (table liste)
    fetch(`http://localhost:3000/api/liste`, {
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
        }
    })
    .then(data =>{
        console.log(data);
    })
    .catch(error => {
        console.log(error);
        alert('Erreur: ' + error.message);
    });

}
 
//Fonction pour récupérer les listes de l'utilisateur
function getUserLists() {
    fetch(`http://localhost:3000/api/liste`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        // Gérer les erreurs de réponse
        throw new Error(`Erreur ${response.status}`);
    })
    .then(data => {
        const containerListe = document.getElementById('containerListe');
        if (!containerListe) {
            console.error("containerListe élément non trouvé dans le DOM.");
            return;
        }
        
        // Vérifier si data existe et si userList existe
        if (!data || !data.userList || data.userList.length === 0) {
            console.log('Aucune liste ou données undefined:', data);
            containerListe.innerHTML = '<p>Aucune liste</p>';
            return;
        }
        
        // Vider le conteneur avant d'ajouter les listes
        containerListe.innerHTML = '';
        
        // Parcourir et afficher les listes
        data.userList.forEach(list => {
            const listItem = document.createElement('li');
            const deleteBtn = document.createElement('button');

            deleteBtn.className = "btn-addFilm delete";
            deleteBtn.innerText = "X";

            //ici on recupere l'id de la liste qu'on souhaite supprimer
            deleteBtn.onclick = () => showDeleteListPopup(list.id);

            listItem.classList.add('item');
            listItem.innerHTML = `
                <a href="list.html?id=${list.id}" class="films-links" data-id="${list.id}">${list.name}</a>
            `;
            listItem.appendChild(deleteBtn);
            containerListe.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        
        // Afficher "Aucune liste" en cas d'erreur aussi
        const containerListe = document.getElementById('containerListe');
        if (containerListe) {
            containerListe.innerHTML = '<p>Aucune liste</p>';
        }
    });
}

//Fonction pour ajouter un film à une liste
function fetchaddFilmToListe() {
    const filmTitle = document.getElementById("titlefilm").value;
    const data = {filmTitle};
    
    const params = new URLSearchParams(window.location.search);
    const listeId = params.get("id");


    fetch(`http://localhost:3000/api/liste/${listeId}`, {
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
        console.error("Erreur:", error.message);
    });
}

//Fonction pour récupérer les films d'une liste
function getList(){
    const params = new URLSearchParams(window.location.search);
    const listeId = params.get("id");
    fetch(`http://localhost:3000/api/liste/${listeId}`, {
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
        titre.innerHTML = '';
        titre.innerHTML = `MOVIES IN THE LIST : ${data.nameList.name}`;
        
        let creatorInfo = document.getElementById("creator-info");
        if (!creatorInfo) {
            // S'il n'existe pas, le créer
            creatorInfo = document.createElement("p");
            creatorInfo.id = "creator-info";
            creatorInfo.classList.add("creator-info");
            titre.after(creatorInfo);
        }
      
      // Mettre à jour son contenu
      creatorInfo.innerHTML = `Created by : ${data.nameList.username}`;
      
        console.log(data);
    })

}

// Fonction pour supprimer une liste
function fetchDeleteList(listId) {

    fetch(`http://localhost:3000/api/liste`, {
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
        console.log("Suppression réussie");
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
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error('Erreur lors de la suppression du film');
        }
    })
    .then(data=>{
        console.log("Suppression réussie");
    })
    .catch(error => {
        console.log(error);
        alert('Erreur: ' + error.message);
    });
}


function getAllListe(){
    fetch(`http://localhost:3000/api/listes`,{
        method : 'GET',
        mode: 'cors',
        credentials: 'include'
   })
   .then(response => {
       if(response.ok){
           return response.json();
       }else{
           throw new Error('Erreur lors de la récupération des listes');
       }
   })
   .then(data => {
       const listesContainer = document.getElementById("listContainer");
       listesContainer.innerHTML = '';
        data.listes.forEach(liste => {
            const listeItem = document.createElement('li');
            listeItem.classList.add('item')
            listeItem.innerHTML = `
                <a href="list.html?id=${liste.id}" class="films-links">${liste.name}</a>
            `;
            listesContainer.appendChild(listeItem);

        });
        console.log(data);
    })

}
function getLastFilm(){
    fetch(`http://localhost:3000/api/home/films`, {
        method : 'GET',
        mode: 'cors',
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error('Erreur lors de la récupération des listes');
        }
    })
    .then(data => {
        const filmsContainer = document.getElementById('latestMoviesContainer');
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
                <div class="movie-card placeholder">
                        <div class="movie-poster">
                            <a href="film.html?id=${film.id}">
                        <img src="http://localhost:3000/images/${film.posterURL}" alt="${film.title}" class="movie-poster"> 
                          </a>
                        </div>
                </div>
                <a href="film.html?id=${film.id}" class="films-links">${film.title}</a>

            `;
            filmsContainer.appendChild(filmsItem);
        });

    })
}

function getlastListe(){
    fetch(`http://localhost:3000/api/home/liste`, {
        method : 'GET',
        mode: 'cors',
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error('Erreur lors de la récupération des listes');
        }
    })
    .then(data => {
        const listesContainer = document.getElementById('latestListsContainer');
        if (!listesContainer) {
            console.error("listesContainer pas trouver dans le DOM.");
            return;
        }
        
        // Clear container
        listesContainer.innerHTML = '';
        
        // Check if data and lists array exist
        if (!data || !data.list) {
            console.error("Données de listes non trouvées", data);
            listesContainer.innerHTML = '<div class="list-card">Aucune liste disponible</div>';
            return;
        }
        
        // Iterate through lists
        data.list.forEach(liste => {
            const listCard = document.createElement('div');
            listCard.className = 'list-card';
            
            // Utilisez "nameListe" au lieu de "name" pour correspondre à l'alias SQL
            const listName = liste.nameListe || "Liste sans nom";
            const listId = liste.id || "#";
            const username = liste.username || "Utilisateur inconnu";
            
            listCard.innerHTML = `
                <h3><a href="list.html?id=${listId}">${listName}</a></h3>
                <p>by ${username}</p>
            `;
            
            listesContainer.appendChild(listCard);
        });
        
        console.log("Listes récupérées:", data);
    })
    .catch(error => {
        console.error("Erreur lors du chargement des listes:", error);
        const listesContainer = document.getElementById('latestListsContainer');
        if (listesContainer) {
            listesContainer.innerHTML = '<div class="list-card">Erreur de chargement</div>';
        }
    });
}
/// iciiiiiiii

function getTopRatedFilms() {
    fetch(`http://localhost:3000/api/home/top-films`, {
        method: 'GET',
        mode: 'cors',
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error('Erreur lors de la récupération des films les mieux notés');
        }
    })
    .then(data => {
        const filmsContainer = document.getElementById('latestMoviesContainer');
        if (!filmsContainer) {
            console.error("topRatedFilmsContainer pas trouver dans le DOM.");
            return;
        }
        // Ajouter les films dans le DOM 
        filmsContainer.innerHTML = '';
        data.topFilms.forEach(film => {
            const filmsItem = document.createElement('li');
            filmsItem.classList.add('item')
            filmsItem.innerHTML = `
                <div class="movie-card placeholder">
                    <div class="movie-poster">
                        <a href="film.html?id=${film.id}">
                            <img src="http://localhost:3000/images/${film.posterURL}" alt="${film.title}" class="movie-poster"> 
                        </a>
                    </div>
                </div>
                <a href="film.html?id=${film.id}" class="films-links">${film.title}</a>
                <div class="rating">★ ${film.averageRating}/5</div>
            `;
            filmsContainer.appendChild(filmsItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Erreur: ' + error.message);
    });
}

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


let aSupprimer; // ID à supprimer

function showDeleteListPopup(id) {
    aSupprimer = id;
    document.getElementById('DeleteListPopup').classList.remove('hidden');
}

function showDeleteFilmPopup(id) {
    aSupprimer = id;
    document.getElementById('DeleteFilmPopup').classList.remove('hidden');
}

function closePopup3() {
    document.getElementById('DeleteListPopup').classList.add('hidden');
    document.getElementById('DeleteFilmPopup').classList.add('hidden');
    aSupprimer = null;
}

function deleteList(){
    fetchDeleteList(aSupprimer);
    closePopup3();
}

function deleteFilmColl(){
    fetchDeleteFilmCollec(aSupprimer);
    closePopup3();
}

// Fonction pour afficher la fenetre popup de l'ajout de film
function showPopup4() {
    const popup = document.getElementById('popupComment');
    popup.classList.remove('hidden');
}

// Fonction pour fermer la fenetre popup de l'ajout de film
function closePopup4() {
    const popup = document.getElementById('popupComment');
    popup.classList.add('hidden');
}

function commenterFilm(){
    fetchCommenterFilm();
    closePopup4();
    setTimeout(() => {
        initStarRating(); 
    }, 50);
}

function commenterList(){
    fetchCommenterList();
    closePopup4();
}

async function uploadPoster() {
    const fileInput = document.getElementById('posterUpload');
    const filmTitleInput = document.getElementById('titlefilm');
    const file = fileInput.files[0];
    const filmTitle = filmTitleInput.value.trim();
    
    if (!file) return null;


    const formData = new FormData();
    formData.append('posterImage', file);
    formData.append('filmTitle', filmTitle); 

    try {
        const response = await fetch('http://localhost:3000/api/upload-poster', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) throw await response.json();
        
        const data = await response.json();
        return data.path; 
    } catch (error) {
        console.error("Upload failed:", error);
        alert(`Échec de l'upload: ${error.error || 'Erreur serveur'}`);
        return null;
    }
}

async function uploadProfilePicture(username) {
    const fileInput = document.getElementById('ppInput');
    // const filmTitleInput = document.getElementById('');
    const file = fileInput.files[0];
    // const filmTitle = username.value.trim();
    
    if (!file) return null;


    const formData = new FormData();
    formData.append('posterImage', file);
    formData.append('filmTitle', username); 

    try {
        const response = await fetch('http://localhost:3000/api/upload-pp', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) throw await response.json();
        
        const data = await response.json();
        return data.path; 
    } catch (error) {
        console.error("Upload failed:", error);
        alert(`Échec de l'upload: ${error.error || 'Erreur serveur'}`);
        return null;
    }
}

// Updated function to initialize star rating component

function initStarRating() {
    const starRating = document.querySelector('.star-rating');
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    
    // Reset initial state
    stars.forEach(s => s.classList.remove('selected'));
    starRating.classList.remove('has-selection');
    ratingInput.value = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent any default action
            
            const rating = this.getAttribute('data-rating');
            ratingInput.value = rating;
            
            // Clear all selected stars first
            stars.forEach(s => s.classList.remove('selected'));
            
            // Mark the star rating container as having a selection
            starRating.classList.add('has-selection');
            
            // Apply selected class to this star and all stars before it
            for (let i = 0; i < stars.length; i++) {
                if (parseInt(stars[i].getAttribute('data-rating')) <= parseInt(rating)) {
                    stars[i].classList.add('selected');
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const starRatings = document.querySelectorAll('.star-rating');

    starRatings.forEach(container => {
        const stars = container.querySelectorAll('.star');
        const ratingInput = container.querySelector('input[type="hidden"]');

        stars.forEach(star => {
            // Gérer le clic sur une étoile
            star.addEventListener('click', function () {
                const rating = parseInt(this.getAttribute('data-rating'));
                setRating(container, stars, rating, ratingInput);
            });

            // Gérer le survol des étoiles
            star.addEventListener('mouseover', function () {
                if (!container.classList.contains('has-selection')) {
                    const rating = parseInt(this.getAttribute('data-rating'));
                    highlightStars(stars, rating);
                }
            });

            // Réinitialiser les étoiles au survol en dehors
            container.addEventListener('mouseout', function () {
                if (!container.classList.contains('has-selection')) {
                    resetStars(stars);
                }
            });
        });
    });

    // Fonction pour définir la notation
    function setRating(container, stars, rating, inputElement) {
        container.classList.add('has-selection'); // Marquer comme sélectionné
        if (inputElement) {
            inputElement.value = rating; // Mettre à jour l'input caché
        }

        // Réinitialiser toutes les étoiles
        stars.forEach(star => star.classList.remove('selected'));

        // Ajouter la classe `.selected` aux étoiles jusqu'à la sélection
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.add('selected');
            }
        });
    }

    // Fonction pour mettre en évidence les étoiles au survol
    function highlightStars(stars, rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.add('hovered');
            } else {
                star.classList.remove('hovered');
            }
        });
    }

    // Fonction pour réinitialiser les étoiles
    function resetStars(stars) {
        stars.forEach(star => star.classList.remove('hovered'));
    }
});
