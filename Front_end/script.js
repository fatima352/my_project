//GESTION DES FONCTIONS DE LA PAGE LOGIN

const loginButton = document.getElementById('loginButton');

// redirection vers la page de connexion a partir de la page home
loginButton.addEventListener('click', () => {
    // Redirige vers la page de connexion
    window.location.href = 'login.html';
});




//FETCH 
function getData() {
    let login = document.getElementById("username").value
    let password = document.getElementById("password").value


    const data={
        username:login,
        password:password
    }

    console.log(data)

    fetch(`http://localhost:3000/login`, {
        method: 'POST',
        mode: 'cors',
        credentials : 'include',
        body: JSON.stringify(data) //tjrs mettre avec 
    })

    .then(response =>{
        if (response.ok){
            return response.json();
        }
        else{
            throw new Error('the token was not verified.');
        }
    })

    .then(data =>{
        console.log(data);
       // alert('token verified' + JSON.stringify(data.token_data));
        window.location.href = "index.html"
    })

    .catch(error =>{
        alert('error: '+ error.message);
    });
}


/****************************** messages *************************************/
let send_message_button = document.getElementById("send");
send_message_button.addEventListener("submit", function(event) {
    event.preventDefault(); 
    sendJson({ message: new_message.value, auth_token: localStorage.auth_token});
    new_message.value = " ";
});