function showPassword() {
  const password = document.getElementById("password");
  const isChecked = document.getElementById("showPassword").checked;
  
  password.type = isChecked ? "text" : "password"; // Use 'password' instead of 'pwdField'
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
