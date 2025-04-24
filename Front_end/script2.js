//Afficher mots de passe
document.getElementById("showPassword").addEventListener("change", function() {
  const pwdField = document.getElementById("passwordLogin");
  const pwdField2 = document.getElementById("passwordReg");
  if(!pwdField){
    pwdField2.type = this.checked ? "text" : "password";
    return;
  }
  pwdField.type = this.checked ? "text" : "password";

});