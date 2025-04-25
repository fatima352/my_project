//Afficher mots de passe
function showPassword() {
  const pwdField = document.getElementById("passwordLogin");
  const pwdField2 = document.getElementById("passwordReg");
  const isChecked = document.getElementById("showPassword").checked;

  if (pwdField) {
    pwdField.type = isChecked ? "text" : "password";
  }
  if (pwdField2) {
    pwdField2.type = isChecked ? "text" : "password";
  }
}

document.querySelectorAll(".btn-add").forEach(btn => {
  if (btn.textContent.includes("Créer liste")) {
    btn.addEventListener("click", () => {
      document.getElementById("popup").classList.remove("hidden");
    });
  }
});

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

function createList() {
  const name = document.getElementById("listName").value;
  if (!name) {
    alert("Entrez un nom de liste");
    return;
  }
  // Ici tu peux envoyer vers ton backend ou ajouter dynamiquement
  console.log("Liste créée:", name);
  closePopup();
}
