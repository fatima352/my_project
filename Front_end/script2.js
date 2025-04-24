//Afficher mots de passe
document.getElementById("showPassword").addEventListener("change", function() {
    const pwdField = document.getElementById("password");
    pwdField.type = this.checked ? "text" : "password";
  });
