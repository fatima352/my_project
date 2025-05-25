# Moview

Moview est un site web inspiré de [Letterboxd](https://letterboxd.com), destiné aux passionnés de cinéma. Il permet de gérer sa collection de films, créer des listes, noter, commenter et explorer les contenus des autres utilisateurs.

---

## Fonctionnalités principales

- Authentification : inscription, connexion, changement de mot de passe
- Accueil : dernières listes créées, films les mieux notés
- Films :
  - Ajout/modification/suppression (admin uniquement)
  - Détails (titre, description, affiche)
  - Ajouter/supprimer de sa collection
  - Notation (1 à 5 étoiles)
  - Commentaires
- Listes :
  - Création et suppression
  - Ajout/retrait de films
  - Commentaires
- Interface dynamique selon le rôle (admin/utilisateur)
- Sécurité des accès via `fetch()` avec `credentials: 'include'`

---

##  Technologies

- **Frontend** : HTML, CSS, JavaScript (vanilla)
- **Backend** : Deno (API REST)
- Requêtes HTTP avec `fetch()`, gestion CORS + cookies
- Upload via `FormData` pour les affiches

---

## Installation

> Recommandé : navigateur **Firefox**

1. Lancer le front à `http://localhost:PORTFRONT`
2. Commandes :
   - Frontend :  
     `deno run --allow-net --allow-read --allow-write front_server.ts 8000`
   - Backend :  
     `deno run --allow-net --allow-read --allow-write back_server.ts 3000`
3. Ouvrir `index.html` dans le navigateur
4. Créer un compte utilisateur
5. Pages disponibles : `login.html`, `register.html`, `films.html`, `list.html`, `profil.html`

---

## Améliorations possibles

- Ajout d’une API pour faciliter l’ajout de films
- Meilleure gestion des WebSockets
- Recherche avancée
- Suppression d’un film d’une liste (propriétaire)
- Gestion des commentaires (admin)
- Système de notifications ou messagerie
