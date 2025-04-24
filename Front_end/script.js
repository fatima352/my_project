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
        // mode: 'cros',
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
    
    then(data => {
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
        // alert('Connection réussie!');
        window.location.href = "home.html"    
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

//fonction fetch pour affichier le profil de l'utilisateur
function profileUser(event){
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
                <img src="http://localhost:3000/images/${film.poster_url}" alt="${film.titel}" class="img">
                <a href="#" class="films-links">${film.titel}</a>
            `;
            filmsContainer.appendChild(filmsItem);
        });

    })
    .catch(error => {
        console.error('Error:', error);
        alert('Erreur: ' + error.message);
    });
}

  