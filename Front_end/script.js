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

    console.log(data); // Log the data for debugging

    // Send the data to the backend using fetch
    fetch(`http://localhost:3000/register`, {
        method: 'POST',
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
                    throw new Error('Requête invalide. Veuillez vérifier vos informations.');
                case 401:
                    throw new Error('Nom d’utilisateur déjà pris. Veuillez réessayer.');
                case 500:
                    throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
                default:
                    throw new Error('Une erreur inconnue s’est produite.');
            }        }
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
                case 400:
                    throw new Error('Requête invalide. Veuillez vérifier vos informations.');
                case 401:
                    throw new Error('Nom d’utilisateur ou mot de passe invalide. Veuillez réessayer.');
                case 500:
                    throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
                default:
                    throw new Error('Une erreur inconnue s’est produite.');
            }
        }
    })
    .then(data =>{
        console.log(data)
        alert('Connection réussie!');
        // window.location.href = REDIRECTION VERS LA PAGE DU PROFIL
    })
    .catch(error => {
        console.error('Error', error);
        alert('Error: ' + error.message);
    })

}